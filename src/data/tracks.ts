export type Track = {
  id: string
  title: string
  artist?: string
  /**
   * File inside `public/music/`, written as './music/<file>.mp3'
   * (relative path, so it also works under /katemike/ on GitHub Pages).
   */
  src: string
}

/**
 * Background playlist (plays in order, then loops).
 * While this list is empty the music player stays hidden.
 *
 *   { id: 'track-1', title: 'Track name', artist: 'Kat & Mike', src: './music/track-1.mp3' },
 *
 * Tip: export as MP3 128 kbps (about 1 MB per minute) so the site stays fast.
 */
export const tracks: readonly Track[] = []
