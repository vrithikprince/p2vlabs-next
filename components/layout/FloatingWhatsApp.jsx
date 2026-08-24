'use client'
import { useEffect, useRef, useState } from 'react'

/**
 * Persistent WhatsApp CTA, bottom-right of every Next.js page.
 *
 * Behaviour:
 *   - Idle              → pill is tucked off-screen with a small chevron peek
 *                         on the right edge, so the user can always find it.
 *   - Scroll            → pill slides out. After ~1.5s of scroll idle it
 *                         retracts back to the peek.
 *   - Tap the peek      → expand and lock open (don't navigate on this tap).
 *   - Tap again         → open WhatsApp.
 *   - Tap anywhere else → retract.
 *   - Focus             → expand and lock (keyboard a11y).
 *
 * Design notes (preserved):
 *   - No coloured shadow, no circle bubble, no stock green - reads as part of
 *     the brand CTA system, not a third-party widget.
 *   - Near-black amp pill (#1a1f23), white text, hover deepens to pure black -
 *     the same fill as the hero CTA, so it reads as the same button family.
 *
 * Position:
 *   - Mobile  : bottom-20 (clears the BottomNav at ~56px tall)
 *   - Desktop : bottom-7
 *
 * Off-screen translate is safe because `html`/`body` use `overflow-x: clip`
 * (see app/globals.css).
 */
export default function FloatingWhatsApp() {
  const [mounted,  setMounted]  = useState(false)
  const [expanded, setExpanded] = useState(false)
  const lockedRef    = useRef(false)
  const idleTimerRef = useRef(null)
  const fabRef       = useRef(null)

  /* Fade in 4.5s after mount so it doesn't fight the loader / hero entrance. */
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 4500)
    return () => clearTimeout(t)
  }, [])

  /* Scroll expands; 1.5s of idle retracts (unless the user locked it open). */
  useEffect(() => {
    if (!mounted) return
    const onScroll = () => {
      setExpanded(true)
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        if (!lockedRef.current) setExpanded(false)
      }, 1500)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(idleTimerRef.current)
    }
  }, [mounted])

  /* Outside tap collapses a locked-open FAB. */
  useEffect(() => {
    if (!mounted) return
    const onOutside = (e) => {
      if (!fabRef.current || !lockedRef.current) return
      if (!fabRef.current.contains(e.target)) {
        lockedRef.current = false
        setExpanded(false)
      }
    }
    document.addEventListener('mousedown',  onOutside)
    document.addEventListener('touchstart', onOutside, { passive: true })
    return () => {
      document.removeEventListener('mousedown',  onOutside)
      document.removeEventListener('touchstart', onOutside)
    }
  }, [mounted])

  /* First tap on the peek expands & locks; subsequent tap navigates. */
  const handleClick = (e) => {
    if (!expanded) {
      e.preventDefault()
      setExpanded(true)
      lockedRef.current = true
    }
  }

  const handleFocus = () => {
    setExpanded(true)
    lockedRef.current = true
  }

  return (
    <a
      ref={fabRef}
      /* Prefilled message qualifies the inbound up-front: signals brand-side
         intent, opens pricing as a topic so the conversation gets to numbers
         faster (shortens the sales cycle). Reads naturally enough that it
         still feels like the visitor typed it. */
      href="https://wa.me/917048824616?text=Hi%20P2V%20Labs%2C%20I%27d%20like%20to%20discuss%20a%20content%20project%20for%20my%20brand.%20Could%20you%20share%20your%20packages%20and%20starting%20prices%3F"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={expanded ? 'Chat with P2V Labs on WhatsApp' : 'Expand WhatsApp button'}
      aria-expanded={expanded}
      onClick={handleClick}
      onFocus={handleFocus}
      /* `right-0` stays: the tuck maths (translate 100% - 32px) lands the nub
         exactly on the viewport edge, so the pill must dock flush. With
         `rounded-full` the tucked state reads as a rounded nub poking out of
         the edge, and the expanded state as a pill docked against it - both
         deliberate, neither a clipped rectangle. Left padding stays tight
         (pl-2.5) so the chevron sits optically centred inside that 32px nub.
         Neutral ink shadow only - matches the hero chips, keeps the control
         monochrome and stops it reading as a third-party widget. */
      className={`fixed z-40 bottom-20 right-0 md:bottom-7
                  inline-flex items-center gap-3 pl-2.5 pr-5 py-3
                  font-plex rounded-full
                  bg-amp-ink-pill text-white hover:bg-black
                  shadow-[0_8px_24px_-8px_rgba(26,26,26,0.35)]
                  will-change-transform
                  transition-[opacity,transform,background-color] duration-500 ease-out
                  ${mounted ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  ${expanded ? 'translate-x-0' : 'translate-x-[calc(100%-32px)]'}`}
    >
      {/* Peek chevron - always visible. Rotates 180° when expanded so it
          reads as a "tuck back" affordance, not a permanent decoration. */}
      <svg
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
        className={`transition-transform duration-500 ease-out
                    ${expanded ? 'rotate-180' : ''}`}
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>

      {/* WhatsApp glyph - monochrome, same colour as the text. */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>

      {/* 600 matches the amp micro-label weight used across the site; caps +
          wide tracking are kept because this is persistent utility chrome. */}
      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold leading-none">
        WhatsApp
      </span>

      {/* Trailing brand arrow. */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  )
}
