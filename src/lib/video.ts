/**
 * Turns a pasted video/audio URL into something the lightbox can play.
 * Supports YouTube, Vimeo, Instagram, SoundCloud, Mixcloud and direct files.
 * Anything else becomes an external link (opens in a new tab).
 */
export type Playable =
  | { kind: 'iframe'; src: string; ratio: string; maxHeight?: string }
  | { kind: 'player'; src: string; height: number }
  | { kind: 'file'; src: string }
  | { kind: 'link'; href: string }

const YOUTUBE_ID = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
const VIMEO_ID = /vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/
const INSTAGRAM = /instagram\.com\/(p|reel|tv)\/([\w-]+)/
const FILE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i

const parse = (url: string): URL | null => {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export const youtubeThumb = (url: string): string | null => {
  const id = YOUTUBE_ID.exec(url)?.[1]
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export const resolveMedia = (url: string): Playable => {
  const youtube = YOUTUBE_ID.exec(url)?.[1]
  if (youtube) {
    return {
      kind: 'iframe',
      src: `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      ratio: '16 / 9',
    }
  }

  const vimeo = VIMEO_ID.exec(url)
  if (vimeo?.[1]) {
    const privateHash = vimeo[2] ? `&h=${vimeo[2]}` : ''
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1&dnt=1${privateHash}`, ratio: '16 / 9' }
  }

  const instagram = INSTAGRAM.exec(url)
  if (instagram?.[1] && instagram[2]) {
    return {
      kind: 'iframe',
      src: `https://www.instagram.com/${instagram[1]}/${instagram[2]}/embed`,
      ratio: '4 / 5',
      maxHeight: '78vh',
    }
  }

  const parsed = parse(url)
  if (parsed?.hostname.endsWith('soundcloud.com')) {
    return {
      kind: 'player',
      src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&visual=true&hide_related=true`,
      height: 420,
    }
  }
  if (parsed?.hostname.endsWith('mixcloud.com')) {
    return {
      kind: 'player',
      src: `https://www.mixcloud.com/widget/iframe/?hide_cover=0&autoplay=1&feed=${encodeURIComponent(parsed.pathname)}`,
      height: 400,
    }
  }

  if (FILE.test(url)) return { kind: 'file', src: url }
  return { kind: 'link', href: url }
}
