import { useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { lockScroll } from '../lib/scroll'

type DeckIntroProps = { onExit: () => void }

const LOAD_SECONDS = 1.8
const FONT_TIMEOUT_MS = 2500
const SPIN_33 = 200 // deg/s — a "33 rpm" feel
const ARM_ORIGIN = '700 100'
const ARM_REST = 10
const ARM_LAND = 30
const ARM_END = 50

const GROOVES = [262, 250, 238, 226, 214, 203, 192, 181, 171, 161, 151, 141, 132, 123, 115]
const PITCH_TICKS = Array.from({ length: 11 }, (_, i) => 214 + i * 24.6)

/**
 * Opening scene: a top-down DJ turntable. The record spins up, the tonearm drops and
 * tracks the loading progress, then the camera dives into the red label and an iris
 * opens from the spindle hole, revealing the site "inside" the record.
 */
export const DeckIntro = ({ onExit }: DeckIntroProps) => {
  const { t } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const camera = useRef<HTMLDivElement>(null)
  const disc = useRef<SVGGElement>(null)
  const vinylBase = useRef<SVGCircleElement>(null)
  const label = useRef<SVGCircleElement>(null)
  const spindle = useRef<SVGCircleElement>(null)
  const percent = useRef<HTMLSpanElement>(null)
  const skipRef = useRef<() => void>(() => undefined)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        onExit()
        setGone(true)
        return
      }
      const overlay = root.current
      const cam = camera.current
      const ringEl = ring.current
      if (!overlay || !cam || !ringEl) return

      lockScroll(true)

      /* Platter: angular speed is a tweened value, integrated every frame. */
      const spin = { speed: 0 }
      let rotation = 0
      const tick = (_time: number, deltaMs: number) => {
        rotation = (rotation + (spin.speed * deltaMs) / 1000) % 360
        if (disc.current) disc.current.style.transform = `rotate(${rotation}deg)`
      }
      gsap.ticker.add(tick)

      const progress = { value: 0 }
      let fontsReady = false
      let introDone = false
      let diving = false

      const dive = (fast: boolean) => {
        if (diving) return
        diving = true
        const k = fast ? 0.55 : 1
        const vw = window.innerWidth
        const vh = window.innerHeight
        const cx = vw / 2
        const cy = vh / 2

        gsap.set('.deck', { opacity: 1, y: 0, scale: 1, filter: 'none' })
        const spindleBox = spindle.current?.getBoundingClientRect()
        const labelBox = label.current?.getBoundingClientRect()
        const vinylBox = vinylBase.current?.getBoundingClientRect()
        if (!spindleBox || !labelBox || !vinylBox) {
          onExit()
          setGone(true)
          lockScroll(false)
          return
        }

        const sx = spindleBox.left + spindleBox.width / 2
        const sy = spindleBox.top + spindleBox.height / 2
        const reach = Math.hypot(vw, vh) / 2
        const scaleFit = (Math.min(vw, vh) * 0.84) / vinylBox.width
        const scaleFill = (reach * 1.08) / (labelBox.width / 2)
        const hole = { r: 0 }

        const applyHole = () => {
          overlay.style.setProperty('--hole', `${hole.r}px`)
          ringEl.style.width = ringEl.style.height = `${hole.r * 2}px`
          ringEl.style.opacity = hole.r > 2 ? String(Math.max(0, 1 - hole.r / (reach * 1.1))) : '0'
        }

        gsap.set(cam, { transformOrigin: `${sx}px ${sy}px` })

        gsap
          .timeline({
            onComplete: () => {
              gsap.ticker.remove(tick)
              lockScroll(false)
              setGone(true)
            },
          })
          .to('.deck__arm', { rotation: ARM_REST, svgOrigin: ARM_ORIGIN, duration: 0.7 * k, ease: 'power2.inOut' }, 0)
          .to('.deck__arm', { opacity: 0, duration: 0.4 * k }, 0.5 * k)
          .to('.deck__ui, .intro__hud', { opacity: 0, duration: 0.5 * k, ease: 'power2.out' }, 0.05)
          .to(cam, { x: cx - sx, y: cy - sy, scale: scaleFit, duration: 1.0 * k, ease: 'power3.inOut' }, 0.15 * k)
          .to(spin, { speed: 1400, duration: 2.0 * k, ease: 'power2.in' }, 0.3 * k)
          .to('.deck__detail, .deck__well, .deck__sheen', { opacity: 0, duration: 0.4 * k, ease: 'power1.in' }, 1.3 * k)
          .set('.deck__detail, .deck__well, .deck__sheen', { display: 'none' }, 1.75 * k)
          .to(cam, { scale: scaleFill, duration: 1.1 * k, ease: 'expo.in' }, 1.15 * k)
          .add('iris', 2.25 * k)
          .add(() => onExit(), 'iris+=0.1')
          .to(hole, { r: reach * 1.1, duration: 1.25 * k, ease: 'expo.inOut', onUpdate: applyHole }, 'iris')
      }

      const maybeDive = () => {
        if (introDone && fontsReady) dive(false)
      }

      skipRef.current = () => {
        intro.kill()
        progress.value = 100
        if (percent.current) percent.current.textContent = '100'
        dive(true)
      }

      void Promise.race([document.fonts.ready, new Promise((resolve) => window.setTimeout(resolve, FONT_TIMEOUT_MS))]).then(() => {
        fontsReady = true
        maybeDive()
      })

      gsap.set('.deck__arm', { rotation: ARM_REST, svgOrigin: ARM_ORIGIN })

      const intro = gsap
        .timeline({
          onComplete: () => {
            introDone = true
            maybeDive()
          },
        })
        .from('.deck', { opacity: 0, y: 60, scale: 0.92, duration: 0.9, ease: 'power3.out' }, 0)
        .from('.intro__hud', { opacity: 0, duration: 0.5 }, 0.4)
        .to('.deck__start-btn', { scale: 0.9, transformOrigin: '50% 50%', duration: 0.12, yoyo: true, repeat: 1 }, 0.75)
        .to('.deck__led', { opacity: 1, duration: 0.2 }, 0.8)
        .to(spin, { speed: SPIN_33, duration: 1.3, ease: 'power2.in' }, 0.8)
        .to('.deck__arm', { rotation: ARM_LAND, svgOrigin: ARM_ORIGIN, duration: 0.9, ease: 'power2.inOut' }, 1.0)
        .to('.deck__arm', { rotation: ARM_END, svgOrigin: ARM_ORIGIN, duration: LOAD_SECONDS, ease: 'none' }, 1.9)
        .to('.deck__pitch-cap', { y: -26, duration: LOAD_SECONDS, ease: 'sine.inOut' }, 1.9)
        .to(
          progress,
          {
            value: 100,
            duration: LOAD_SECONDS,
            ease: 'none',
            onUpdate: () => {
              if (percent.current) percent.current.textContent = String(Math.round(progress.value))
            },
          },
          1.9,
        )

      return () => {
        gsap.ticker.remove(tick)
      }
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <>
      <div ref={root} className="intro" role="status" aria-label={t.a11y.loading}>
        <div className="intro__light" aria-hidden="true" />
        <div ref={camera} className="intro__camera">
          <svg className="deck" viewBox="0 0 800 640" role="img" aria-label={t.a11y.deck}>
            <defs>
              <linearGradient id="deck-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#262628" />
                <stop offset="1" stopColor="#0e0e0f" />
              </linearGradient>
              <linearGradient id="deck-metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e4e4e8" />
                <stop offset="0.35" stopColor="#6c6c72" />
                <stop offset="0.62" stopColor="#cfcfd4" />
                <stop offset="1" stopColor="#4d4d52" />
              </linearGradient>
              <radialGradient id="deck-sheen" cx="32%" cy="26%" r="85%">
                <stop offset="0" stopColor="#fff" stopOpacity="0.2" />
                <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="deck-label" cx="40%" cy="35%" r="75%">
                <stop offset="0" stopColor="#f2554d" />
                <stop offset="1" stopColor="#c92a23" />
              </radialGradient>
              <path id="deck-label-arc" d="M 320 320 m -76 0 a 76 76 0 1 1 152 0 a 76 76 0 1 1 -152 0" />
            </defs>

            {/* Chassis + controls */}
            <g className="deck__ui">
              <rect x="6" y="6" width="788" height="628" rx="34" fill="url(#deck-body)" stroke="#2f2f32" strokeWidth="2" />
              <rect x="14" y="14" width="772" height="612" rx="28" fill="none" stroke="#fff" strokeOpacity="0.05" />
              {[[34, 34], [766, 34], [34, 606], [766, 606]].map(([x, y]) => (
                <g key={`${x}-${y}`}>
                  <circle cx={x} cy={y} r="7" fill="#1a1a1c" stroke="#3a3a3e" />
                  <path d={`M${(x ?? 0) - 4} ${y} L${(x ?? 0) + 4} ${y}`} stroke="#555" strokeWidth="1.5" />
                </g>
              ))}

              {/* Pitch fader */}
              <rect x="742" y="200" width="12" height="270" rx="6" fill="#050506" stroke="#333" />
              {PITCH_TICKS.map((y, i) => (
                <path key={y} d={`M${i % 5 === 0 ? 720 : 728} ${y} L738 ${y}`} stroke="#6d6d72" strokeWidth={i % 5 === 0 ? 2 : 1} />
              ))}
              <g className="deck__pitch-cap">
                <rect x="730" y="318" width="36" height="58" rx="6" fill="#2a2a2d" stroke="#4a4a4f" />
                <rect x="746" y="322" width="4" height="50" rx="2" fill="#d6a93b" />
              </g>

              {/* Buttons */}
              <g className="deck__start-btn">
                <circle cx="700" cy="566" r="34" fill="#121213" stroke="url(#deck-metal)" strokeWidth="3" />
                <circle cx="700" cy="566" r="25" fill="#1d1d20" />
                <circle className="deck__led" cx="700" cy="566" r="9" fill="#e8372f" opacity="0.18" />
              </g>
              <text x="700" y="620" textAnchor="middle" className="deck__txt">START/STOP</text>
              {[[660, 500, '33'], [722, 500, '45']].map(([x, y, txt]) => (
                <g key={String(txt)}>
                  <circle cx={x} cy={y} r="16" fill="#18181a" stroke="#454549" />
                  <text x={x} y={Number(y) + 4} textAnchor="middle" className="deck__txt deck__txt--sm">{txt}</text>
                </g>
              ))}
              <text x="404" y="624" textAnchor="middle" className="deck__txt deck__txt--brand">K&amp;M · SL-1200 · GROOVE BASS EDITION</text>
            </g>

            {/* Platter well (static) */}
            <circle className="deck__well" cx="320" cy="320" r="300" fill="#08080a" stroke="url(#deck-metal)" strokeWidth="5" />

            {/* Spinning platter + record */}
            <g ref={disc} className="deck__disc">
              <g className="deck__detail">
              <circle cx="320" cy="320" r="293" fill="#1a1a1d" />
              <circle cx="320" cy="320" r="286" fill="none" stroke="#6a6a70" strokeWidth="7" strokeDasharray="2.4 7.4" />
              <circle ref={vinylBase} cx="320" cy="320" r="274" fill="#0b0b0c" />
              {GROOVES.map((r) => (
                <circle key={r} cx="320" cy="320" r={r} fill="none" stroke="#2c2c2f" strokeWidth="0.9" />
              ))}
              <circle cx="320" cy="320" r="274" fill="none" stroke="#222" strokeWidth="2" />
              </g>
              <circle ref={label} cx="320" cy="320" r="100" fill="url(#deck-label)" />
              <circle cx="320" cy="320" r="100" fill="none" stroke="#0a0a0a" strokeOpacity="0.25" />
              <text className="deck__label-text" fill="#0a0a0a">
                <textPath href="#deck-label-arc" startOffset="0" textLength="470" lengthAdjust="spacing">
                  KAT &amp; MIKE · GROOVE BASS · STREET FUNK · SÃO PAULO · DUBLIN ·
                </textPath>
              </text>
              <rect x="316" y="226" width="8" height="26" rx="4" fill="#0a0a0a" opacity="0.35" />
            </g>
            <circle className="deck__sheen" cx="320" cy="320" r="274" fill="url(#deck-sheen)" />
            <circle ref={spindle} cx="320" cy="320" r="7" fill="url(#deck-metal)" stroke="#111" />

            {/* Tonearm (drawn pointing down from its pivot; rotated by GSAP) */}
            <g className="deck__arm">
              <g>
                <rect x="686" y="38" width="28" height="48" rx="7" fill="#2b2b2e" stroke="#4a4a4f" />
                <rect x="686" y="54" width="28" height="5" fill="#d6a93b" opacity="0.9" />
                <rect x="696" y="82" width="8" height="24" fill="#8c8c92" />
              </g>
              <path d="M700 100 L700 336 Q700 368 676 390" fill="none" stroke="#000" strokeOpacity="0.4" strokeWidth="11" strokeLinecap="round" transform="translate(5 6)" />
              <path d="M700 100 L700 336 Q700 368 676 390" fill="none" stroke="url(#deck-metal)" strokeWidth="8" strokeLinecap="round" />
              <g transform="translate(676 390) rotate(-24)">
                <rect x="-17" y="-6" width="34" height="30" rx="4" fill="#1a1a1c" stroke="#58585d" />
                <rect x="-9" y="14" width="18" height="14" rx="2" fill="#e8372f" />
              </g>
              <circle cx="700" cy="100" r="34" fill="#18181a" stroke="url(#deck-metal)" strokeWidth="3" />
              <circle cx="700" cy="100" r="16" fill="url(#deck-metal)" stroke="#222" />
            </g>
          </svg>
        </div>

        <div className="intro__hud">
          <span className="intro__loading">{t.intro.loading}</span>
          <span className="intro__pct">
            <span ref={percent}>0</span>
            <i>%</i>
          </span>
        </div>
        <button type="button" className="intro__skip" onClick={() => skipRef.current()}>
          {t.intro.skip}
        </button>
      </div>
      <div ref={ring} className="intro-ring" aria-hidden="true" />
    </>
  )
}
