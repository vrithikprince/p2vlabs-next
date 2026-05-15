'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

/**
 * Desktop-only custom cursor — small dot + lerping ring.
 * Adds `cursor-hover` / `cursor-click` body classes for hover/click states.
 * Skipped entirely on touch devices via the (hover: hover) media query.
 */
export default function CustomCursor() {
  const [active, setActive] = useState(false)
  const dotRef  = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (hasHover) setActive(true)
  }, [])

  useEffect(() => {
    if (!active) return
    document.body.classList.add('has-custom-cursor')
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100, rx = -100, ry = -100, rafId
    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY
      gsap.set(dot, { x: mx, y: my })
    }
    const loop = () => {
      rx = lerp(rx, mx, 0.11); ry = lerp(ry, my, 0.11)
      gsap.set(ring, { x: rx, y: ry })
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const onEnter = () => document.body.classList.add('cursor-hover')
    const onLeave = () => document.body.classList.remove('cursor-hover')
    const onDown  = () => document.body.classList.add('cursor-click')
    const onUp    = () => document.body.classList.remove('cursor-click')

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    const addListeners = () => {
      document.querySelectorAll('a,button,[role=button]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    addListeners()
    const obs = new MutationObserver(addListeners)
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      document.body.classList.remove('has-custom-cursor', 'cursor-hover', 'cursor-click')
      obs.disconnect()
    }
  }, [active])

  if (!active) return null
  return (
    <>
      <div ref={dotRef}  id="cursor-dot" />
      <div ref={ringRef} id="cursor-ring" />
    </>
  )
}
