'use client'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site footer - "sticky reveal" pattern. Just the big wordmark; the
 * copyright + Founders utility line lives at the bottom of ContactSection
 * instead, so it scrolls away with that section rather than sitting
 * inside this reveal panel.
 *
 * The footer itself is pinned to the viewport bottom (position: fixed)
 * for the entire page, and a transparent spacer of matching height sits
 * in normal flow where the footer would otherwise be. It only becomes
 * visible once the spacer scrolls into view at the very end of the
 * document. Two things make that reveal actually work, not just position:
 *
 *  1. Stacking order: the fixed panel is rendered via a portal into
 *     #footer-portal-root (the first node in <body>, see app/layout.jsx)
 *     at z-0, and <main> (RootClient.jsx) is explicitly z-10 - an
 *     unambiguous "two positioned siblings compared by z-index" case.
 *     Negative z-index on the footer alone was NOT reliable here: this
 *     page runs GSAP ScrollTrigger everywhere, and scroll-driven
 *     transforms create their own stacking contexts, which broke the
 *     "static content always paints above negative z-index" assumption
 *     in practice.
 *  2. Opacity: z-index only controls order, not coverage. Every section
 *     between Hero and Contact needed its OWN explicit `bg-white` -
 *     they used to look right only because body's background was the
 *     only thing behind them. Once this opaque panel existed behind
 *     everything, any section without its own background let it bleed
 *     straight through the gaps, regardless of stacking order.
 */
export default function Footer() {
  const footerRef = useRef(null)
  const spacerRef = useRef(null)
  const [height, setHeight] = useState(520)
  const [portalNode, setPortalNode] = useState(null)

  useEffect(() => {
    setPortalNode(document.getElementById('footer-portal-root'))
  }, [])

  useLayoutEffect(() => {
    const el = footerRef.current
    if (!el) return
    const measure = () => setHeight(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [portalNode])

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Logo rises into place as the spacer - not the (fixed, non-moving)
         footer itself - scrolls through the reveal window. */
      gsap.fromTo(
        '.footer-logo',
        { yPercent: 26, opacity: 0 },
        {
          yPercent: 0, opacity: 1, ease: 'none',
          scrollTrigger: {
            trigger: spacerRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  const panel = (
    <footer
      ref={footerRef}
      /* white/10, not white/8 - Tailwind's opacity scale runs in steps of 5,
         so /8 generated no colour utility at all and the border fell back to
         preflight's #e5e7eb, painting a pale grey rule across the top of the
         ink panel instead of the intended faint white hairline. */
      className="fixed bottom-0 left-0 w-full z-0 overflow-hidden bg-amp-ink-pill border-t border-white/10 pt-16 lg:pt-24 pb-24 md:pb-8"
    >
      <div className="px-5 md:px-10 lg:px-20 overflow-hidden">
        {/* font-semibold (600), not 700 - the design system reserves
            weight 700 for the hero display only. */}
        <h2
          className="footer-logo will-anim text-center font-plex font-semibold leading-none tracking-tight text-white select-none"
          style={{ fontSize: 'clamp(3.2rem,13vw,10.5rem)' }}
        >
          P2V <span className="text-amp-periwinkle">Labs</span>
        </h2>
      </div>
    </footer>
  )

  return (
    <>
      <div ref={spacerRef} style={{ height }} aria-hidden="true" />
      {portalNode ? createPortal(panel, portalNode) : null}
    </>
  )
}
