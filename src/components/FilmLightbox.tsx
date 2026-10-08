import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Film } from '../data/films'
import { localize, useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { lockScroll } from '../lib/scroll'
import { copyText, filmLink } from '../lib/share'
import { resolveMedia, type Playable } from '../lib/video'

type FilmLightboxProps = { film: Film; onClose: () => void }

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, video[controls]'
const COPIED_MS = 2200

const MediaFrame = ({ media, title }: { media: Playable; title: string }) => {
  switch (media.kind) {
    case 'iframe':
      return (
        <div className="lightbox__media" style={{ aspectRatio: media.ratio, maxHeight: media.maxHeight }}>
          <iframe
            src={media.src}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )
    case 'player':
      return (
        <div className="lightbox__media lightbox__media--player" style={{ height: media.height }}>
          <iframe src={media.src} title={title} allow="autoplay; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      )
    case 'file':
      return (
        <div className="lightbox__media" style={{ aspectRatio: '16 / 9' }}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video src={media.src} controls autoPlay playsInline preload="metadata" />
        </div>
      )
    case 'link':
      return null
  }
}

export const FilmLightbox = ({ film, onClose }: FilmLightboxProps) => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const [copied, setCopied] = useState(false)

  const title = localize(film.title, lang)
  const where = localize(film.where, lang)
  const media = film.url ? resolveMedia(film.url) : null
  const link = filmLink(film.id)
  const message = t.films.shareMessage.replace('{title}', title)
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${message} ${link}`)}`
  const emailHref = `mailto:?subject=${encodeURIComponent(`${title} — Kat & Mike`)}&body=${encodeURIComponent(`${message}\n\n${link}`)}`

  const requestClose = () => {
    if (closing.current) return
    closing.current = true
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    gsap.to(root.current, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: onClose })
  }

  const copy = async () => {
    await copyText(link)
    setCopied(true)
    window.setTimeout(() => setCopied(false), COPIED_MS)
  }

  useEffect(() => {
    lockScroll(true)
    closeBtn.current?.focus()
    return () => lockScroll(false)
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.from(root.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
      gsap.from('.lightbox__panel', { y: 48, scale: 0.95, duration: 0.7, ease: 'expo.out' })
    },
    { scope: root },
  )

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      requestClose()
      return
    }
    if (e.key !== 'Tab' || !root.current) return
    const items = [...root.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    const first = items[0]
    const last = items[items.length - 1]
    if (!first || !last) return
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div
      ref={root}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
      data-lenis-prevent
    >
      <div className="lightbox__panel">
        <button ref={closeBtn} type="button" className="lightbox__close" onClick={requestClose} aria-label={t.films.close}>
          <span />
          <span />
        </button>

        {media && <MediaFrame media={media} title={title} />}

        <div className="lightbox__info">
          <div className="lightbox__text">
            <span className="film__badge film__badge--inline">{t.films.kind[film.kind]}</span>
            <h3 className="lightbox__title">{title}</h3>
            <p className="lightbox__where">
              {where}
              {film.year ? ` · ${film.year}` : ''}
            </p>
          </div>

          <div className="lightbox__share">
            <span className="lightbox__share-label">{t.films.shareTitle}</span>
            <div className="lightbox__actions">
              <button type="button" className="chip" onClick={copy}>
                {copied ? t.films.copied : t.films.copy}
              </button>
              <a className="chip" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                {t.films.whatsapp}
              </a>
              <a className="chip" href={emailHref}>
                {t.films.email}
              </a>
              {film.url && (
                <a className="chip chip--ghost" href={film.url} target="_blank" rel="noopener noreferrer">
                  {t.films.original} ↗
                </a>
              )}
            </div>
            <span className="visually-hidden" role="status">
              {copied ? t.films.copied : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
