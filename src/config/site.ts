export const site = {
  name: 'Kat & Mike',
  instagramHandle: 'katyandmike',
  instagramUrl: 'https://www.instagram.com/katyandmike/',
  managementEmail: 'katyandmike@hotmail.com',
  /** International format, digits only, e.g. "353871234567". Empty = WhatsApp buttons fall back to e-mail. */
  whatsappNumber: '',
  /** Optional Formspree/Getform/etc. endpoint for the VIP list. Empty = opens the visitor's mail app. */
  vipFormEndpoint: '',
  /** Link to the masterclass checkout / waitlist. Empty = falls back to contact. */
  masterclassUrl: '',
  pressKitUrl: 'https://presskitpro.app/katandmike/',
  /** LAX Assessoria de Marketing — site that produced this page (from the sitelax / lax2 repos). */
  laxUrl: 'https://matheuslr3005.github.io/lax2/',
} as const

export const whatsappLink = (message: string): string | null =>
  site.whatsappNumber
    ? `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`
    : null

export const mailtoLink = (subject: string, body = ''): string =>
  `mailto:${site.managementEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/** Best available contact link: WhatsApp if configured, otherwise e-mail. */
export const contactLink = (subject: string): string =>
  whatsappLink(subject) ?? mailtoLink(subject)
