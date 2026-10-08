import { useRef } from 'react'
import { photos } from '../assets/photos'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'

/** Split-screen "crossfader": slide to give Kat or Mike more of the stage. */
export const Duo = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const fader = useRef<HTMLInputElement>(null)
  const mix = useRef({ value: 0.5 })

  const apply = () => {
    stage.current?.style.setProperty('--mix', mix.current.value.toFixed(4))
    if (fader.current) fader.current.value = String(Math.round(mix.current.value * 100))
  }

  const moveTo = (value: number, duration = 0.7) =>
    gsap.to(mix.current, { value, duration, ease: 'power3.out', onUpdate: apply, overwrite: true })

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      setupReveals(el)
      apply()
      if (prefersReducedMotion()) return

      /* Hint animation the first time the stage scrolls into view. */
      gsap
        .timeline({ scrollTrigger: { trigger: stage.current, start: 'top 70%', once: true } })
        .to(mix.current, { value: 0.12, duration: 0.9, ease: 'power3.inOut', onUpdate: apply })
        .to(mix.current, { value: 0.88, duration: 1.3, ease: 'power3.inOut', onUpdate: apply })
        .to(mix.current, { value: 0.5, duration: 0.9, ease: 'elastic.out(1,0.6)', onUpdate: apply })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section ref={root} className="duo section" aria-labelledby="duo-title">
      <div className="wrap">
        <p className="label" data-reveal>{t.duo.label}</p>
        <h2 key={lang} id="duo-title" className="display duo__title" data-split="lines">{t.duo.title}</h2>
      </div>

      <div ref={stage} className="duo__stage" style={{ '--mix': 0.5 } as React.CSSProperties}>
        <figure className="duo__panel duo__panel--kat">
          <img src={photos.katHeart} alt={t.alts.katHeart} loading="lazy" />
          <figcaption className="duo__name">{t.duo.kat}</figcaption>
        </figure>
        <figure className="duo__panel duo__panel--mike">
          <img src={photos.mikeMic} alt={t.alts.mikeMic} loading="lazy" />
          <figcaption className="duo__name">{t.duo.mike}</figcaption>
        </figure>
      </div>

      <div className="wrap">
        <div className="duo__controls" data-reveal>
          <button type="button" className="duo__side" onClick={() => moveTo(0.05)}>{t.duo.kat}</button>
          <div className="crossfader">
            <input
              ref={fader}
              type="range"
              min={0}
              max={100}
              defaultValue={50}
              aria-label={t.duo.hint}
              onChange={(e) => {
                gsap.killTweensOf(mix.current)
                mix.current.value = Number(e.currentTarget.value) / 100
                apply()
              }}
              data-cursor={t.cursor.drag}
            />
            <span className="crossfader__hint">{t.duo.hint}</span>
          </div>
          <button type="button" className="duo__side" onClick={() => moveTo(0.95)}>{t.duo.mike}</button>
        </div>
        <p className="duo__caption" data-reveal>{t.duo.caption}</p>
      </div>
    </section>
  )
}
