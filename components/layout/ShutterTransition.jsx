'use client'
import { useEffect } from 'react'
import { gsap } from 'gsap'

/**
 * Five vertical strips that close and reopen between page transitions.
 * Bump `trigger` (e.g. an incrementing key) to play the animation.
 */
export default function ShutterTransition({ trigger }) {
  useEffect(() => {
    if (!trigger) return
    const strips = document.querySelectorAll('.shutter-strip')
    gsap.timeline()
      .set(strips, { scaleY: 0, transformOrigin: 'bottom', pointerEvents: 'all' })
      .to(strips, {
        scaleY: 1, duration: 0.32, ease: 'power4.in',
        stagger: { each: 0.04, from: 'center' },
      })
      .set(strips, { transformOrigin: 'top' })
      .to(strips, {
        scaleY: 0, duration: 0.36, ease: 'power4.out',
        stagger: { each: 0.04, from: 'center' },
        delay: 0.06,
        onComplete: () => gsap.set(strips, { pointerEvents: 'none' }),
      })
  }, [trigger])

  return (
    <>
      <div className="shutter-strip" />
      <div className="shutter-strip" />
      <div className="shutter-strip" />
      <div className="shutter-strip" />
      <div className="shutter-strip" />
    </>
  )
}
