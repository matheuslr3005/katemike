import { useRef } from 'react'
import { site } from '../config/site'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'
import { Marquee } from './Marquee'
import { Magnetic } from './Magnetic'

export const Footer = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      setupReveals(el)
      if (prefersReducedMotion()) return
      gsap.from('.footer__word', {
        yPercent: 60,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.footer__word', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <footer ref={root} id="contact" className="footer">
      <div className="wrap footer__top">
        <p className="label" data-reveal>{t.contact.label}</p>
        <h2 key={lang} className="display footer__title" data-split="lines">{t.contact.title}</h2>

        <div className="footer__links">
          <div data-reveal>
            <span className="footer__k">{t.contact.mgmt}</span>
            <Magnetic strength={0.2}>
              <a className="footer__link" href={`mailto:${site.managementEmail}`}>{site.managementEmail}</a>
            </Magnetic>
          </div>
          <div data-reveal data-delay="0.08">
            <span className="footer__k">{t.contact.follow}</span>
            <Magnetic strength={0.2}>
              <a className="footer__link" href={site.instagramUrl} target="_blank" rel="noreferrer">@{site.instagramHandle}</a>
            </Magnetic>
          </div>
          <div data-reveal data-delay="0.16">
            <span className="footer__k">{t.contact.press}</span>
            <Magnetic strength={0.2}>
              <a className="footer__link" href={site.pressKitUrl} target="_blank" rel="noreferrer">presskitpro.app/katandmike</a>
            </Magnetic>
          </div>
        </div>
      </div>

      <Marquee items={t.marquee} speed={40} className="marquee--footer" />
      <p className="footer__word" aria-hidden="true">Kat &amp; Mike</p>

      <div className="wrap footer__bottom">
        <span>© {new Date().getFullYear()} Kat &amp; Mike. {t.footer.rights}</span>
        <span className="footer__credit">
          {t.footer.producedBy}{' '}
          <a href={site.laxUrl} target="_blank" rel="noopener noreferrer">
            LAX
          </a>
        </span>
        <span>{t.footer.made}</span>
      </div>
    </footer>
  )
}
