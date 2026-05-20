'use client'
import { useEffect, useState } from 'react'

/**
 * Persistent WhatsApp CTA, bottom-right of every Next.js page.
 *
 * Design notes — what we deliberately don't do:
 *   - No coloured shadow (the dead-giveaway for a third-party chat widget).
 *   - No circle bubble (universal "livechat plugin" pattern).
 *   - No bright primary fill — charcoal pill matches the brand CTA system
 *     used in ContactSection's Email/WhatsApp buttons, so the floating
 *     control reads as part of the same design language, not an add-on.
 *
 * What we do:
 *   - Horizontal pill, sharp corners, ~170×44 px on mobile, same on desktop.
 *   - charcoal bg + cream label + monochrome WhatsApp glyph (same colour as
 *     the text, not the stock green).
 *   - Hover shifts to brand red — the colour is the affordance, not the idle.
 *   - Pure fade-in entrance (no slide / no bounce / no pulse).
 *
 * Position:
 *   - Mobile  : bottom-20 (clears the BottomNav at ~56px tall)
 *   - Desktop : bottom-7  (no BottomNav, breathing room from page edge)
 */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    /* Fade in 4.5s after mount so it doesn't fight the liquid loader
       or the hero entrance. */
    const t = setTimeout(() => setVisible(true), 4500)
    return () => clearTimeout(t)
  }, [])

  return (
    <a
      href="https://wa.me/917048824616?text=Hi%20P2V%20Labs%2C%20I%27d%20love%20to%20chat%20about%20a%20project."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with P2V Labs on WhatsApp"
      className={`fixed z-40 bottom-20 right-5 md:bottom-7 md:right-7
                  inline-flex items-center gap-3 px-5 py-3
                  bg-charcoal text-cream hover:bg-p2v
                  transition-[opacity,background-color] duration-500
                  ${visible
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'}`}
    >
      {/* Monochrome WhatsApp glyph — same colour as the text, no stock
          green. Channel hint only; the label does the talking. */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>

      <span className="text-[10px] tracking-[0.2em] uppercase font-medium leading-none">
        WhatsApp
      </span>

      {/* Trailing arrow — same icon vocabulary as the rest of the site's
          CTAs (Reel preview "View All", PostCTA "Send a brief", etc.) */}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.5"
           strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  )
}
