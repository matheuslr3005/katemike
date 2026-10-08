import { useCallback, useEffect, useRef, useState } from 'react'
import { photos } from '../assets/photos'
import { contactLink } from '../config/site'
import { films, type Film, type FilmKind } from '../data/films'
import { localize, useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'
import { scrollToTarget } from '../lib/scroll'
import { copyText, filmIdFromHash, filmLink } from '../lib/share'
import { youtubeThumb } from '../lib/video'
import { FilmLightbox } from './FilmLightbox'
import { Magnetic } from './Magnetic'

type Filter = 'all' | FilmKind

const FILTERS: readonly Filter[] = ['all', 'aftermovie', 'set']
const COPIED_MS = 2000

const posterFor = (film: Film): string =>
  film.poster ?? (film.url ? youtubeThumb(film.url) : null) ?? photos[film.fallbackPhoto]

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
)

const LinkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </svg>
)

export const Films = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const lastTrigger = useRef<HTMLElement | null>(null)
  const [filter, setFilter] = useState<Filter>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const visible = films.filter((film) => filter === 'all' || film.kind === filter)
  const openFilm = films.find((film) => film.id === openId) ?? null
  const countFor = (f: Filter) => (f === 'all' ? films.length : films.filter((film) => film.kind === f).length)

  const open = useCallback((film: Film) => {
    if (!film.url) return
    lastTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setOpenId(film.id)
    window.history.replaceState(null, '', `#film=${film.id}`)
  }, [])

  const close = useCallback(() => {
    setOpenId(null)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
    lastTrigger.current?.focus()
  }, [])

  /* Shared links: /#film=<id> opens that film right away (also when pasted while on the page). */
  useEffect(() => {
    const syncFromHash = (scroll: boolean) => {
      const id = filmIdFromHash(window.location.hash)
      const film = id ? films.find((f) => f.id === id) : undefined
      if (!film?.url) return
      if (scroll) scrollToTarget('#aftermovies')
      setOpenId(film.id)
    }
    const timer = window.setTimeout(() => syncFromHash(true), 450)
    const onHash = () => syncFromHash(false)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  useGSAP(
    () => {
      if (root.current) setupReveals(root.current)
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  /* Cards rise in on first view and whenever the filter changes. */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from('.film', {
        opacity: 0,
        y: 56,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: '.films__grid', start: 'top 88%', once: true },
      })
    },
    { scope: root, dependencies: [filter], revertOnUpdate: true },
  )

  const copyCardLink = async (film: Film) => {
    await copyText(filmLink(film.id))
    setCopiedId(film.id)
    window.setTimeout(() => setCopiedId((current) => (current === film.id ? null : current)), COPIED_MS)
  }

  return (
    <section ref={root} id="aftermovies" className="films section" aria-labelledby="films-title">
      <div className="wrap">
        <p className="label" data-reveal>{t.films.label}</p>
        <div className="films__head">
          <h2 key={lang} id="films-title" className="display" data-split="lines">{t.films.title}</h2>
          <p className="films__sub" data-reveal>{t.films.sub}</p>
        </div>

        <div className="films__filters" role="group" aria-label={t.films.label} data-reveal>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`pill ${filter === f ? 'is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {t.films.filters[f]}
              <sup>{countFor(f)}</sup>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="films__empty">{t.films.empty}</p>
        ) : (
          <ul className="films__grid">
            {visible.map((film, index) => {
              const title = localize(film.title, lang)
              const where = localize(film.where, lang)
              const playable = film.url !== null
              return (
                <li key={film.id} className={`film ${index === 0 && visible.length % 2 === 1 ? 'film--feature' : ''}`}>
                  <button
                    type="button"
                    className="film__poster"
                    disabled={!playable}
                    onClick={() => open(film)}
                    aria-label={`${playable ? t.films.play : t.films.soon}: ${title}`}
                    data-cursor={playable ? t.films.play : undefined}
                  >
                    <img src={posterFor(film)} alt="" loading="lazy" draggable={false} />
                    <span className="film__badge">{t.films.kind[film.kind]}</span>
                    {playable ? (
                      <span className="film__play"><PlayIcon /></span>
                    ) : (
                      <span className="film__soon">{t.films.soon}</span>
                    )}
                  </button>

                  <div className="film__meta">
                    <div>
                      <h3 className="film__title">{title}</h3>
                      <p className="film__where">
                        {where}
                        {film.year ? ` · ${film.year}` : ''}
                      </p>
                    </div>
                    {playable && (
                      <button
                        type="button"
                        className={`film__copy ${copiedId === film.id ? 'is-done' : ''}`}
                        onClick={() => copyCardLink(film)}
                        aria-label={copiedId === film.id ? t.films.copied : t.films.copy}
                        title={copiedId === film.id ? t.films.copied : t.films.copy}
                      >
                        <LinkIcon />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <div className="films__cta" data-reveal>
          <div>
            <p className="films__cta-title">{t.films.ctaTitle}</p>
            <p className="films__cta-text">{t.films.ctaText}</p>
          </div>
          <Magnetic>
            <a className="btn btn--gold" href={contactLink(t.contact.subjects.showreel)} target="_blank" rel="noopener noreferrer">
              {t.films.ctaButton}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {openFilm && <FilmLightbox film={openFilm} onClose={close} />}
    </section>
  )
}
