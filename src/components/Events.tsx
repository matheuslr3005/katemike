import { useRef, useState, type MouseEvent } from 'react'
import { photos } from '../assets/photos'
import { events, type GigEvent } from '../data/events'
import { useI18n, type Lang } from '../i18n'
import { contactLink } from '../config/site'
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic } from './Magnetic'

const LOCALES: Record<Lang, string> = { en: 'en-IE', pt: 'pt-BR' }

const formatDate = (iso: string, lang: Lang) => {
  const date = new Date(`${iso}T00:00:00`)
  const day = new Intl.DateTimeFormat(LOCALES[lang], { day: '2-digit' }).format(date)
  const month = new Intl.DateTimeFormat(LOCALES[lang], { month: 'short' }).format(date)
  return { day, month: month.replace('.', '') }
}

export const Events = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<GigEvent | null>(null)

  useGSAP(
    () => {
      const el = root.current
      const pv = preview.current
      if (!el) return
      setupReveals(el)

      if (!prefersReducedMotion()) {
        gsap.utils.toArray<HTMLElement>('.event').forEach((row, i) => {
          gsap.from(row.querySelector('.event__line'), {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'expo.out',
            delay: i * 0.05,
            scrollTrigger: { trigger: row, start: 'top 92%', once: true },
          })
        })
      }

      if (!pv || !isFinePointer() || prefersReducedMotion()) return
      const xTo = gsap.quickTo(pv, 'x', { duration: 0.5, ease: 'power3.out' })
      const yTo = gsap.quickTo(pv, 'y', { duration: 0.5, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        xTo(e.clientX)
        yTo(e.clientY)
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const showPreview = (event: GigEvent | null) => {
    setHovered(event)
    gsap.to(preview.current, {
      opacity: event ? 1 : 0,
      scale: event ? 1 : 0.8,
      rotate: event ? gsap.utils.random(-5, 5) : 0,
      duration: 0.4,
      ease: 'power3.out',
      overwrite: true,
    })
  }

  const notify = (e: MouseEvent) => {
    e.preventDefault()
    scrollToTarget('#vip')
  }

  return (
    <section ref={root} id="events" className="events section">
      <div className="wrap">
        <p className="label" data-reveal>{t.events.label}</p>
        <div className="events__head">
          <h2 className="display" data-split="lines">{t.events.title}</h2>
          <p className="events__sub" data-reveal>{t.events.sub}</p>
        </div>

        <ul className="events__list" onPointerLeave={() => showPreview(null)}>
          {events.map((event) => {
            const date = event.date ? formatDate(event.date, lang) : null
            return (
              <li
                key={event.id}
                className="event"
                onPointerEnter={() => showPreview(event)}
                data-reveal
              >
                <span className="event__line" />
                <span className="event__date">
                  {date ? (
                    <>
                      <b>{date.day}</b>
                      <i>{date.month}</i>
                    </>
                  ) : (
                    <b className="event__tba">{t.events.tba}</b>
                  )}
                </span>
                <span className="event__where">
                  <strong>{event.city}</strong>
                  <em>{event.country}</em>
                </span>
                <span className="event__venue">{event.venue}</span>
                <a
                  className="event__action"
                  href={event.url ?? '#vip'}
                  onClick={event.url ? undefined : notify}
                  target={event.url ? '_blank' : undefined}
                  rel={event.url ? 'noreferrer' : undefined}
                >
                  {t.events.cta}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            )
          })}
        </ul>

        <div className="events__book" data-reveal>
          <p className="events__book-title">{t.events.bookTitle}</p>
          <Magnetic>
            <a className="btn btn--gold" href={contactLink('Booking — Kat & Mike')} target="_blank" rel="noreferrer">
              {t.events.bookCta}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </Magnetic>
        </div>
      </div>

      <div ref={preview} className="events__preview" aria-hidden="true">
        {hovered && <img src={photos[hovered.photo]} alt="" />}
      </div>
    </section>
  )
}
