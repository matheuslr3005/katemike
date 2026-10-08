import { gsap, prefersReducedMotion, SplitText } from './gsap'

/**
 * Declarative scroll reveals, driven by data attributes:
 *  - data-reveal            fade + rise
 *  - data-split="lines"     masked line-by-line reveal
 *  - data-split="chars"     masked char-by-char reveal
 *  - data-delay="0.2"       optional delay (seconds)
 * Must be called inside a gsap context (useGSAP) so everything is cleaned up.
 */
export const setupReveals = (scope: HTMLElement): void => {
  if (prefersReducedMotion()) return

  gsap.utils.toArray<HTMLElement>('[data-reveal]', scope).forEach((el) => {
    gsap.from(el, {
      y: 56,
      opacity: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    })
  })

  gsap.utils.toArray<HTMLElement>('[data-split]', scope).forEach((el) => {
    const byChars = el.dataset.split === 'chars'
    SplitText.create(el, {
      type: byChars ? 'lines,chars' : 'lines',
      mask: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(byChars ? self.chars : self.lines, {
          yPercent: 115,
          duration: 1.1,
          ease: 'power4.out',
          stagger: byChars ? 0.02 : 0.1,
          delay: Number(el.dataset.delay ?? 0),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }),
    })
  })
}
