import { useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion, useGSAP } from '../lib/gsap'

const INTERACTIVE = 'a, button, input, summary, [role="button"], label'

/** Blend-mode ring that follows the pointer, grows on links and shows labels via data-cursor. */
export const Cursor = () => {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const el = ring.current
    const text = label.current
    if (!el || !text || !isFinePointer() || prefersReducedMotion()) return

    document.documentElement.classList.add('has-cursor')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      el.classList.add('is-visible')
    }
    const onOver = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null
      const labelled = target?.closest<HTMLElement>('[data-cursor]')
      const text_ = labelled?.dataset.cursor ?? ''
      text.textContent = text_
      el.classList.toggle('has-label', text_ !== '')
      el.classList.toggle('is-active', Boolean(target?.closest(INTERACTIVE)) && text_ === '')
    }
    const onLeaveWindow = () => el.classList.remove('is-visible')
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerover', onOver)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeaveWindow)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow)
    }
  })

  return (
    <div ref={ring} className="cursor" aria-hidden="true">
      <span ref={label} className="cursor__label" />
    </div>
  )
}
