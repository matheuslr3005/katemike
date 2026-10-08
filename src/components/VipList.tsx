import { useRef, useState, type FormEvent } from 'react'
import { mailtoLink, site } from '../config/site'
import { useI18n } from '../i18n'
import { gsap, prefersReducedMotion, useGSAP } from '../lib/gsap'
import { setupReveals } from '../lib/reveal'

type Status = 'idle' | 'sending' | 'done' | 'error'

export const VipList = () => {
  const { t, lang } = useI18n()
  const root = useRef<HTMLElement>(null)
  const [status, setStatus] = useState<Status>('idle')

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      setupReveals(el)
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.vip__card',
        { clipPath: 'inset(12% 6% 12% 6% round 40px)' },
        {
          clipPath: 'inset(0% 0% 0% 0% round 40px)',
          ease: 'none',
          scrollTrigger: { trigger: '.vip__card', start: 'top 95%', end: 'top 35%', scrub: true },
        },
      )
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    setStatus('sending')

    if (!site.vipFormEndpoint) {
      const body = `${t.vip.name}: ${data.name}\n${t.vip.email}: ${data.email}\n${t.vip.whatsapp}: ${data.whatsapp}`
      window.location.href = mailtoLink(t.contact.subjects.vip, body)
      setStatus('done')
      form.reset()
      return
    }

    try {
      const res = await fetch(site.vipFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setStatus('done')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={root} id="vip" className="vip section" aria-labelledby="vip-title">
      <div className="wrap">
        <div className="vip__card">
          <div className="vip__intro">
            <p className="label" data-reveal>{t.vip.label}</p>
            <h2 key={lang} id="vip-title" className="display vip__title" data-split="lines">{t.vip.title}</h2>
            <p className="vip__sub" data-reveal>{t.vip.sub}</p>
          </div>

          {status === 'done' ? (
            <p className="vip__thanks" role="status">{t.vip.thanks}</p>
          ) : (
            <form className="vip__form" onSubmit={submit} data-reveal>
              <label className="field">
                <span>{t.vip.name}</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label className="field">
                <span>{t.vip.email}</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label className="field">
                <span>{t.vip.whatsapp}</span>
                <input name="whatsapp" type="tel" autoComplete="tel" />
              </label>
              <button className="btn btn--gold" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? t.vip.sending : t.vip.submit}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
              {status === 'error' && <p className="vip__error" role="alert">{t.vip.error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
