import { useRef, type ReactNode } from 'react'
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap'

type MagneticProps = { children: ReactNode; strength?: number }

/** Wrapper whose content is gently pulled toward the pointer. */
export const Magnetic = ({ children, strength = 0.35 }: MagneticProps) => {
  const outer = useRef<HTMLSpanElement>(null)
  const inner = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const host = outer.current
      const el = inner.current
      if (!host || !el || !isFinePointer() || prefersReducedMotion()) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' })

      const onMove = (e: PointerEvent) => {
        const r = host.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * strength)
        yTo((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const onLeave = () => {
        xTo(0)
        yTo(0)
      }

      host.addEventListener('pointermove', onMove)
      host.addEventListener('pointerleave', onLeave)
      return () => {
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: outer },
  )

  return (
    <span ref={outer} className="magnetic">
      <span ref={inner} className="magnetic__inner">
        {children}
      </span>
    </span>
  )
}
