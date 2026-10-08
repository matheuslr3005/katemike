import type { PhotoKey } from '../assets/photos'

export type GigEvent = {
  id: string
  /** ISO date (YYYY-MM-DD). `null` renders as "TBA". */
  date: string | null
  city: string
  country: string
  venue: string
  /** Ticket / event link. `null` renders the "get notified" action. */
  url: string | null
  photo: PhotoKey
}

/**
 * PLACEHOLDERS — replace with the real calendar.
 * Keep the list sorted by date; entries with a `null` date go last.
 */
export const events: readonly GigEvent[] = [
  { id: 'dub-1', date: null, city: 'Dublin', country: 'IE', venue: 'Venue TBA', url: null, photo: 'duoParty' },
  { id: 'eur-1', date: null, city: 'Europe', country: 'EU', venue: 'Tour dates TBA', url: null, photo: 'katDeck' },
  { id: 'dub-2', date: null, city: 'Dublin', country: 'IE', venue: 'Masterclass intake', url: null, photo: 'mikeGreen' },
]
