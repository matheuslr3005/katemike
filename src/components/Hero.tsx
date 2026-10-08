import { useRef, type MouseEvent } from 'react'
import { photos } from '../assets/photos'
import { useI18n } from '../i18n'
import { gsap, isFinePointer, prefersReducedMotion, SplitText, useGSAP } from '../lib/gsap'
import { scrollToTarget } from '../lib/scroll'
import { Magnetic } from './Magnetic'
import { Vinyl } from './Vinyl'

type HeroProps = { ready: boolean }

export const Hero = ({ ready }: HeroProps) => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)

  /* Entrance sequence — plays once the intro hands over. */
  useGSAP(
    () => {
      if (!ready || prefersReducedMotion()) return

      const split = SplitText.create('.hero__word', { type: 'chars' })
      const tl = gsap.timeline({ delay: 0.25 })
      tl.from('.hero__bg-img', { scale: 1.35, opacity: 0, duration: 2.2, ease: 'expo.out' }, 0)
        .from(split.chars, { yPercent: 120, rotate: 8, duration: 1.2, ease: 'power4.out', stagger: 0.06 }, 0.15)
        .from('.hero__amp', { scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)' }, 0.5)
        .from('.hero__eyebrow, .hero__tagline', { y: 24, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' }, 0.7)
        .from('.hero__cta > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, 0.95)
        .from('.hero__vinyl', { xPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out' }, 0.6)
        .from('.hero__scroll', { opacity: 0, duration: 0.8 }, 1.4)
    },
    { scope: root, dependencies: [ready, lang], revertOnUpdate: true },
  )

  /* Scroll parallax + pointer interactions. */
  useGSAP(
    () => {
      const el = root.current
      if (!el || prefersReducedMotion()) return

      gsap.to('.hero__bg-img', {
        yPercent: 18,
        scale: 1.15,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__title', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero__vinyl', {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })

      if (!isFinePointer()) return

      const bgX = gsap.quickTo('.hero__bg-img', 'x', { duration: 1.2, ease: 'power3.out' })
      const titleX = gsap.quickTo('.hero__title', 'x', { duration: 1, ease: 'power3.out' })
      const vinylY = gsap.quickTo('.hero__vinyl-wrap', 'y', { duration: 1.2, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5
        const ny = e.clientY / window.innerHeight - 0.5
        bgX(nx * -40)
        titleX(nx * 28)
        vinylY(ny * -40)
      }
      el.addEventListener('pointermove', onMove)
      return () => el.removeEventListener('pointermove', onMove)
    },
    { scope: root },
  )

  /* Chars bounce when hovered. */
  const bounce = (e: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return
    const target = e.target
    if (!(target instanceof HTMLElement) || target.closest('.hero__word') === null) return
    if (target.classList.contains('hero__word')) return
    gsap.fromTo(
      target,
      { yPercent: 0, rotate: 0 },
      { keyframes: [{ yPercent: -18, rotate: gsap.utils.random(-8, 8), duration: 0.18 }, { yPercent: 0, rotate: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }], overwrite: true },
    )
  }

  const go = (href: string) => (e: MouseEvent) => {
    e.preventDefault()
    scrollToTarget(href)
  }

  return (
    <section ref={root} id="top" className="hero">
      <div className="hero__bg">
        <img className="hero__bg-img" src={photos.katDeck} alt="" fetchPriority="high" />
        <div className="hero__shade" />
      </div>

      <div className="hero__vinyl-wrap" aria-hidden="true">
        <div className="hero__vinyl">
          <Vinyl className="hero__vinyl-svg" speed={1.4} />
        </div>
      </div>

      <div className="hero__inner wrap">
        <p className="hero__eyebrow label">{t.hero.eyebrow}</p>

        <h1 className="hero__title" aria-label="Kat & Mike" onMouseOver={bounce}>
          <span className="hero__line hero__line--1">
            <span className="hero__word" aria-hidden="true">Kat</span>
          </span>
          <span className="hero__amp" aria-hidden="true">&amp;</span>
          <span className="hero__line hero__line--2">
            <span className="hero__word" aria-hidden="true">Mike</span>
          </span>
        </h1>

        <div className="hero__bottom">
          <p className="hero__tagline">{t.hero.tagline}</p>
          <div className="hero__cta">
            <Magnetic>
              <a className="btn btn--gold" href="#masterclass" onClick={go('#masterclass')}>
                {t.hero.ctaPrimary}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn--ghost" href="#contact" onClick={go('#contact')}>
                {t.hero.ctaSecondary}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" onClick={go('#about')} aria-label={t.hero.scroll}>
        <span>{t.hero.scroll}</span>
        <i />
      </a>
    </section>
  )
}
