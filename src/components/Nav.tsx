import { useRef, useState, type MouseEvent } from 'react'
import { useI18n, type Lang } from '../i18n'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic } from './Magnetic'

const LANGS: readonly Lang[] = ['en', 'pt', 'es']

export const Nav = () => {
  const { t, lang, setLang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#about', label: t.nav.about },
    { href: '#events', label: t.nav.events },
    { href: '#masterclass', label: t.nav.masterclass },
    { href: '#contact', label: t.nav.contact },
  ]

  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          const hide = self.direction === 1 && self.scroll() > 240
          gsap.to(el, { yPercent: hide ? -110 : 0, duration: 0.45, ease: 'power3.out', overwrite: true })
        },
      })
    },
    { scope: root },
  )

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <header ref={root} className={`nav ${open ? 'is-open' : ''}`}>
      <a className="nav__logo" href="#top" onClick={go('#top')} aria-label={t.a11y.home}>
        Kat<span>&amp;</span>Mike
      </a>

      <nav className="nav__links" aria-label={t.a11y.primaryNav}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={go(link.href)} className="nav__link">
            {link.label}
          </a>
        ))}
      </nav>

      <div className="nav__right">
        <div className="lang" role="group" aria-label={t.a11y.language}>
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              className={`lang__btn ${lang === code ? 'is-active' : ''}`}
              aria-pressed={lang === code}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="nav__cta">
          <Magnetic strength={0.25}>
            <a className="btn btn--gold btn--sm" href="#masterclass" onClick={go('#masterclass')}>
              {t.nav.cta}
            </a>
          </Magnetic>
        </div>
        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={t.a11y.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        {links.map((link, i) => (
          <a
            key={link.href}
            href={link.href}
            onClick={go(link.href)}
            className="mobile-menu__link"
            style={{ transitionDelay: `${open ? 0.08 * i + 0.15 : 0}s` }}
            tabIndex={open ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
