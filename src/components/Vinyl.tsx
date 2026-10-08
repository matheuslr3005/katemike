import { useId, useRef } from 'react'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { scrollState } from '../lib/scroll'

type VinylProps = { className?: string; speed?: number; text?: string }

/** Spinning record. Spins faster while the page is scrolling. */
export const Vinyl = ({ className, speed = 1, text = 'KAT & MIKE · GROOVE BASS · STREET FUNK · ' }: VinylProps) => {
  const disc = useRef<SVGGElement>(null)
  const uid = useId()

  useGSAP(() => {
    const el = disc.current
    if (!el || prefersReducedMotion()) return
    let rotation = Math.random() * 360
    const tick = (_time: number, deltaMs: number) => {
      rotation += (22 * speed + Math.abs(scrollState.velocity) * 4) * (deltaMs / 1000)
      el.style.transform = `rotate(${rotation}deg)`
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  })

  const grooves = [92, 84, 77, 71, 66, 61, 57, 53]

  return (
    <svg className={className} viewBox="0 0 200 200" role="img" aria-label="Spinning vinyl record">
      <defs>
        <radialGradient id={`${uid}-sheen`} cx="35%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <path id={`${uid}-arc`} d="M 100 100 m -30 0 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0" />
      </defs>
      <g ref={disc} className="vinyl__disc">
        <circle cx="100" cy="100" r="98" fill="#0c0c0c" />
        {grooves.map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#2a2a2a" strokeWidth="0.7" />
        ))}
        <circle cx="100" cy="100" r="40" fill="#e8372f" />
        <circle cx="100" cy="100" r="40" fill="none" stroke="#0a0a0a" strokeOpacity="0.25" strokeWidth="1" />
        <text fontSize="7.6" fontFamily="Barlow Condensed, sans-serif" fontWeight="600" fill="#0a0a0a" textLength="185" lengthAdjust="spacing">
          <textPath href={`#${uid}-arc`} startOffset="0" textLength="185" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
        <circle cx="100" cy="100" r="4" fill="#0a0a0a" />
      </g>
      <circle cx="100" cy="100" r="98" fill={`url(#${uid}-sheen)`} />
    </svg>
  )
}
