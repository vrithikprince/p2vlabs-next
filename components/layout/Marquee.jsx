'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ITEMS = [
  'Cinematic Work', 'Brand Films', 'Photography',
  'Social Content', 'Visual Strategy', 'Story First',
]

/**
 * Continuously-scrolling brand marquee. Speed boosts briefly with scroll
 * velocity (preserved from original). Pauses on hover.
 */
export default function Marquee() {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let xPos = 0, lastScrollY = window.scrollY, vel = 1

    const tick = () => {
      xPos -= 0.42 * vel
      const halfW = track.scrollWidth / 2
      if (-xPos >= halfW) xPos += halfW
      gsap.set(track, { x: xPos })
      vel += (1 - vel) * 0.04
    }
    gsap.ticker.add(tick)

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      vel = Math.min(7, vel + dy * 0.14)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const all = [...ITEMS, ...ITEMS]
  return (
    <div className="overflow-hidden py-5 border-y border-bone/10 select-none"
         style={{ userSelect: 'none' }}>
      <div ref={trackRef} style={{ display: 'inline-flex', whiteSpace: 'nowrap', willChange: 'transform' }}>
        {all.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', paddingRight: '3.5rem' }}>
            <span className="text-[11px] tracking-[0.3em] uppercase font-medium text-bone/35">{t}</span>
            <span className="ml-14 text-amber" style={{ fontSize: '0.45rem', lineHeight: 1 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}
