import type { PhotoKey } from '../assets/photos'
import type { Localized } from '../i18n'

export type GigEvent = {
  id: string
  /** ISO date (YYYY-MM-DD). `null` renders as "TBA". */
  date: string | null
  city: Localized
  country: string
  venue: Localized
  /** Ticket / event link. `null` renders the "get notified" action. */
  url: string | null
  photo: PhotoKey
}

/**
 * PLACEHOLDERS — replace with the real calendar.
 * Keep the list sorted by date; entries with a `null` date go last.
 */
export const events: readonly GigEvent[] = [
  {
    id: 'dub-1',
    date: null,
    city: { en: 'Dublin', pt: 'Dublin', es: 'Dublín' },
    country: 'IE',
    venue: { en: 'Venue TBA', pt: 'Local a confirmar', es: 'Lugar por confirmar' },
    url: null,
    photo: 'duoParty',
  },
  {
    id: 'eur-1',
    date: null,
    city: { en: 'Europe', pt: 'Europa', es: 'Europa' },
    country: 'EU',
    venue: { en: 'Tour dates TBA', pt: 'Datas da turnê a confirmar', es: 'Fechas de la gira por confirmar' },
    url: null,
    photo: 'katDeck',
  },
  {
    id: 'dub-2',
    date: null,
    city: { en: 'Dublin', pt: 'Dublin', es: 'Dublín' },
    country: 'IE',
    venue: { en: 'Masterclass intake', pt: 'Próxima turma da Masterclass', es: 'Próxima edición de la Masterclass' },
    url: null,
    photo: 'mikeGreen',
  },
]
