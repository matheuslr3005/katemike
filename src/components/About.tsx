import { useRef } from 'react'
import { photos } from '../assets/photos'
import { useTilt } from '../hooks/useTilt'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, SplitText, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'

export const About = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const poster = useRef<HTMLElement>(null)

  useTilt(poster, 9)

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      setupReveals(el)
      if (prefersReducedMotion()) return

      /* Manifesto: words light up as you scroll through them. */
      SplitText.create('.about__manifesto', {
        type: 'words',
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: 'none',
              stagger: 0.12,
              scrollTrigger: { trigger: '.about__manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true },
            },
          ),
      })

      /* Poster + side photos: clip reveal and parallax. */
      gsap.fromTo(
        '.about__poster',
        { clipPath: 'inset(100% -10% -12% -10%)' },
        {
          clipPath: 'inset(-6% -10% -12% -10%)',
          duration: 1.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.about__poster', start: 'top 85%', once: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -Number(img.dataset.parallax) },
          {
            yPercent: Number(img.dataset.parallax),
            ease: 'none',
            scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      /* Counters */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((node) => {
        const target = Number(node.dataset.count)
        const state = { n: 0 }
        gsap.to(state, {
          n: target,
          duration: 1.8,
          ease: 'power3.out',
          onUpdate: () => {
            node.textContent = String(Math.round(state.n))
          },
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
        })
      })
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  return (
    <section ref={root} id="about" className="about section">
      <div className="wrap">
        <p className="label" data-reveal>{t.about.label}</p>
        <p key={lang} className="about__manifesto">{t.about.manifesto}</p>

        <div className="about__grid">
          <figure ref={poster} className="about__poster" data-cursor="K4T">
            <div className="about__poster-frame">
              <img src={photos.duo} alt={t.alts.duo} data-parallax="6" />
            </div>
            <span className="about__glare" aria-hidden="true" />
            <figcaption>K4T AND MIK€</figcaption>
          </figure>

          <div className="about__copy">
            <p className="about__body" data-reveal>{t.about.body}</p>
            <ul className="stats">
              {t.about.stats.map((stat) => (
                <li className="stat" key={stat.label} data-reveal>
                  <span className="stat__value">
                    <b data-count={stat.value}>0</b>
                    {stat.suffix}
                  </span>
                  <span className="stat__label">{stat.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
