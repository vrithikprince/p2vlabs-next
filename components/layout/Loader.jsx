'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Handwriting loader.
 *
 *   1. "P2V Labs" reveals left-to-right via a CSS clip-path sweep on a
 *      stroked SVG <text>. The browser computes glyph outlines as paths,
 *      so as the clip exposes them they appear to be drawn in.
 *   2. A solid-fill copy of the text fades in on top, so the inked
 *      letters end up as proper Playfair Display crimson — not just an
 *      outlined ghost.
 *   3. The stroke layer fades out once the fill is in (otherwise the
 *      1.5px stroke would bloat the final letterforms).
 *   4. "Pixels · Purpose · Visuals" soft-fades in below the name.
 *   5. Whole loader fades out; onDone fires at the start of the fade so
 *      the hero renders behind the dissolving loader.
 */
export default function Loader({ onDone }) {
  const wrapRef    = useRef(null)
  const outlineRef = useRef(null)
  const fillRef    = useRef(null)
  const tagRef     = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const wrap    = wrapRef.current
    const outline = outlineRef.current
    const fill    = fillRef.current
    const tag     = tagRef.current
    if (!wrap || !outline || !fill || !tag) return

    /* Initial state. Outline is stroked but clipped to zero width;
       fill text exists but is transparent; tag is offset + invisible. */
    gsap.set(outline, { clipPath: 'inset(0 100% 0 0)', autoAlpha: 1 })
    gsap.set(fill,    { fillOpacity: 0 })
    gsap.set(tag,     { autoAlpha: 0, y: 8 })

    const tl = gsap.timeline()

    const WRITE_START    = 0.2
    const WRITE_DURATION = 1.5
    const FILL_START     = WRITE_START + WRITE_DURATION * 0.65   // 1.175
    const FILL_DURATION  = 0.85
    const FILL_END       = FILL_START + FILL_DURATION            // 2.025

    /* Phase 1 — outline reveals left to right (the "writing"). */
    tl.to(outline, {
      clipPath: 'inset(0 0% 0 0)',
      duration: WRITE_DURATION,
      ease: 'power2.inOut',
    }, WRITE_START)

    /* Phase 2 — fill fades in to "ink" the letters solid. Starts before
       the write completes so the trail of the pen blends into solid. */
    tl.to(fill, {
      fillOpacity: 1,
      duration: FILL_DURATION,
      ease: 'power2.out',
    }, FILL_START)

    /* Phase 3 — outline fades so the final letterforms aren't bloated. */
    tl.to(outline, {
      autoAlpha: 0,
      duration: 0.45,
      ease: 'power2.inOut',
    }, WRITE_START + WRITE_DURATION + 0.05)

    /* Phase 4 — tag fades in only AFTER the fill is fully in, with a
       short beat so the name reads as "settled" before the tag arrives. */
    const TAG_START    = FILL_END + 0.15                          // 2.175
    const TAG_DURATION = 0.7
    tl.to(tag, {
      autoAlpha: 1, y: 0,
      duration: TAG_DURATION,
      ease: 'power2.out',
    }, TAG_START)

    /* Phase 5 — onDone at start of fade-out so the hero renders behind
       the dissolving loader rather than popping in afterwards. */
    const exitAt = TAG_START + TAG_DURATION + 0.45                // 3.325
    tl.call(() => { document.body.style.overflow = ''; onDone?.() }, null, exitAt)
    tl.to(wrap, { autoAlpha: 0, duration: 0.75, ease: 'power2.inOut' }, exitAt)
    tl.call(() => { if (wrap) wrap.style.display = 'none' }, null, exitAt + 0.85)

    return () => {
      tl.kill()
      /* Reset body overflow in case the loader unmounts before phase 5
         runs (e.g. RootClient flipped `loaded` to true via sessionStorage
         on a re-mount). Otherwise the body stays scroll-locked. */
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} id="ink-loader">
      <div className="ink-content">
        <svg
          className="ink-svg"
          viewBox="0 0 800 180"
          aria-label="P2V Labs"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Filled layer — appears after the stroke draws. Initial
              fill-opacity=0 inline so the first paint is invisible;
              otherwise React renders the default fill-opacity (1)
              before useEffect can run gsap.set, causing a flash of
              the solid letters at t=0. */}
          <text
            ref={fillRef}
            x="400" y="128"
            textAnchor="middle"
            className="ink-text"
            fill="#c0392b"
            fillOpacity="0"
            stroke="none"
          >
            P2V Labs
          </text>
          {/* Outline layer — stroked, clip-path-revealed left to right.
              Initial clip-path inline for the same reason as above. */}
          <text
            ref={outlineRef}
            x="400" y="128"
            textAnchor="middle"
            className="ink-text"
            fill="none"
            stroke="#c0392b"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ clipPath: 'inset(0 100% 0 0)' }}
          >
            P2V Labs
          </text>
        </svg>
        <div
          ref={tagRef}
          className="ink-tag"
          style={{ opacity: 0, visibility: 'hidden' }}
        >
          Pixels · Purpose · Visuals
        </div>
      </div>
    </div>
  )
}
