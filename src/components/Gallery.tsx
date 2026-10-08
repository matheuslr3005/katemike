import { useRef } from 'react'
import { photos, type PhotoKey } from '../assets/photos'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'
import { scrollState } from '../lib/scroll'

type Shot = { key: PhotoKey; ratio: string }

const shots: readonly Shot[] = [
  { key: 'duoParty', ratio: '5 / 4' },
  { key: 'mikeMic', ratio: '2 / 3' },
  { key: 'katDeck', ratio: '3 / 2' },
  { key: 'mikeGreen', ratio: '2 / 3' },
  { key: 'katHeart', ratio: '4 / 5' },
]

export const Gallery = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const reel = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current
      const strip = reel.current
      if (!el || !strip) return
      setupReveals(el)

      /* Drag-to-scroll */
      let startX = 0
      let startScroll = 0
      let dragging = false
      const down = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return
        dragging = true
        startX = e.clientX
        startScroll = strip.scrollLeft
        strip.setPointerCapture(e.pointerId)
        strip.classList.add('is-dragging')
      }
      const move = (e: PointerEvent) => {
        if (dragging) strip.scrollLeft = startScroll - (e.clientX - startX)
      }
      const up = (e: PointerEvent) => {
        dragging = false
        strip.classList.remove('is-dragging')
        if (strip.hasPointerCapture(e.pointerId)) strip.releasePointerCapture(e.pointerId)
      }
      strip.addEventListener('pointerdown', down)
      strip.addEventListener('pointermove', move)
      strip.addEventListener('pointerup', up)
      strip.addEventListener('pointercancel', up)

      let stopTilt: (() => void) | undefined
      if (!prefersReducedMotion()) {
        /* Cards lean with vertical scroll velocity. */
        const setSkew = gsap.quickSetter('.shot', 'skewY', 'deg')
        let skew = 0
        const tick = () => {
          skew += (gsap.utils.clamp(-4, 4, scrollState.velocity * 0.25) - skew) * 0.1
          setSkew(skew)
        }
        gsap.ticker.add(tick)
        stopTilt = () => gsap.ticker.remove(tick)

        gsap.fromTo(
          '.shot',
          { clipPath: 'inset(0% 0% 100% 0% round 24px)', y: 60 },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            y: 0,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.12,
            scrollTrigger: { trigger: strip, start: 'top 85%', once: true },
          },
        )
      }

      return () => {
        stopTilt?.()
        strip.removeEventListener('pointerdown', down)
        strip.removeEventListener('pointermove', move)
        strip.removeEventListener('pointerup', up)
        strip.removeEventListener('pointercancel', up)
      }
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section ref={root} className="gallery section" aria-labelledby="gallery-title">
      <div className="wrap">
        <p className="label" data-reveal>{t.gallery.label}</p>
        <h2 key={lang} id="gallery-title" className="display" data-split="lines">{t.gallery.title}</h2>
      </div>
      <div ref={reel} className="reel" data-cursor={t.cursor.drag} tabIndex={0} role="group" aria-label={t.gallery.title}>
        {shots.map((shot) => (
          <figure key={shot.key} className="shot" style={{ aspectRatio: shot.ratio }}>
            <img src={photos[shot.key]} alt={t.alts[shot.key]} loading="lazy" draggable={false} />
          </figure>
        ))}
      </div>
    </section>
  )
}
