import type { PhotoKey } from '../assets/photos'
import type { Localized } from '../i18n'

export type FilmKind = 'aftermovie' | 'set'

export type Film = {
  /** Unique, URL-safe. Used in the share link: /#film=<id> */
  id: string
  kind: FilmKind
  title: Localized
  /** Event · venue · city line */
  where: Localized
  year: number | null
  /**
   * YouTube, Vimeo, Instagram (post/reel), SoundCloud, Mixcloud or a direct .mp4 link.
   * `null` renders a "Coming soon" card.
   */
  url: string | null
  /**
   * Optional thumbnail. Drop the image in `public/films/` and use './films/name.jpg'.
   * YouTube links get their thumbnail automatically; otherwise `fallbackPhoto` is used.
   */
  poster?: string
  fallbackPhoto: PhotoKey
}

/**
 * PLACEHOLDERS — replace with real after movies and sets (newest first).
 *
 *   {
 *     id: 'belvedere-halloween-2025',
 *     kind: 'aftermovie',
 *     title: 'Halloween @ Belvedere',
 *     where: 'Belvedere · Dublin, Ireland',
 *     year: 2025,
 *     url: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
 *     fallbackPhoto: 'duoParty',
 *   },
 *
 * `title` and `where` can be a plain string (same in every language) or
 * `{ en: '…', pt: '…', es: '…' }`.
 */
export const films: readonly Film[] = [
  {
    id: 'aftermovie-soon-1',
    kind: 'aftermovie',
    title: { en: 'After movie — in the edit', pt: 'After movie — em edição', es: 'After movie — en edición' },
    where: { en: 'Event details soon', pt: 'Detalhes do evento em breve', es: 'Detalles del evento pronto' },
    year: null,
    url: null,
    fallbackPhoto: 'duoParty',
  },
  {
    id: 'set-soon-1',
    kind: 'set',
    title: { en: 'Live set — coming soon', pt: 'Set ao vivo — em breve', es: 'Set en vivo — próximamente' },
    where: { en: 'Venue and date soon', pt: 'Local e data em breve', es: 'Lugar y fecha pronto' },
    year: null,
    url: null,
    fallbackPhoto: 'katDeck',
  },
  {
    id: 'aftermovie-soon-2',
    kind: 'aftermovie',
    title: { en: 'After movie — in the edit', pt: 'After movie — em edição', es: 'After movie — en edición' },
    where: { en: 'Event details soon', pt: 'Detalhes do evento em breve', es: 'Detalles del evento pronto' },
    year: null,
    url: null,
    fallbackPhoto: 'mikeGreen',
  },
  {
    id: 'set-soon-2',
    kind: 'set',
    title: { en: 'Live set — coming soon', pt: 'Set ao vivo — em breve', es: 'Set en vivo — próximamente' },
    where: { en: 'Venue and date soon', pt: 'Local e data em breve', es: 'Lugar y fecha pronto' },
    year: null,
    url: null,
    fallbackPhoto: 'mikeMic',
  },
]
