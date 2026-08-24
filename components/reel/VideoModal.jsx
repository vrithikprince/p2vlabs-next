'use client'
import { useEffect, useRef, useState } from 'react'
import useLockScroll from '../ui/useLockScroll.js'
import Icon from '../ui/Icon.jsx'
import Tag from '../ui/Tag.jsx'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

/**
 * Full custom video player - behaviour carried over 1:1 from the Vite app,
 * chrome re-skinned onto the amp design system (ink-pill darks, white text,
 * violet as the single player accent instead of the old brand red).
 * Features: play/pause, seek bar with buffer indicator, volume + mute,
 * playback speed (0.5×-2×), fullscreen, auto-hide controls after 3s, ESC close.
 *
 * Stays a dark surface on purpose: the stage has to recede so the footage
 * is the brightest thing on screen. Only the info panel below it is white.
 */
export default function VideoModal({ item, onClose }) {
  useLockScroll()
  const videoRef  = useRef(null)
  const hideTimer = useRef(null)
  const [playing,   setPlaying]   = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [buffered,  setBuffered]  = useState(0)
  const [curTime,   setCurTime]   = useState('0:00')
  const [durTime,   setDurTime]   = useState('0:00')
  const [volume,    setVolume]    = useState(1)
  const [muted,     setMuted]     = useState(false)
  const [speed,     setSpeed]     = useState(1)
  const [speedMenu, setSpeedMenu] = useState(false)
  const [ctrlShow,  setCtrlShow]  = useState(true)

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay  = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime  = () => {
      setCurTime(fmt(v.currentTime))
      setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0)
      if (v.buffered.length) {
        setBuffered((v.buffered.end(v.buffered.length - 1) / v.duration) * 100)
      }
    }
    const onMeta = () => setDurTime(fmt(v.duration))

    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('loadedmetadata', onMeta)
    v.play().catch(() => {})

    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('loadedmetadata', onMeta)
    }
  }, [])

  const resetHide = () => {
    setCtrlShow(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => { if (playing) setCtrlShow(false) }, 3000)
  }

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    v.paused ? v.play() : v.pause()
    resetHide()
  }

  const seek = (e) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * v.duration
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const changeVol = (e) => {
    const v = videoRef.current
    if (!v) return
    const val = parseFloat(e.target.value)
    v.volume = val
    setVolume(val)
    v.muted = val === 0
    setMuted(val === 0)
  }

  const changeSpeed = (s) => {
    const v = videoRef.current
    if (v) v.playbackRate = s
    setSpeed(s)
    setSpeedMenu(false)
  }

  const goFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (v.requestFullscreen) v.requestFullscreen()
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-amp-ink-pill/35 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Floating close - sits in the top-right of the viewport, on top
          of the blurred backdrop. e.stopPropagation prevents the outer
          onClick from also firing (would double-close, harmless but
          cleaner this way). */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="fixed top-5 right-5 md:top-7 md:right-7 z-[60] w-11 h-11 rounded-md flex items-center justify-center bg-white/95 text-black hover:bg-amp-ink-pill hover:text-white border border-amp-hairline backdrop-blur-sm transition-colors shadow-lg"
        aria-label="Close"
      >
        <Icon n="x" s={20} />
      </button>

      {/* overflow-hidden so the video stage's own corners follow the card
          radius - the speed menu opens upward *inside* the stage, so it
          never needs to escape this box. */}
      <div
        className={`w-full bg-white rounded-[16px] overflow-hidden shadow-2xl ${item.orientation === 'portrait' ? 'max-w-sm' : 'max-w-4xl'}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center px-5 py-3.5 border-b border-amp-hairline">
          {/* amp eyebrow idiom: caption-grey all-caps with a small accent
              dot, in place of the old 9px/0.2em red editorial label. The
              separators use hairline-strong, not the hairline border token
              - at #d5d9e0 on white they were effectively invisible. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold tracking-[0.08em] uppercase">
            <span className="flex items-center gap-2 text-amp-caption">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
              {item.subcategory}
            </span>
            <span className="text-amp-hairline-strong">·</span>
            <span className="text-amp-caption">{item.date}</span>
            {item.duration && (
              <>
                <span className="text-amp-hairline-strong">·</span>
                <span className="text-amp-caption">{item.duration}</span>
              </>
            )}
          </div>
        </div>

        <div
          className="relative bg-amp-ink-pill select-none"
          style={{ paddingBottom: item.orientation === 'portrait' ? '177.78%' : '56.25%' }}
          onMouseMove={resetHide}
          onMouseLeave={() => { if (playing) setCtrlShow(false) }}
        >
          <video
            ref={videoRef}
            src={item.videoUrl}
            poster={item.thumbnailUrl}
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full border-2 border-white/60 flex items-center justify-center bg-amp-ink-pill/30">
                <Icon n="play" s={26} c="white" style={{ marginLeft: '4px', opacity: 0.9 }} />
              </div>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
            style={{ opacity: ctrlShow ? 1 : 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.75))' }}
          >
            <div className="px-3 pt-3 pb-1 cursor-pointer" onClick={seek}>
              {/* violet is the one accent on this dark chrome - navy would
                  vanish against the ink-pill ground, and cobalt is spoken
                  for by the homepage hero. */}
              <div className="relative h-1 rounded-full bg-white/20">
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/30" style={{ width: `${buffered}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-amp-violet" style={{ width: `${progress}%` }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-amp-violet border-2 border-white shadow"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 pb-2.5 pt-1">
              <button onClick={togglePlay}
                className="w-7 h-7 flex items-center justify-center text-white hover:text-white/70 transition-colors"
                aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                    <rect x="5" y="3" width="4" height="18"/>
                    <rect x="15" y="3" width="4" height="18"/>
                  </svg>
                ) : (
                  <Icon n="play" s={14} c="white" style={{ marginLeft: '2px' }} />
                )}
              </button>

              <span className="text-[10px] text-white/70 tabular-nums min-w-[70px]">
                {curTime} / {durTime}
              </span>

              <div className="flex-1" />

              <button onClick={toggleMute}
                className="w-7 h-7 flex items-center justify-center text-white hover:text-white/70 transition-colors"
                aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                  </svg>
                )}
              </button>
              <input
                type="range" min="0" max="1" step="0.05"
                value={muted ? 0 : volume}
                onChange={changeVol}
                className="w-16 h-1 cursor-pointer accent-amp-violet"
                aria-label="Volume"
              />

              <div className="relative">
                <button onClick={() => setSpeedMenu(m => !m)}
                  className="text-[10px] text-white/70 hover:text-white px-1.5 py-0.5 rounded-md border border-white/20 hover:border-white/50 transition-colors tabular-nums">
                  {speed}×
                </button>
                {speedMenu && (
                  <div className="absolute bottom-full right-0 mb-1 bg-amp-ink-pill rounded-md border border-white/15 py-1 min-w-[56px]">
                    {SPEEDS.map((s) => (
                      <button key={s} onClick={() => changeSpeed(s)}
                        className={`block w-full text-[10px] px-3 py-1 text-left tabular-nums transition-colors ${
                          s === speed ? 'text-amp-violet' : 'text-white/70 hover:text-white'
                        }`}>
                        {s}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={goFullscreen}
                className="w-7 h-7 flex items-center justify-center text-white hover:text-white/70 transition-colors"
                aria-label="Fullscreen">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="15 3 21 3 21 9"/>
                  <polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 md:p-7">
          <h2 className="font-plex text-2xl font-semibold tracking-[-0.01em] text-black mb-1">{item.title}</h2>
          <p className="text-sm text-amp-caption mb-4">{item.client}</p>
          <p className="text-sm text-amp-body leading-relaxed mb-5">{item.description}</p>
          {/* neutral tags rather than Tag's accented `red` variant - a whole
              row of accented chips isn't "rare and intentional", and this
              panel's one marker is already the header dot. */}
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  )
}
