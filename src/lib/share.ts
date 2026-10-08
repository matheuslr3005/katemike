/** Permalink that opens a specific film straight in the lightbox (no intro). */
export const filmLink = (id: string): string => `${window.location.origin}${window.location.pathname}#film=${id}`

export const FILM_HASH_PREFIX = '#film='

export const filmIdFromHash = (hash: string): string | null =>
  hash.startsWith(FILM_HASH_PREFIX) ? decodeURIComponent(hash.slice(FILM_HASH_PREFIX.length)) || null : null

const legacyCopy = (text: string): void => {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
  document.body.appendChild(area)
  area.select()
  document.execCommand('copy')
  area.remove()
}

export const copyText = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    legacyCopy(text)
  }
}
