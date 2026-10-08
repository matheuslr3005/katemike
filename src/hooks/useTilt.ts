import { type RefObject } from 'react'
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap'

/** 3D pointer tilt with a moving glare (`--gx/--gy` custom props). */
export const useTilt = (ref: RefObject<HTMLElement | null>, max = 10): void => {
  useGSAP(
    () => {
      const el = ref.current
      if (!el || !isFinePointer() || prefersReducedMotion()) return

      const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
      const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
      gsap.set(el, { transformPerspective: 900 })

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width
        const py = (e.clientY - r.top) / r.height
        rotY((px - 0.5) * max * 2)
        rotX((0.5 - py) * max * 2)
        el.style.setProperty('--gx', `${px * 100}%`)
        el.style.setProperty('--gy', `${py * 100}%`)
      }
      const onLeave = () => {
        rotX(0)
        rotY(0)
      }

      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
      return () => {
        el.removeEventListener('pointermove', onMove)
        el.removeEventListener('pointerleave', onLeave)
      }
    },
    { scope: ref },
  )
}
