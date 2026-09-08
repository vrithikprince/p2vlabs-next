'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Motion for the /services cluster.
 *
 * This is a behaviour wrapper, not a layout one: the page stays a Server
 * Component and passes its already-rendered markup through as `children`,
 * so none of the copy or the JSON-LD moves into the client bundle. All this
 * ships is the choreography.
 *
 * Everything animates from a visible resting state, never from opacity: 0
 * set in CSS. If the JS fails or a crawler renders without it, the page is
 * simply the static page - which matters more than usual here, because this
 * cluster exists to be read by machines.
 *
 * The pieces, and what each is for:
 *   - Masthead: a clip reveal on the headline lines, then the supporting
 *     copy. The site already uses word-clip entrances; this is that idiom.
 *   - Ghost numeral: parallax. It is the cheapest possible depth cue and it
 *     makes the masthead feel like it has a background rather than a
 *     decoration sitting flat on it.
 *   - Index rows: a short stagger as each group enters. Rows arrive as a
 *     list being dealt, which is what an index should feel like.
 *   - Marquee: scroll-velocity linked. The CSS animation is the no-JS
 *     fallback and gets switched off here so GSAP can own the transform -
 *     the ticker then speeds up and skews with the scroll and settles back,
 *     which is the one bit of the page that reads as alive rather than
 *     animated.
 *   - Process rule: draws left to right as the band enters, so the four
 *     steps read as a sequence being laid down.
 */
export default function ServicesMotion({ children }) {
  const scope = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      /* ── masthead ─────────────────────────────────────────────────── */
      const lines = gsap.utils.toArray('[data-anim="line"] > span')
      if (lines.length) {
        gsap.from(lines, {
          yPercent: 112,
          duration: 1.05,
          ease: 'expo.out',
          stagger: 0.085,
          delay: 0.05,
        })
      }
      gsap.from('[data-anim="lede"]', {
        y: 18, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.45,
      })
      gsap.from('[data-anim="eyebrow"]', {
        y: 10, opacity: 0, duration: 0.7, ease: 'power3.out',
      })

      /* ── ghost numeral parallax ───────────────────────────────────── */
      gsap.utils.toArray('[data-anim="ghost"]').forEach((el) => {
        gsap.to(el, {
          yPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        })
      })

      /* ── scroll reveals ───────────────────────────────────────────────
         fromTo with immediateRender:false, never gsap.from, and the reason
         matters on this page specifically. gsap.from applies its start
         state the moment the tween is built, so the element sits at
         opacity 0 and only becomes visible if the ScrollTrigger actually
         fires. Anything that renders without scrolling - a crawler, a
         screenshot service, an AI agent fetching the page, a failed
         refresh after the loader changes the document height - then sees
         a blank index. This cluster exists to be read by machines, so the
         resting state has to be the visible one: no trigger, no animation,
         full content.                                                    */
      const reveal = (targets, vars, trigger, start) => {
        const els = gsap.utils.toArray(targets)
        if (!els.length) return
        gsap.fromTo(els, vars.from, {
          ...vars.to,
          immediateRender: false,
          scrollTrigger: { trigger, start, once: true },
        })
      }

      gsap.utils.toArray('[data-anim="rows"]').forEach((group) => {
        reveal(
          group.querySelectorAll('[data-anim="row"]'),
          {
            from: { y: 26, opacity: 0 },
            to: { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.07 },
          },
          group,
          'top 82%',
        )
      })

      /* ── process rule draws in ────────────────────────────────────── */
      gsap.utils.toArray('[data-anim="rule"]').forEach((el) => {
        reveal(
          el,
          {
            from: { scaleX: 0, transformOrigin: 'left center' },
            to: { scaleX: 1, duration: 1.1, ease: 'power3.inOut' },
          },
          el,
          'top 88%',
        )
        const cells = el.parentElement?.querySelectorAll('[data-anim="step"]')
        if (cells?.length) {
          reveal(
            cells,
            {
              from: { y: 22, opacity: 0 },
              to: { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1 },
            },
            el,
            'top 88%',
          )
        }
      })

      /* ── constellation ────────────────────────────────────────────── */
      const edges = gsap.utils.toArray('[data-anim="edge"]')
      if (edges.length) {
        /* Fade rather than a stroke draw-on: DrawSVG is a paid plugin this
           project does not license, and hand-rolling dashoffset across six
           lines of differing length buys very little over a staggered fade
           that reads as the constellation wiring itself up. */
        gsap.from(edges, {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.09,
          delay: 0.5,
        })
      }
      const nodes = gsap.utils.toArray('[data-anim="node"]')
      if (nodes.length) {
        gsap.from(nodes, {
          scale: 0.72,
          opacity: 0,
          duration: 0.8,
          ease: 'back.out(1.6)',
          stagger: 0.07,
          delay: 0.35,
        })
        /* Each node drifts on its own period so the group never pulses in
           unison, which is what makes a set of floating things look
           mechanical. Same trick the hero's wash blobs use. */
        nodes.forEach((n, i) => {
          gsap.to(n, {
            x: (i % 2 ? 1 : -1) * (5 + (i % 3) * 3),
            y: (i % 3 ? -1 : 1) * (6 + (i % 4) * 3),
            duration: 7 + (i % 5) * 1.6,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: i * 0.25,
          })
        })
      }

      /* ── velocity-linked marquee ──────────────────────────────────── */
      const track = scope.current?.querySelector('[data-anim="marquee"]')
      if (track) {
        // Hand the transform to GSAP. The CSS keyframe stays in the
        // stylesheet as the no-JS fallback and is switched off only once
        // this has actually taken over.
        track.style.animation = 'none'
        const spin = gsap.to(track, {
          xPercent: -50,
          duration: 34,
          ease: 'none',
          repeat: -1,
        })

        const skew = gsap.quickTo(track, 'skewX', { duration: 0.5, ease: 'power3.out' })
        let settle
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = self.getVelocity()
            spin.timeScale(gsap.utils.clamp(0.6, 5, 1 + Math.abs(v) / 900))
            skew(gsap.utils.clamp(-7, 7, -v / 320))
            clearTimeout(settle)
            settle = setTimeout(() => {
              spin.timeScale(1)
              skew(0)
            }, 180)
          },
        })
      }
    }, scope)

    /* The intro loader is still in the document when these triggers are
       created, so every start position is measured against the wrong height.
       Re-measure once the page has actually settled. */
    const refresh = () => ScrollTrigger.refresh()
    const t1 = setTimeout(refresh, 800)
    const t2 = setTimeout(refresh, 3600)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [])

  return <div ref={scope}>{children}</div>
}
