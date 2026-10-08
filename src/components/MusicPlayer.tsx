import { useI18n } from '../i18n'
import { useMusic } from '../lib/music'

type MusicPlayerProps = { visible: boolean }

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} fill="currentColor" />
  </svg>
)

const PLAY = 'M8 5.5v13a1 1 0 0 0 1.55.83l10-6.5a1 1 0 0 0 0-1.66l-10-6.5A1 1 0 0 0 8 5.5Z'
const PAUSE = 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z'
const NEXT = 'M6 6.2v11.6a.8.8 0 0 0 1.25.66L15 13.2v4.6h2.5V6.2H15v4.6L7.25 5.54A.8.8 0 0 0 6 6.2Z'
const PREV = 'M18 6.2v11.6a.8.8 0 0 1-1.25.66L9 13.2v4.6H6.5V6.2H9v4.6l7.75-5.26A.8.8 0 0 1 18 6.2Z'

/** Compact floating player: play/pause, prev/next, now-playing and an equalizer. */
export const MusicPlayer = ({ visible }: MusicPlayerProps) => {
  const { t } = useI18n()
  const { available, playing, muted, track, toggle, next, prev } = useMusic()
  if (!available || !track) return null

  const invite = !playing && !muted

  return (
    <div
      className={`music ${visible ? 'is-visible' : ''} ${playing ? 'is-playing' : ''} ${invite ? 'is-invite' : ''}`}
      role="group"
      aria-label={t.music.label}
    >
      <button
        type="button"
        className="music__toggle"
        onClick={toggle}
        aria-label={playing ? t.music.pause : t.music.play}
        aria-pressed={playing}
        tabIndex={visible ? 0 : -1}
      >
        <Icon d={playing ? PAUSE : PLAY} />
      </button>

      <div className="music__info" aria-live="polite">
        <span className="music__state">{invite ? t.music.cta : t.music.nowPlaying}</span>
        <span className="music__title">
          {track.title}
          {track.artist ? ` — ${track.artist}` : ''}
        </span>
      </div>

      <span className="music__eq" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>

      <button type="button" className="music__skip" onClick={prev} aria-label={t.music.prev} tabIndex={visible ? 0 : -1}>
        <Icon d={PREV} />
      </button>
      <button type="button" className="music__skip" onClick={next} aria-label={t.music.next} tabIndex={visible ? 0 : -1}>
        <Icon d={NEXT} />
      </button>
    </div>
  )
}
