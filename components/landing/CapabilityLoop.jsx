'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Capability loop - the hero's proof, as four small "screens" auto-scrolling
 * in an infinite marquee (same duplicate-array + gsap.set(x) technique as
 * Marquee.jsx's text ticker, just applied to cards instead of words - the
 * track is doubled and wraps at scrollWidth/2 so the loop has no seam).
 *
 * Each card is a real mechanism, not a decorative screenshot: SEO shows the
 * actual ranking result, AEO shows the actual AI citation, GenAI shows a
 * live-looking generation state, Automation shows the actual pipeline
 * steps. Pauses on hover/focus so it can be read rather than only seen.
 */
const CARDS = [
  { id: 'seo', kind: 'seo' },
  { id: 'aeo', kind: 'aeo' },
  { id: 'genai', kind: 'genai' },
  { id: 'automation', kind: 'automation' },
]

function CardChrome({ label, children }) {
  return (
    <div className="w-[320px] md:w-[340px] flex-shrink-0 rounded-[16px] border border-amp-hairline bg-white shadow-[0_16px_40px_-16px_rgba(26,26,26,0.18)] overflow-hidden">
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-amp-hairline bg-amp-surface">
        <span className="w-1.5 h-1.5 rounded-full bg-amp-hairline-strong/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-amp-hairline-strong/60" />
        <span className="w-1.5 h-1.5 rounded-full bg-amp-hairline-strong/60" />
        <span className="ml-2 text-[10.5px] font-mono text-amp-caption truncate">{label}</span>
      </div>
      <div className="p-4 h-[168px] flex flex-col">{children}</div>
    </div>
  )
}

function SeoCard() {
  return (
    <CardChrome label="google.com/search?q=p2v+labs">
      <span className="inline-flex items-center gap-1 bg-amp-navy text-white text-[10px] font-bold tracking-wide rounded-full px-2 py-0.5 mb-2.5 w-fit">
        &#9312; TOP RESULT
      </span>
      <p className="text-[15px] font-semibold text-amp-navy leading-tight mb-0.5">
        P2V Labs - Content &amp; Growth Studio
      </p>
      <p className="text-[11px] text-[#1a7a3c] font-mono mb-2">p2vlabs.in</p>
      <p className="text-[12px] text-amp-body leading-snug">
        Video, photography, and social content for brands in Ahmedabad - plus the SEO work that gets it found.
      </p>
      {/* The "#1 for brand search" boast that used to sit here is gone.
          Ranking first for your own brand name is the default state of any
          indexed site on a matching domain - presenting it as an SEO result
          reads as naive to exactly the buyer we now want. */}
      <div className="mt-auto flex items-center gap-1.5 pt-2">
        <span className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption">Structured for</span>
        <span className="text-[10px] font-semibold tracking-wide uppercase text-amp-navy">rich results</span>
      </div>
    </CardChrome>
  )
}

function AeoCard() {
  return (
    <CardChrome label="AI Overview">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase text-amp-periwinkle mb-2">
        &#10022; AI answer
      </p>
      {/* This card used to render a fabricated Google AI Overview asserting
          that P2V Labs "is frequently recommended", with a cited: p2vlabs.in
          chip - a designed graphic, not a screenshot, and not supportable.
          It was decoration for a video studio; for anyone selling search
          visibility it is the one claim the buyer personally re-runs.
          It now shows the MECHANISM - what a cited answer is made of -
          without asserting an outcome we have not measured. */}
      <p className="text-[11px] text-amp-caption mb-1.5">&quot;Who should I hire for a brand film?&quot;</p>
      <p className="text-[12.5px] text-amp-body leading-snug flex-1">
        An answer engine names a handful of businesses and links its sources. Getting into that shortlist is a different job from ranking - it needs a clean entity record, quotable answers, and third-party corroboration.
      </p>
      <span className="inline-flex mt-auto text-[10px] font-mono bg-amp-surface border border-amp-hairline rounded-full px-2 py-1 text-amp-caption w-fit">
        that job is what we do
      </span>
    </CardChrome>
  )
}

function GenAiCard() {
  return (
    <CardChrome label="studio.p2vlabs.in/generate">
      <div className="flex items-center gap-2 border border-amp-hairline rounded-full px-3 py-1.5 mb-3">
        <span className="text-[11px] text-amp-caption truncate flex-1">Write this week&apos;s Instagram caption&hellip;</span>
        <span className="w-[6px] h-[13px] bg-amp-violet/70 loop-caret" />
      </div>
      <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-2">Generating</p>
      <div className="space-y-1.5 flex-1">
        <span className="block h-2 rounded-full bg-black/8 w-full loop-shimmer" />
        <span className="block h-2 rounded-full bg-black/8 w-[85%] loop-shimmer" style={{ animationDelay: '.15s' }} />
        <span className="block h-2 rounded-full bg-black/8 w-[60%] loop-shimmer" style={{ animationDelay: '.3s' }} />
      </div>
      <p className="text-[10px] text-amp-caption mt-2">On-brand, scheduled, no copy-paste.</p>
    </CardChrome>
  )
}

function AutomationCard() {
  const steps = [
    { label: 'Trigger', icon: '⚡' },
    { label: 'Generate', icon: '✦', active: true },
    { label: 'Review', icon: '◉' },
    { label: 'Publish', icon: '✓' },
  ]
  return (
    <CardChrome label="automations · content pipeline">
      <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-4">Content pipeline</p>
      <div className="flex items-center flex-1">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-[12px] ${
                  s.active
                    ? 'border-amp-violet bg-amp-violet/10 text-amp-violet loop-pulse'
                    : 'border-amp-hairline text-amp-caption'
                }`}
              >
                {s.icon}
              </span>
              <span className="text-[9px] uppercase tracking-wide text-amp-caption whitespace-nowrap">{s.label}</span>
            </div>
            {i < steps.length - 1 && <span className="flex-1 h-px bg-amp-hairline mx-1 mb-4" />}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-amp-caption mt-2">Runs automatically every Monday.</p>
    </CardChrome>
  )
}

const RENDER = { seo: SeoCard, aeo: AeoCard, genai: GenAiCard, automation: AutomationCard }

export default function CapabilityLoop() {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let xPos = 0
    const tick = () => {
      if (pausedRef.current) return
      xPos -= 0.15
      const halfW = track.scrollWidth / 2
      if (-xPos >= halfW) xPos += halfW
      gsap.set(track, { x: xPos })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  const all = [...CARDS, ...CARDS]

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      onFocus={() => (pausedRef.current = true)}
      onBlur={() => (pausedRef.current = false)}
    >
      <div ref={trackRef} className="flex gap-5 will-change-transform" style={{ width: 'max-content' }}>
        {all.map((c, i) => {
          const Card = RENDER[c.kind]
          return <Card key={`${c.id}-${i}`} />
        })}
      </div>
      {/* Solid white-to-transparent vignettes, not a mask-image fade on the
         cards themselves. A mask makes the card's own pixels partially
         transparent - fine over a photo, but over TEXT it just reads as
         "part of the word is missing" rather than a smooth dissolve,
         since letterforms don't have the continuous tone a fade needs.
         These overlays instead paint the page's own background colour
         over the edge with increasing opacity, so a card looks like it's
         genuinely disappearing behind the edge of the page - and by the
         time a card reaches this container's true (hard) clip boundary,
         it's already fully covered by opaque white, so that clip is
         never what you actually see. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[110px] lg:w-[150px] bg-gradient-to-r from-white to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[110px] lg:w-[150px] bg-gradient-to-l from-white to-transparent" aria-hidden="true" />
    </div>
  )
}
