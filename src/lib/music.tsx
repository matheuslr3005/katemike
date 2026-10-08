import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { tracks, type Track } from '../data/tracks'
import { gsap } from './gsap'

const STORAGE_KEY = 'km-music'
const VOLUME = 0.55
const FADE_IN_S = 2
const FADE_OUT_S = 0.5

type Preference = 'on' | 'off' | null

type MusicValue = {
  available: boolean
  playing: boolean
  track: Track | null
  /** The visitor explicitly silenced the music in a previous visit or this one. */
  muted: boolean
  /** `explicit` = the visitor chose sound (e.g. pressed START), which also overrides an old "off". */
  start: (explicit?: boolean) => void
  toggle: () => void
  next: () => void
  prev: () => void
  /** Temporarily silence for another player (film lightbox); resumes on release. */
  duck: (on: boolean) => void
}

const MusicContext = createContext<MusicValue | null>(null)

const readPreference = (): Preference => {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'on' || value === 'off' ? value : null
  } catch {
    return null
  }
}

const writePreference = (value: 'on' | 'off'): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // storage unavailable (private mode) — preference just won't persist
  }
}

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const available = tracks.length > 0
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const indexRef = useRef(0)
  const preferenceRef = useRef<Preference>(readPreference())
  const startedRef = useRef(false)
  const duckedRef = useRef(false)
  const resumeAfterRef = useRef(false)
  const errorsRef = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(preferenceRef.current === 'off')

  const setPreference = useCallback((value: 'on' | 'off') => {
    preferenceRef.current = value
    writePreference(value)
    setMuted(value === 'off')
  }, [])

  const loadAndPlay = useCallback((target: number, fade: boolean) => {
    const audio = audioRef.current
    if (!audio || tracks.length === 0) return
    const count = tracks.length
    const next = ((target % count) + count) % count
    const track = tracks[next]
    if (!track) return
    indexRef.current = next
    setIndex(next)
    gsap.killTweensOf(audio)
    audio.src = new URL(track.src, document.baseURI).href
    audio.volume = fade ? 0 : VOLUME
    audio
      .play()
      .then(() => {
        errorsRef.current = 0
        if (fade) gsap.to(audio, { volume: VOLUME, duration: FADE_IN_S, ease: 'power1.out' })
      })
      .catch(() => {
        // Autoplay blocked (no user gesture yet): allow a later gesture to retry.
        startedRef.current = false
      })
  }, [])

  /* Create the single audio element once. */
  useEffect(() => {
    if (!available) return
    const audio = new Audio()
    audio.preload = 'none'
    audioRef.current = audio

    const onEnded = () => loadAndPlay(indexRef.current + 1, false)
    const onError = () => {
      errorsRef.current += 1
      if (errorsRef.current < tracks.length) loadAndPlay(indexRef.current + 1, false)
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      gsap.killTweensOf(audio)
      audio.pause()
      audio.removeAttribute('src')
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audioRef.current = null
    }
  }, [available, loadAndPlay])

  const start = useCallback(
    (explicit = false) => {
      if (!available || startedRef.current) return
      if (explicit) setPreference('on')
      else if (preferenceRef.current === 'off') return
      startedRef.current = true
      loadAndPlay(indexRef.current, true)
    },
    [available, loadAndPlay, setPreference],
  )

  const fadeOutAndPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    gsap.killTweensOf(audio)
    gsap.to(audio, { volume: 0, duration: FADE_OUT_S, ease: 'power1.in', onComplete: () => audio.pause() })
  }, [])

  const resume = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.src) {
      loadAndPlay(indexRef.current, true)
      return
    }
    gsap.killTweensOf(audio)
    audio.volume = 0
    audio
      .play()
      .then(() => gsap.to(audio, { volume: VOLUME, duration: FADE_IN_S / 2, ease: 'power1.out' }))
      .catch(() => undefined)
  }, [loadAndPlay])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    startedRef.current = true
    if (audio.paused) {
      setPreference('on')
      resume()
    } else {
      setPreference('off')
      fadeOutAndPause()
    }
  }, [fadeOutAndPause, resume, setPreference])

  const skip = useCallback(
    (step: number) => {
      startedRef.current = true
      setPreference('on')
      loadAndPlay(indexRef.current + step, false)
    },
    [loadAndPlay, setPreference],
  )
  const next = useCallback(() => skip(1), [skip])
  const prev = useCallback(() => skip(-1), [skip])

  const duck = useCallback(
    (on: boolean) => {
      const audio = audioRef.current
      if (!audio) return
      if (on) {
        duckedRef.current = true
        resumeAfterRef.current = !audio.paused
        if (!audio.paused) fadeOutAndPause()
        return
      }
      duckedRef.current = false
      if (resumeAfterRef.current && preferenceRef.current !== 'off') resume()
      resumeAfterRef.current = false
    },
    [fadeOutAndPause, resume],
  )

  /* First user gesture anywhere starts the music (browsers block audio before that). */
  useEffect(() => {
    if (!available) return
    const onGesture = (event: Event) => {
      if (startedRef.current) return
      if (event.target instanceof Element && event.target.closest('.music')) return
      start()
    }
    window.addEventListener('pointerup', onGesture, true)
    window.addEventListener('keydown', onGesture, true)
    return () => {
      window.removeEventListener('pointerup', onGesture, true)
      window.removeEventListener('keydown', onGesture, true)
    }
  }, [available, start])

  /* Be polite: pause while the tab is hidden, resume when it comes back. */
  useEffect(() => {
    if (!available) return
    let pausedByHide = false
    const onVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden && !audio.paused) {
        pausedByHide = true
        audio.pause()
      } else if (!document.hidden && pausedByHide) {
        pausedByHide = false
        if (!duckedRef.current && preferenceRef.current !== 'off') resume()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [available, resume])

  const track = available ? (tracks[index] ?? null) : null

  /* Lock-screen / headset controls. */
  useEffect(() => {
    if (!available || !track || !('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: track.artist ?? 'Kat & Mike' })
    navigator.mediaSession.setActionHandler('play', toggle)
    navigator.mediaSession.setActionHandler('pause', toggle)
    navigator.mediaSession.setActionHandler('nexttrack', next)
    navigator.mediaSession.setActionHandler('previoustrack', prev)
  }, [available, track, toggle, next, prev])

  const value = useMemo<MusicValue>(
    () => ({ available, playing, track, muted, start, toggle, next, prev, duck }),
    [available, playing, track, muted, start, toggle, next, prev, duck],
  )

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>
}

export const useMusic = (): MusicValue => {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error('useMusic must be used inside <MusicProvider>')
  return ctx
}
