'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import CapabilityLoop from './CapabilityLoop.jsx'

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin)

/* The rotating word cycling in cobalt - Amplitude's "voltage-as-verb"
   move. Kept short, like their captured taglines, so the headline never
   wraps awkwardly at the clamp() minimum. */
const ROTATOR_WORDS = ['found.', 'recommended by AI.', 'booked.', 'retained.']

/**
 * Hero - full Amplitude-inspired design system (see tailwind.config.js's
 * `amp-*` tokens): white canvas, near-black pill CTA, cobalt reserved
 * exclusively for the rotating headline word, navy/violet/periwinkle as
 * the secondary accents on the floating chips and capability-loop cards.
 * Structural swap from the previous editorial hero: single centered
 * column instead of an 8/4 split, one rotating cobalt word instead of a
 * static accent line. The magnetic-CTA hover is carried over unchanged;
 * entrance timing runs fast (see the `D` comment below) rather than
 * waiting on the ink loader.
 */
export default function Hero() {
  const router = useRouter()
  const heroRef = useRef(null)
  const [wordIndex, setWordIndex] = useState(0)

  const scrollTo = (id) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Previously synced to the ink loader's exit (~3.33s) so the hero
         wouldn't visibly "pop in" after the loader dissolved. In practice
         that meant the hero stayed fully invisible for 3.33s and then
         took another ~1.5s to finish staggering in (headline, tagline,
         CTAs, chips, capability loop) - close to 5s of a blank page
         before the hero fully rendered. Running the entrance fast instead
         means it finishes well within the loader's own ~3.3s runtime, so
         the hero is already fully in place *underneath* the loader by
         the time it dissolves - same "no pop-in" result, without making
         the visitor wait on top of the loader's own animation. */
      const D = 0.05

      /* Ambient wash blobs drift slowly and asynchronously (own duration
         per blob, read off data-drift-*) so the glass panel feels alive
         rather than a static gradient sitting behind the content. */
      heroRef.current.querySelectorAll('.hero-wash-blob').forEach((blob) => {
        const dx = Number(blob.dataset.driftX || 50)
        const dy = Number(blob.dataset.driftY || 40)
        const dur = Number(blob.dataset.driftDur || 14)
        gsap.to(blob, {
          x: dx, y: dy, scale: 1.12,
          duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1,
        })
      })

      const heroWords = heroRef.current.querySelectorAll('.hero-word')
      gsap.from(heroWords, {
        yPercent: 105, opacity: 0, filter: 'blur(12px)',
        duration: 0.85, ease: 'power3.out', stagger: 0.14,
        delay: D,
      })
      gsap.from('.hero-tagline', {
        opacity: 0, y: 16, duration: 0.7, ease: 'power3.out',
        delay: D + 0.15,
      })
      gsap.from('.hero-cta', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
        stagger: 0.08, delay: D + 0.35,
      })
      gsap.from('.hero-mock', {
        opacity: 0, y: 32, duration: 0.8, ease: 'power3.out',
        delay: D + 0.5,
      })
      const chips = heroRef.current.querySelectorAll('.hero-chip')

      /* Draggable + inertia - each chip can be grabbed and flicked, and
         keeps drifting on its own momentum after release (InertiaPlugin),
         bouncing gently off the hero's own edges rather than escaping it.
         Stashed on the element itself so the idle-float/parallax tweens
         below can (a) skip a chip while it's being held and (b) keep
         Draggable's internal position tracking in sync with them via
         .update() - otherwise Draggable and these ambient tweens fight
         over the same x/y and the chip snaps on first drag. */
      const draggables = Draggable.create(chips, {
        type: 'x,y',
        bounds: heroRef.current,
        edgeResistance: 0.6,
        inertia: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onPress() {
          gsap.killTweensOf(this.target)
          gsap.to(this.target, { scale: 1.06, duration: 0.15 })
          /* Once picked up, this chip is the user's to place - permanently
             opt it out of the idle float and mouse parallax below (both
             write an *absolute* x/y, so if either kept running here it
             would fight the thrown position and snap the chip back the
             instant the mouse next moved). */
          this.target.dataset.thrown = '1'
        },
        onRelease() {
          if (!this.tween) gsap.to(this.target, { scale: 1, duration: 0.3 })
        },
        onThrowComplete() {
          gsap.to(this.target, { scale: 1, duration: 0.3 })
        },
      })
      draggables.forEach((d) => { d.target._draggable = d })

      gsap.from(chips, {
        /* power3.out, not back.out - back's characteristic overshoot
           briefly renders a chip larger/offset than its resting size,
           which was enough to poke a right/left-flush mobile chip past
           the section's own edge and get clipped by overflow:hidden
           during the ~0.7s entrance window. */
        opacity: 0, scale: 0.85, y: 24, duration: 0.7, ease: 'power3.out',
        stagger: 0.15, delay: D + 0.6,
        onComplete: () => {
          /* Idle float, once entrance settles - each chip gets its own
             amplitude/duration/rotation (read off data-float) so the
             cluster drifts out of sync rather than bobbing as one block.
             Runs on the y axis only; the mousemove parallax below owns x,
             so the two never fight over the same property. */
          chips.forEach((chip) => {
            if (chip.dataset.thrown) return
            const amp = Number(chip.dataset.floatAmp || 9)
            const dur = Number(chip.dataset.floatDur || 2.8)
            const rot = Number(chip.dataset.floatRot || 2)
            gsap.to(chip, {
              y: `+=${amp}`, rotate: rot, duration: dur, ease: 'sine.inOut',
              yoyo: true, repeat: -1,
              onUpdate: () => { if (!chip._draggable.isDragging) chip._draggable.update() },
            })
          })
        },
      })

      /* Mouse parallax - each chip drifts toward the cursor at its own
         depth, so the cluster reads as layered rather than flat. Only
         active where the chips themselves render (xl+, see className). */
      const onHeroMove = (e) => {
        const r = heroRef.current.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        chips.forEach((chip) => {
          if (chip._draggable.isDragging || chip.dataset.thrown) return
          const depth = Number(chip.dataset.floatDepth || 16)
          gsap.to(chip, {
            x: nx * depth, duration: 0.7, ease: 'power2.out', overwrite: 'auto',
            onUpdate: () => { if (!chip._draggable.isDragging) chip._draggable.update() },
          })
        })
      }
      heroRef.current.addEventListener('mousemove', onHeroMove)

      gsap.to('.hero-headline', {
        yPercent: -16, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
      gsap.to('.hero-mock', {
        yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 2 },
      })

      const magCleanup = []
      heroRef.current.querySelectorAll('.hero-cta').forEach((btn) => {
        const onMove = (e) => {
          const r = btn.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28
          const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28
          gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' })
        }
        const onLeaveBtn = () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.45)' })
        btn.addEventListener('mousemove', onMove)
        btn.addEventListener('mouseleave', onLeaveBtn)
        magCleanup.push(() => {
          btn.removeEventListener('mousemove', onMove)
          btn.removeEventListener('mouseleave', onLeaveBtn)
        })
      })

      return () => {
        heroRef.current?.removeEventListener('mousemove', onHeroMove)
        draggables.forEach((d) => d.kill())
        magCleanup.forEach((fn) => fn())
      }
    }, heroRef)

    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Rotating cobalt word - paused under prefers-reduced-motion. */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setWordIndex((i) => (i + 1) % ROTATOR_WORDS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      ref={heroRef}
      className="hero-section font-plex bg-white lg:min-h-[92vh] flex flex-col lg:justify-center px-5 md:px-10 lg:px-20 py-16 lg:py-20"
    >
      {/* Ambient colour wash - same technique as ProofBar's glass cards
          (blurred radial gradients sitting behind relative-positioned
          content). A flat white canvas has nothing for the glass chips
          below to refract against; this gives them something to catch. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px] lg:h-[680px] overflow-hidden" aria-hidden="true">
        <div
          className="hero-wash-blob absolute"
          data-drift-x="70" data-drift-y="40" data-drift-dur="13"
          style={{
            top: '4%', left: '8%',
            width: 'clamp(300px,34vw,560px)', height: 'clamp(300px,34vw,560px)',
            background: 'radial-gradient(circle, rgba(30,97,240,0.14), rgba(30,97,240,0) 70%)',
            filter: 'blur(50px)', willChange: 'transform',
          }}
        />
        <div
          className="hero-wash-blob absolute"
          data-drift-x="-55" data-drift-y="60" data-drift-dur="16"
          style={{
            top: '10%', right: '6%',
            width: 'clamp(280px,30vw,500px)', height: 'clamp(280px,30vw,500px)',
            background: 'radial-gradient(circle, rgba(162,115,255,0.14), rgba(162,115,255,0) 70%)',
            filter: 'blur(45px)', willChange: 'transform',
          }}
        />
        <div
          className="hero-wash-blob absolute"
          data-drift-x="45" data-drift-y="-50" data-drift-dur="11"
          style={{
            bottom: '2%', left: '38%',
            width: 'clamp(260px,28vw,460px)', height: 'clamp(260px,28vw,460px)',
            background: 'radial-gradient(circle, rgba(105,128,255,0.12), rgba(105,128,255,0) 70%)',
            filter: 'blur(45px)', willChange: 'transform',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto w-full text-center">
        <p className="hero-tagline flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-6 will-anim">
          <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
          Ahmedabad, India &middot; built to get found
        </p>

        <h1 className="hero-headline font-bold text-[clamp(2.5rem,5.4vw+1rem,4.5rem)] leading-[1.08] tracking-[-0.02em] text-black will-anim">
          <span className="clip-wrap"><span className="hero-word block">The content studio</span></span>
          <span className="clip-wrap"><span className="hero-word block">built to get you</span></span>
          <span className="clip-wrap">
            {/* The one reserved moment for cobalt - everywhere else on the
                page, emphasis is plain black or one of the secondary
                accent tiles; multiplying cobalt across headings would
                dilute the only chromatic signal on the page. */}
            <span className="hero-word block text-amp-cobalt" aria-live="polite">
              {ROTATOR_WORDS[wordIndex]}
            </span>
          </span>
        </h1>

        <p className="hero-tagline mt-7 text-lg text-amp-body max-w-xl mx-auto leading-relaxed will-anim">
          P2V Labs shoots the video and photography, then makes sure Google and AI answers point straight back at it - production and growth, run by the same two-person studio.
        </p>

        <div className="hero-tagline mt-9 flex flex-wrap items-center justify-center gap-3 will-anim">
          {/* Primary CTA - near-black fill, white text, full pill. Never
              cobalt: the brand voltage stays reserved for the headline. */}
          <button
            onClick={() => router.push('/reel')}
            className="hero-cta inline-flex items-center gap-2 h-14 px-7 rounded-full bg-amp-ink-pill text-white text-base font-semibold hover:bg-black transition-colors will-anim"
          >
            View Our Reel
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="hero-cta inline-flex items-center gap-2 h-14 px-6 rounded-full border border-amp-hairline text-black text-base font-semibold hover:border-black/40 transition-colors will-anim"
          >
            Get In Touch
          </button>
        </div>
      </div>

      {/* Floating proof chips - fill the wide flanking gutters beside the
          headline. Each carries its own float amplitude/duration/rotation
          and parallax depth (data-float-*) so the cluster drifts as
          layered, out-of-sync motion rather than one uniform bob - and
          each is grab-and-throwable (Draggable + inertia, see the effect
          above). They keep the same two-band arrangement on mobile as on
          desktop - a pair flanking the first headline line, a pair
          flanking the second/third - but a full text pill has nowhere to
          go there: at mobile widths the headline itself runs edge to
          edge, so there IS no side gutter, shortened label or not. Below
          xl these shrink to just the icon badge (label hidden entirely)
          and sit flush against the section's own edge instead, so they
          read as small satellite marks beside the text rather than
          something laid on top of it. Mouse parallax naturally does
          nothing on touch, but the float and the drag-and-throw both
          still work on mobile via touch. */}
      <div
        className="hero-chip select-none flex absolute top-[188px] left-2 xl:left-[15%] xl:top-[30%] items-center rounded-full bg-amp-navy xl:bg-white/55 xl:backdrop-blur-md border-0 xl:border xl:border-white/60 shadow-[0_4px_10px_-2px_rgba(0,26,79,0.4)] xl:shadow-[0_10px_30px_-8px_rgba(26,26,26,0.18)]"
        data-float-amp="10" data-float-dur="3.1" data-float-rot="-2.5" data-float-depth="12"
      >
        <span className="flex xl:hidden items-center gap-1 pl-1.5 pr-2 py-1">
          <span className="text-[9px] font-bold text-white">#1</span>
          <span className="text-[7px] font-semibold text-white whitespace-nowrap">Top ranking</span>
        </span>
        <span className="hidden xl:flex items-center gap-2 pl-2 pr-3.5 py-2">
          <span className="w-6 h-6 rounded-full bg-amp-navy/10 text-amp-navy flex items-center justify-center text-[10px] font-bold">#1</span>
          <span className="text-[12px] font-semibold text-black whitespace-nowrap">Ranking for brand search</span>
        </span>
      </div>
      <div
        className="hero-chip select-none flex absolute top-[112px] right-2 xl:right-[6%] xl:top-[13%] xl:left-auto items-center rounded-full bg-amp-ink-pill xl:bg-amp-ink-pill/70 xl:backdrop-blur-md xl:border xl:border-white/10 shadow-[0_4px_10px_-2px_rgba(26,26,26,0.5)] xl:shadow-[0_10px_30px_-8px_rgba(26,26,26,0.35)]"
        data-float-amp="7" data-float-dur="2.4" data-float-rot="2" data-float-depth="22"
      >
        <span className="flex xl:hidden items-center gap-1 pl-1.5 pr-2 py-1">
          <span className="text-[9px] text-amp-periwinkle">&#10022;</span>
          <span className="text-[7px] font-semibold text-white whitespace-nowrap">Cited by AI</span>
        </span>
        <span className="hidden xl:flex items-center gap-2 pl-2 pr-3.5 py-2">
          <span className="w-6 h-6 rounded-full bg-amp-periwinkle/20 text-amp-periwinkle flex items-center justify-center text-[12px]">&#10022;</span>
          <span className="text-[12px] font-semibold text-white whitespace-nowrap">Cited by ChatGPT</span>
        </span>
      </div>
      <div
        className="hero-chip select-none flex absolute top-[50px] left-2 xl:left-[15%] xl:top-[5%] items-center rounded-full bg-amp-violet xl:bg-white/55 xl:backdrop-blur-md border-0 xl:border xl:border-white/60 shadow-[0_4px_10px_-2px_rgba(162,115,255,0.5)] xl:shadow-[0_10px_30px_-8px_rgba(26,26,26,0.18)]"
        data-float-amp="8" data-float-dur="2.9" data-float-rot="2.5" data-float-depth="9"
      >
        <span className="flex xl:hidden items-center gap-1 pl-1.5 pr-2 py-1">
          <span className="text-[9px] text-black">&#9889;</span>
          <span className="text-[7px] font-semibold text-black whitespace-nowrap">GenAI-assisted</span>
        </span>
        <span className="hidden xl:flex items-center gap-2 pl-2 pr-3.5 py-2">
          <span className="w-6 h-6 rounded-full bg-amp-violet/15 text-amp-violet flex items-center justify-center text-[11px]">&#9889;</span>
          <span className="text-[12px] font-semibold text-black whitespace-nowrap">GenAI-assisted, on-brand</span>
        </span>
      </div>
      <div
        className="hero-chip select-none flex absolute top-[188px] right-2 xl:right-[16%] xl:top-[30%] xl:left-auto items-center rounded-full bg-amp-navy xl:bg-white/55 xl:backdrop-blur-md border-0 xl:border xl:border-white/60 shadow-[0_4px_10px_-2px_rgba(0,26,79,0.4)] xl:shadow-[0_10px_30px_-8px_rgba(26,26,26,0.18)]"
        data-float-amp="11" data-float-dur="3.4" data-float-rot="-2" data-float-depth="18"
      >
        <span className="flex xl:hidden items-center gap-1 pl-1.5 pr-2 py-1">
          <span className="text-[9px] font-bold text-white">90%</span>
          <span className="text-[7px] font-semibold text-white whitespace-nowrap">Clients return</span>
        </span>
        <span className="hidden xl:flex items-center gap-2 pl-2 pr-3.5 py-2">
          <span className="w-6 h-6 rounded-full bg-amp-navy/10 text-amp-navy flex items-center justify-center text-[10px] font-bold">90%</span>
          <span className="text-[12px] font-semibold text-black whitespace-nowrap">Clients return for more</span>
        </span>
      </div>

      {/* Capability loop - the hero's proof, looping. Four small "screens"
          (SEO, AEO, GenAI, Automation) auto-scroll instead of one static
          mock, each showing a real mechanism the "get you found" claim
          above rests on. Wider than the text column above on purpose, so
          it reads as its own moment rather than another line of copy. */}
      <div className="hero-mock mt-14 pb-6 will-anim max-w-6xl mx-auto w-full">
        <p className="flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.12em] uppercase text-amp-caption mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-black" />
          What actually runs behind that claim
        </p>
        <CapabilityLoop />
      </div>
    </section>
  )
}
