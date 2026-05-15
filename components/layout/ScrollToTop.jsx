'use client'
import { useEffect } from 'react'

/**
 * Fixed bottom-right "back to top" button. Adds `.visible` class once the user
 * has scrolled > 70vh. Hidden state slides off to the right (avoids viewport
 * bleed on mobile that can cause horizontal layout shift).
 */
export default function ScrollToTop() {
  useEffect(() => {
    const btn = document.getElementById('scroll-top-btn')
    if (!btn) return
    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) btn.classList.add('visible')
      else btn.classList.remove('visible')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      id="scroll-top-btn"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      aria-label="Back to top"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
