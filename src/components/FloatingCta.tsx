import { useState } from 'react'
import { useI18n } from '../i18n'
import { contactLink, site } from '../config/site'
import { ScrollTrigger, useGSAP } from '../lib/gsap'

/** Sticky "I want in" pill shown while the visitor is reading the Masterclass block. */
export const FloatingCta = () => {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#masterclass',
      start: 'top 40%',
      end: 'bottom 55%',
      onToggle: (self) => setVisible(self.isActive),
    })
    return () => trigger.kill()
  })

  return (
    <a
      className={`floating-cta ${visible ? 'is-visible' : ''}`}
      href={site.masterclassUrl || contactLink('Masterclass — I want in')}
      target="_blank"
      rel="noreferrer"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <span className="floating-cta__dot" />
      {t.masterclass.ctaPrimary}
    </a>
  )
}
