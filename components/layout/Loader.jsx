'use client'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

/* useLayoutEffect warns during SSR; this component is client-only in practice
   but still gets server-rendered, so fall back to useEffect on the server. */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Brand loader.
 *
 * Sequence (three beats):
 *   1. "PV" arrives as one unit - the two letters sit flush against each other,
 *      because the slot the "2" will occupy is collapsed by transforms.
 *   2. The "2" drops in from above into that slot while P slides left and V
 *      slides right to open the gap for it. Landing and parting are the same
 *      tween duration so the 2 appears to physically push the letters apart.
 *   3. "Labs" fades in once the mark has settled.
 *
 * Built from positioned spans rather than the previous SVG <text> + clip-path
 * sweep: the old approach could only reveal the whole wordmark left-to-right,
 * and this sequence needs per-glyph transforms.
 *
 * The parting distance is MEASURED off the rendered "2" (half its width to each
 * side, so together they close exactly its slot) rather than hard-coded in em -
 * a hard-coded value drifts whenever the face or size changes. Measurement is
 * deferred until the webfont is ready, otherwise it happens against the
 * fallback face and the letters visibly mis-seat when Plex swaps in.
 *
 * onDone fires at the START of the wrapper fade so whatever is behind the
 * loader is already painted as it dissolves - that contract is relied on by
 * RootClient (it flips `loaded` and writes the sessionStorage key).
 */
export default function Loader({ onDone }) {
  const wrapRef = useRef(null)
  const pRef    = useRef(null)
  const twoRef  = useRef(null)
  const vRef    = useRef(null)
  const labsRef = useRef(null)
  const tagRef  = useRef(null)
  const contentRef = useRef(null)

  /* Hide everything BEFORE first paint.
     The timeline itself can't start until the webfont resolves (the split
     distance is measured off the rendered "2"), but hiding must not wait on
     that - otherwise the fully-assembled "P2V Labs" paints for a frame or two
     and then snaps back to the start, which is exactly what it looked like.
     Layout-effect so it lands before the browser paints, not after. */
  useIsomorphicLayoutEffect(() => {
    const P = pRef.current, TWO = twoRef.current, V = vRef.current
    const LABS = labsRef.current, TAG = tagRef.current
    if (!P || !TWO || !V || !LABS || !TAG) return
    gsap.set([P, V], { opacity: 0, y: 18 })
    gsap.set(TWO,  { opacity: 0, y: -110 })
    gsap.set(LABS, { opacity: 0, y: 6 })
    gsap.set(TAG,  { opacity: 0, y: 8 })
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const wrap = wrapRef.current
    const P    = pRef.current
    const TWO  = twoRef.current
    const V    = vRef.current
    const LABS = labsRef.current
    const TAG  = tagRef.current
    const content = contentRef.current
    if (!wrap || !P || !TWO || !V || !LABS || !TAG || !content) return

    let tl = null
    let cancelled = false

    const build = () => {
      if (cancelled) return

      /* Half the 2's width to each side: P moves right by half, V left by half,
         so together they close exactly the slot the 2 will land in. Falls back
         to a measured-em approximation if the glyph reports zero width (which
         happens if this somehow runs while display:none). */
      const half = (TWO.getBoundingClientRect().width || TWO.offsetWidth || 0) / 2
      const shift = half > 0 ? half : 22

      /* Opacity/y were already zeroed pre-paint by the layout effect above;
         only the measured horizontal offsets need applying here, since they
         are the one thing that genuinely depends on the font being ready. */
      gsap.set(P, { x:  shift })
      gsap.set(V, { x: -shift })

      /* Single speed knob for the whole sequence. Every beat below is written
         at its natural rhythm and then scaled here, so the relative timing
         (contact lag, settle, the gap before "Labs") stays intact no matter
         how this is tuned - retiming the constants individually is how they
         drifted out of sync last time.
         < 1 is slower, > 1 is faster. 1 ran ~3.1s end to end; 0.75 was ~4.1s.
         Back to 1.1 (~2.5s): Core Web Vitals is a live ranking signal measured
         on real users, and a four second branded hold on every cold load is
         exactly what shows up in CrUX. The hero is fully painted underneath by
         ~600ms, so everything past that was costing field data for nothing. */
      const SPEED = 1.1

      tl = gsap.timeline()
      tl.timeScale(SPEED)

      /* Beat 1 - "PV" arrives, already closed up. */
      tl.to([P, V], {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power3.out', stagger: 0.06,
      }, 0.1)

      /* Beat 2 - the 2 falls and wedges the letters apart.
         Modelled as one physical event rather than two parallel tweens:
           - the FALL uses power2.in, because a dropping object accelerates.
             (back.out, which this used to use, decelerates into an overshoot -
             it read as the 2 being placed rather than falling.)
           - it overshoots slightly past the baseline, then settles with a
             single crisp back.out. One overshoot, no wobble - elastic felt
             too playful against an editorial wordmark.
           - the letters are shoved apart starting at CONTACT, ~70% through
             the fall, not at t=0 of the drop. That lag is the whole reason
             it reads as cause-and-effect instead of choreography. */
      const DROP_AT  = 0.8
      const FALL     = 0.30
      const CONTACT  = DROP_AT + FALL * 0.7
      const SETTLE   = 0.42
      const PUSH     = 0.66

      tl.set(TWO, { opacity: 1 }, DROP_AT)
      tl.to(TWO, { y: 8,  duration: FALL,   ease: 'power2.in'  }, DROP_AT)
      tl.to(TWO, { y: 0,  duration: SETTLE, ease: 'back.out(2.4)' }, DROP_AT + FALL)
      tl.to([P, V], { x: 0, duration: PUSH, ease: 'back.out(1.6)' }, CONTACT)

      /* Beat 3 - "Labs" fades in only once the split has actually settled,
         so the two events never overlap and compete for attention. */
      const SPLIT_END = CONTACT + PUSH
      tl.to(LABS, {
        opacity: 1, y: 0,
        duration: 0.6, ease: 'power2.out',
      }, SPLIT_END - 0.05)

      /* Tagline trails the wordmark so the name reads as settled first.
         Derived from the beats above rather than hard-coded - retuning the
         fall or the push used to silently desync these two. */
      const LABS_AT = SPLIT_END - 0.05
      const TAG_AT  = LABS_AT + 0.25
      tl.to(TAG, {
        opacity: 1, y: 0,
        duration: 0.5, ease: 'power2.out',
      }, TAG_AT)

      /* Exit - in two stages, mark then sheet.
         Fading the whole overlay as one unit looked like double vision: the
         loader's wordmark is dead centre and so is the hero headline behind
         it, so a straight crossfade means you briefly read both texts through
         each other. Letting the mark leave first means the sheet only ever
         turns transparent over an empty white field.
           1. mark + tagline fade and drift up (they exit "upward", so they
              also clear the headline's optical centre rather than sitting on
              it while dissolving)
           2. the white sheet lifts once the mark is ~80% gone
         onDone fires at the very end - RootClient unmounts this component the
         moment it does, which would cut any still-running tween. */
      const exitAt     = TAG_AT + 0.62
      const MARK_OUT   = 0.42
      const SHEET_OUT  = 0.55
      const SHEET_AT   = exitAt + MARK_OUT * 0.8

      tl.to(content, {
        opacity: 0, y: -18, scale: 0.985,
        duration: MARK_OUT, ease: 'power2.in',
      }, exitAt)
      tl.to(wrap, {
        autoAlpha: 0,
        duration: SHEET_OUT, ease: 'power1.inOut',
      }, SHEET_AT)
      tl.call(() => { document.body.style.overflow = ''; onDone?.() }, null, SHEET_AT + SHEET_OUT)
    }

    /* Wait for the webfont, but never let a font failure strand the loader on
       screen - whichever settles first wins. */
    const ready = typeof document !== 'undefined' && document.fonts
      ? document.fonts.ready
      : Promise.resolve()
    Promise.race([ready, new Promise((r) => setTimeout(r, 600))]).then(build)

    return () => {
      cancelled = true
      tl?.kill()
      /* Reset overflow in case we unmount before the exit call runs (e.g.
         RootClient flips `loaded` from sessionStorage on a remount). */
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} id="ink-loader">
      {/* The glyphs start at opacity:0 in CSS (see globals.css) and only GSAP
          reveals them, and only GSAP dismisses this overlay - so without JS
          this would be a blank white sheet pinned over the whole site. Drop
          the overlay entirely in that case and let the page through. */}
      <noscript>
        <style>{`#ink-loader{display:none!important}`}</style>
      </noscript>
      <div ref={contentRef} className="ink-content">
        <div className="ink-word" aria-label="P2V Labs">
          <span ref={pRef}   className="ink-char" aria-hidden="true">P</span>
          <span ref={twoRef} className="ink-char" aria-hidden="true">2</span>
          <span ref={vRef}   className="ink-char" aria-hidden="true">V</span>
          <span ref={labsRef} className="ink-labs" aria-hidden="true">Labs</span>
        </div>
        <div ref={tagRef} className="ink-tag">Pixels · Purpose · Visuals</div>
      </div>
    </div>
  )
}
