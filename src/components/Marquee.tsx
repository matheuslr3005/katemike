import { useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { scrollState } from '../lib/scroll'

type MarqueeProps = {
  items: readonly string[]
  /** 1 = drifts left, -1 = drifts right */
  direction?: 1 | -1
  /** Base speed in px/s */
  speed?: number
  className?: string
}

/** Infinite ticker that reacts to scroll velocity (speeds up and skews). */
export const Marquee = ({ items, direction = 1, speed = 70, className = '' }: MarqueeProps) => {
  const track = useRef<HTMLDivElement>(null)
  const repeated = [...items, ...items, ...items, ...items]

  useGSAP(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return
    let x = 0
    let skew = 0
    const tick = (_time: number, deltaMs: number) => {
      const half = el.scrollWidth / 2
      const dt = deltaMs / 1000
      const vel = scrollState.velocity
      x -= direction * (speed + Math.abs(vel) * 40) * dt
      if (x <= -half) x += half
      if (x > 0) x -= half
      skew += (gsap.utils.clamp(-7, 7, vel * -0.5) - skew) * 0.12
      el.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  })

  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div ref={track} className="marquee__track">
        {repeated.map((item, i) => (
          <span className="marquee__item" key={`${item}-${i}`}>
            {item}
            <i className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
