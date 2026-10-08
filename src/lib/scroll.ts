import Lenis from 'lenis'
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap'

/** Shared, frame-decayed scroll velocity — read by marquees, vinyls, etc. */
export const scrollState = { velocity: 0 }

let instance: Lenis | null = null
let locked = false

export const lockScroll = (lock: boolean): void => {
  locked = lock
  if (instance) {
    if (lock) instance.stop()
    else instance.start()
  }
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

export const initSmoothScroll = (): (() => void) => {
  if (prefersReducedMotion()) return () => undefined

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  instance = lenis
  if (locked) lenis.stop()

  lenis.on('scroll', (event: Lenis) => {
    scrollState.velocity = event.velocity
    ScrollTrigger.update()
  })

  const tick = (time: number) => {
    lenis.raf(time * 1000)
    scrollState.velocity *= 0.94
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    instance = null
  }
}

export const scrollToTarget = (target: string): void => {
  const el = document.querySelector<HTMLElement>(target)
  if (!el) return
  if (instance) {
    instance.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
    return
  }
  el.scrollIntoView({ behavior: 'auto' })
}
