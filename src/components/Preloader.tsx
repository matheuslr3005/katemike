import { useRef, useState } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { lockScroll } from '../lib/scroll'
import { Vinyl } from './Vinyl'

type PreloaderProps = { onExit: () => void }

const MIN_DURATION_S = 1.8
const FONT_TIMEOUT_MS = 2500

export const Preloader = ({ onExit }: PreloaderProps) => {
  const root = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const [gone, setGone] = useState(false)

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        onExit()
        setGone(true)
        return
      }

      lockScroll(true)
      const progress = { value: 0 }
      let fontsReady = false
      let intro: gsap.core.Timeline | null = null

      const fontGate = Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, FONT_TIMEOUT_MS)),
      ]).then(() => {
        fontsReady = true
        if (intro && intro.progress() >= 1) leave()
      })
      void fontGate

      const leave = () => {
        gsap
          .timeline({
            onComplete: () => {
              lockScroll(false)
              setGone(true)
            },
          })
          .add(() => onExit())
          .to('.preloader__inner', { opacity: 0, y: -40, duration: 0.5, ease: 'power2.in' })
          .to(root.current, { yPercent: -100, duration: 1, ease: 'expo.inOut' }, '-=0.1')
      }

      intro = gsap
        .timeline({ onComplete: () => fontsReady && leave() })
        .from('.preloader__word', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' })
        .from('.preloader__vinyl', { scale: 0.4, opacity: 0, rotate: -120, duration: 1.1, ease: 'expo.out' }, 0)
        .to(
          progress,
          {
            value: 100,
            duration: MIN_DURATION_S,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(progress.value)).padStart(3, '0')
            },
          },
          0,
        )
    },
    { scope: root },
  )

  if (gone) return null

  return (
    <div ref={root} className="preloader" role="status" aria-label="Loading">
      <div className="preloader__inner">
        <Vinyl className="preloader__vinyl" speed={4} />
        <p className="preloader__title" aria-hidden="true">
          <span className="preloader__mask"><span className="preloader__word">Kat</span></span>
          <span className="preloader__mask"><span className="preloader__word preloader__word--amp">&amp;</span></span>
          <span className="preloader__mask"><span className="preloader__word">Mike</span></span>
        </p>
        <span ref={counter} className="preloader__count">000</span>
      </div>
    </div>
  )
}
