'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Liquid brand-reveal loader — preserved 1:1 from the Vite app.
 *
 *  1. Dark charcoal screen with white "P2V Labs" + tagline.
 *  2. Frosted glass pane slides left → right.
 *  3. In lockstep, a cream wash sweeps over the page and the text bleeds
 *     from white into deep crimson with organic, blob-like edges
 *     (SVG feTurbulence + feDisplacementMap).
 *  4. Whole loader slides up off-screen.
 */
export default function Loader({ onDone }) {
  const wrapRef       = useRef(null)
  const glassRef      = useRef(null)
  const washRef       = useRef(null)
  const baseLogoRef   = useRef(null)
  const baseTagRef    = useRef(null)
  const crimsonRef    = useRef(null)
  const tagCrimsonRef = useRef(null)
  const displaceRef   = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const wrap = wrapRef.current
    if (!wrap) return

    gsap.set([baseLogoRef.current, baseTagRef.current], { autoAlpha: 0, y: 18 })
    gsap.set(glassRef.current, { left: '-100%' })
    gsap.set([washRef.current, crimsonRef.current, tagCrimsonRef.current], { '--wipe': '-20%' })

    const tl = gsap.timeline()

    tl.to(baseLogoRef.current, { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.25)
    tl.to(baseTagRef.current,  { autoAlpha: 1, y: 0, duration: 0.6,  ease: 'power3.out' }, 0.5)

    const PASS_START    = 1.2
    const PASS_DURATION = 2.6
    tl.to(glassRef.current, {
      left: '100%', duration: PASS_DURATION, ease: 'power3.inOut',
    }, PASS_START)

    const wipeVars = { '--wipe': '120%', duration: PASS_DURATION, ease: 'power3.inOut' }
    tl.to(washRef.current,       wipeVars, PASS_START)
    tl.to(crimsonRef.current,    wipeVars, PASS_START + 0.05)
    tl.to(tagCrimsonRef.current, wipeVars, PASS_START + 0.05)

    if (displaceRef.current) {
      tl.to(displaceRef.current, {
        attr: { scale: 20 },
        duration: PASS_DURATION * 0.5,
        ease: 'power2.inOut',
      }, PASS_START)
      tl.to(displaceRef.current, {
        attr: { scale: 0 },
        duration: PASS_DURATION * 0.5,
        ease: 'power2.inOut',
      }, PASS_START + PASS_DURATION * 0.5)
    }

    const exitAt = PASS_START + PASS_DURATION + 0.25

    tl.call(() => { document.body.style.overflow = ''; onDone?.() }, null, exitAt)
    tl.to(wrap, { yPercent: -100, duration: 1.05, ease: 'power3.inOut' }, exitAt)
    tl.call(() => { if (wrap) wrap.style.display = 'none' }, null, exitAt + 1.15)

    return () => tl.kill()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={wrapRef} id="liquid-loader">
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="liquid-displace" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.025"
              numOctaves="2"
              seed="3"
              result="turb"
            />
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              in2="turb"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div ref={washRef} className="liquid-wash" aria-hidden="true" />

      <div className="liquid-content">
        <div className="liquid-stack">
          <div ref={baseLogoRef} className="liquid-text liquid-text--white">
            P2V Labs
          </div>
          <div ref={crimsonRef} className="liquid-text liquid-text--crimson" aria-hidden="true">
            P2V Labs
          </div>
        </div>
        <div className="liquid-stack liquid-stack--tag">
          <div ref={baseTagRef} className="liquid-tag liquid-tag--white">
            Pixels · Purpose · Visuals
          </div>
          <div ref={tagCrimsonRef} className="liquid-tag liquid-tag--crimson" aria-hidden="true">
            Pixels · Purpose · Visuals
          </div>
        </div>
      </div>

      <div ref={glassRef} className="liquid-glass" aria-hidden="true" />
    </div>
  )
}
