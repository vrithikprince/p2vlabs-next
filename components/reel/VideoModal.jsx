'use client'
import { useEffect, useRef, useState } from 'react'
import useLockScroll from '../ui/useLockScroll.js'
import Icon from '../ui/Icon.jsx'
import Tag from '../ui/Tag.jsx'

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2]

/**
 * Full custom video player — preserved 1:1 from the Vite app.
 * Features: play/pause, seek bar with buffer indicator, volume + mute,
 * playback speed (0.5×–2×), fullscreen, auto-hide controls after 3s, ESC close.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-charcoal/92"
         onClick={onClose}>
      <div
        className={`w-full bg-cream shadow-2xl ${item.orientation === 'portrait' ? 'max-w-sm' : 'max-w-4xl'}`}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-charcoal/10">
          <div className="flex items-center gap-3">
            <span className="text-[9px] tracking-[0.2em] uppercase text-p2v font-medium">{item.subcategory}</span>
            <span className="text-charcoal/20">·</span>
            <span className="text-[9px] tracking-[0.15em] uppercase text-charcoal/40">{item.date}</span>
            {item.duration && (
              <>
                <span className="text-charcoal/20">·</span>
                <span className="text-[9px] tracking-[0.15em] uppercase text-charcoal/40">{item.duration}</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors"
            aria-label="Close"
          >
            <Icon n="x" s={17} />
          </button>
        </div>

        <div
          className="relative bg-charcoal select-none"
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
              <div className="w-16 h-16 border-2 border-cream/60 flex items-center justify-center bg-charcoal/30">
                <Icon n="play" s={26} c="white" style={{ marginLeft: '4px', opacity: 0.9 }} />
              </div>
            </div>
          )}

          <div
            className="absolute bottom-0 left-0 right-0 transition-opacity duration-300"
            style={{ opacity: ctrlShow ? 1 : 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.75))' }}
          >
            <div className="px-3 pt-3 pb-1 cursor-pointer" onClick={seek}>
              <div className="relative h-1 bg-cream/20">
                <div className="absolute inset-y-0 left-0 bg-cream/30" style={{ width: `${buffered}%` }} />
                <div className="absolute inset-y-0 left-0" style={{ width: `${progress}%`, background: '#c0392b' }} />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-p2v border-2 border-cream shadow"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 pb-2.5 pt-1">
              <button onClick={togglePlay}
                className="w-7 h-7 flex items-center justify-center text-cream hover:text-cream/70 transition-colors"
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

              <span className="text-[10px] text-cream/70 tabular-nums min-w-[70px]">
                {curTime} / {durTime}
              </span>

              <div className="flex-1" />

              <button onClick={toggleMute}
                className="w-7 h-7 flex items-center justify-center text-cream hover:text-cream/70 transition-colors"
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
                className="w-16 h-1 cursor-pointer accent-p2v"
                aria-label="Volume"
              />

              <div className="relative">
                <button onClick={() => setSpeedMenu(m => !m)}
                  className="text-[10px] text-cream/70 hover:text-cream px-1.5 py-0.5 border border-cream/20 hover:border-cream/50 transition-colors tabular-nums">
                  {speed}×
                </button>
                {speedMenu && (
                  <div className="absolute bottom-full right-0 mb-1 bg-charcoal border border-cream/15 py-1 min-w-[56px]">
                    {SPEEDS.map((s) => (
                      <button key={s} onClick={() => changeSpeed(s)}
                        className={`block w-full text-[10px] px-3 py-1 text-left tabular-nums transition-colors ${
                          s === speed ? 'text-p2v' : 'text-cream/70 hover:text-cream'
                        }`}>
                        {s}×
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={goFullscreen}
                className="w-7 h-7 flex items-center justify-center text-cream hover:text-cream/70 transition-colors"
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
          <h2 className="font-display text-2xl font-bold text-charcoal mb-1">{item.title}</h2>
          <p className="text-sm text-charcoal/45 mb-4">{item.client}</p>
          <p className="text-sm text-charcoal/60 leading-relaxed mb-5">{item.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((t) => <Tag key={t} red>{t}</Tag>)}
          </div>
        </div>
      </div>
    </div>
  )
}
