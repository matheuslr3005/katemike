import { useRef, useState } from 'react'
import { contactLink, site } from '../config/site'
import { masterclassModules } from '../data/masterclass'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'
import { Magnetic } from './Magnetic'
import { Vinyl } from './Vinyl'


export const Masterclass = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLDivElement>(null)
  const joinHref = site.masterclassUrl || contactLink(t.contact.subjects.join)
  const askHref = contactLink(t.contact.subjects.question)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      setupReveals(el)
      if (prefersReducedMotion()) return

      /* Section "card" expands to full bleed as it enters. */
      gsap.fromTo(
        '.mc--intro',
        { clipPath: 'inset(7% 4% 0% 4% round 56px 56px 0px 0px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
          ease: 'none',
          scrollTrigger: { trigger: '.mc--intro', start: 'top 95%', end: 'top 15%', scrub: true },
        },
      )

      gsap.to('.mc__vinyl', {
        yPercent: -18,
        rotate: 40,
        ease: 'none',
        scrollTrigger: { trigger: '.mc--intro', start: 'top bottom', end: 'bottom top', scrub: true },
      })

      /* Modules: pinned horizontal scroll on desktop, stacked on mobile. */
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = el.querySelector<HTMLElement>('.modules__track')
        const pin = el.querySelector<HTMLElement>('.modules__pin')
        if (!track || !pin) return
        const distance = () => track.scrollWidth - window.innerWidth + 120
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
        gsap.to('.modules__bar-fill', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${distance()}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <div ref={root} id="masterclass" className="mc-wrap">
      {/* ——— Pitch ——— */}
      <section className="mc mc--intro section">
        <div className="wrap mc__grid">
          <div className="mc__copy">
            <p className="label" data-reveal>{t.masterclass.label}</p>
            <h2 key={lang} className="display mc__title" data-split="lines">{t.masterclass.title}</h2>
            <p className="mc__sub" data-reveal>{t.masterclass.sub}</p>
            <div className="mc__cta" data-reveal>
              <Magnetic>
                <a className="btn btn--dark" href={joinHref} target="_blank" rel="noreferrer">
                  {t.masterclass.ctaPrimary}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a className="btn btn--outline-dark" href={askHref} target="_blank" rel="noreferrer">
                  {t.masterclass.ctaSecondary}
                </a>
              </Magnetic>
            </div>
          </div>
          <div className="mc__visual" aria-hidden="true">
            <Vinyl className="mc__vinyl" speed={1.2} text="DJ MASTERCLASS · KAT & MIKE · DJ MASTERCLASS · KAT & MIKE · " />
          </div>
        </div>
      </section>

      {/* ——— Curriculum ——— */}
      <section className="mc mc--modules" aria-labelledby="modules-title">
        <div className="modules__pin">
          <div className="wrap modules__head">
            <h3 key={lang} id="modules-title" className="modules__title" data-split="lines">{t.masterclass.modulesTitle}</h3>
            <div className="modules__bar" aria-hidden="true"><span className="modules__bar-fill" /></div>
          </div>
          <ol className="modules__track">
            {masterclassModules.map((mod, i) => (
              <li className="module" key={mod.id}>
                <span className="module__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="module__eq" aria-hidden="true">
                  {[0, 1, 2, 3, 4, 5, 6].map((bar) => (
                    <i key={bar} style={{ animationDelay: `${((bar * 7 + i * 3) % 10) * -0.13}s` }} />
                  ))}
                </span>
                <h4 className="module__title">{mod.title[lang]}</h4>
                <p className="module__text">{mod.text[lang]}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Who / format / FAQ ——— */}
      <section className="mc mc--info section">
        <div className="wrap info">
          <div className="info__col" data-reveal>
            <h3 className="info__title">{t.masterclass.forTitle}</h3>
            <ul className="ticks">
              {t.masterclass.forItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="info__col" data-reveal data-delay="0.1">
            <h3 className="info__title">{t.masterclass.formatTitle}</h3>
            <dl className="format">
              {t.masterclass.formatItems.map((item) => (
                <div key={item.k}>
                  <dt>{item.k}</dt>
                  <dd>{item.v}</dd>
                </div>
              ))}
            </dl>
            <p className="info__note">{t.masterclass.priceNote}</p>
          </div>

          <div className="info__col info__col--faq" data-reveal data-delay="0.2">
            <h3 className="info__title">{t.masterclass.faqTitle}</h3>
            <ul className="faq">
              {t.masterclass.faq.map((item, i) => {
                const open = openFaq === i
                return (
                  <li key={item.q} className={`faq__item ${open ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq__q"
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      {item.q}
                      <span className="faq__icon" aria-hidden="true" />
                    </button>
                    <div id={`faq-${i}`} className="faq__a" role="region">
                      <div>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="wrap mc__final" data-reveal>
          <Magnetic strength={0.2}>
            <a className="btn btn--dark btn--lg" href={joinHref} target="_blank" rel="noreferrer">
              {t.masterclass.ctaPrimary}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </Magnetic>
        </div>
      </section>
    </div>
  )
}
