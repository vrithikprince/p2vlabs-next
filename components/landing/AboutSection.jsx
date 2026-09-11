'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import dynamic from 'next/dynamic'

gsap.registerPlugin(ScrollTrigger)

/* Dynamic, not a static import: this section also renders on the homepage
   with withGlobe off, and a static import would put d3-geo, d3-timer and the
   globe in the homepage bundle for a feature that page never shows. ssr:false
   because the canvas has nothing to render on the server anyway. */
const WireframeDottedGlobe = dynamic(() => import('../ui/WireframeDottedGlobe.jsx'), {
  ssr: false,
})

const FOUNDERS = [
  { name: 'Vrithik',                role: 'Founder',     detail: 'Creative direction, cinematography, and visual strategy. The eye behind every frame.' },
  { name: 'Payal Chetwani',         role: 'Co-Founder',  detail: 'Production operations, client relations, and project management. The backbone of every shoot.' },
]

/**
 * `withGlobe` is opt-in rather than always-on because this section renders on
 * both / and /about. Only /about asked for it; defaulting it true would have
 * put a rotating globe on the homepage as a side effect.
 */
export default function AboutSection({ withGlobe = false }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-heading-line', {
        yPercent: 105, duration: 0.9, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: '#about', start: 'top 78%', once: true },
      })
      gsap.from('.about-para', {
        opacity: 0, y: 22, duration: 0.7, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '#about', start: 'top 72%', once: true },
      })
      gsap.utils.toArray('.founder-row').forEach((row, i) => {
        gsap.from(row, {
          x: 45, opacity: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: '.founders-list', start: 'top 82%', once: true },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="bg-white py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-5 about-sticky-col">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              The Studio
            </p>
            <h2 className="font-plex text-4xl md:text-5xl font-semibold text-black leading-tight tracking-[-0.01em] mb-8">
              <span className="clip-wrap"><span className="about-heading-line block">Where Data</span></span>
              <span className="clip-wrap"><span className="about-heading-line block">Meets Visual</span></span>
              <span className="clip-wrap"><em className="about-heading-line not-italic text-black block">Craft.</em></span>
            </h2>
            <p className="about-para text-amp-body leading-relaxed mb-5 text-[15px] will-anim">
              P2V Labs was founded on a simple belief: great visual content isn't just beautiful -
              it's built on insight. We combine analytical thinking with cinematic execution to
              create work that performs as well as it looks.
            </p>
            <p className="about-para text-amp-body leading-relaxed mb-5 text-[15px] will-anim">
              Based in Ahmedabad, we work with brands across India - from heritage businesses to
              emerging startups - helping them tell stories that stick.
            </p>
            <p className="about-para text-amp-body leading-relaxed text-[15px] will-anim">
              Led by <span className="text-black">Vrithik Prince</span>, who previously
              co-founded a Surat creative agency working with 50+ F&amp;B, retail, and lifestyle
              brands. That run drove 120% average engagement growth, shipped 1,500+ visuals and
              300+ brand videos, and built a workflow 30% faster than industry peers. P2V Labs is
              the next chapter - same craft, sharper focus.
            </p>
          </div>

          <div className="lg:col-span-7 relative">
            {/* Backdrop for this column. Bottom-anchored rather than centred
                so the dense founder copy sits mostly above it and keeps its
                contrast; the grid stretches this column to the (taller) left
                column's height, which is the empty space the globe fills.
                The wrapper is pointer-events-none and only the canvas takes
                events back, so the globe is draggable in the open area while
                the text above it stays selectable. */}
            {withGlobe && (
              <div
                className="pointer-events-none absolute inset-y-0 left-0 hidden lg:block overflow-hidden"
                aria-hidden="true"
                style={{
                  /* Break out of max-w-7xl so the sphere reaches the actual
                     screen edge. Cut flush with the column it left a white
                     gutter beside it, which read as an accidental crop rather
                     than a bleed.

                     The gutter between this column's right edge and the
                     viewport is (100vw - 1280px) / 2 once the container has
                     hit its 80rem cap, and the section's own 80px padding
                     below that. A negative right offset of exactly that
                     distance puts this wrapper's right edge on the viewport
                     edge, and its overflow-hidden then does the cutting
                     there instead. html/body carry overflow-x: clip, so the
                     few px that 100vw counts for the scrollbar cannot open a
                     horizontal scroll. */
                  right: 'calc(-1 * max(80px, (100vw - 1280px) / 2))',
                  /* A short fade keeps the eyebrow and the first role tag off
                     the dots. */
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 15%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 15%)',
                }}
              >
                {/* right-0 aligns the sphere's right edge to this wrapper's
                    edge — now the screen edge — and translate-x-1/2 pushes it
                    out by half its own width, so its centre lands exactly on
                    that edge and precisely half the sphere shows.
                    Clipping on this wrapper and not on the column matters:
                    the founder rows animate in from x:45, and clipping the
                    column would chop them mid-entrance. */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2">
                  <WireframeDottedGlobe
                    tone="light"
                    spin={0.1}
                    /* Scales with the viewport so the visible hemisphere keeps
                       filling the right side rather than shrinking into a
                       corner on a wide screen. */
                    className="pointer-events-auto w-[clamp(460px,38vw,780px)] aspect-square opacity-[0.45]"
                  />
                </div>
              </div>
            )}

            <p className="relative flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              Founded By
            </p>
            <div className="founders-list relative">
              {FOUNDERS.map((f, i) => (
                <div key={f.name} className="founder-row py-7 border-b border-amp-hairline first:border-t will-anim">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2 md:col-span-1 pt-1">
                      <span className="font-plex text-lg font-semibold text-amp-caption/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                        <h3 className="font-plex text-xl font-semibold text-black">{f.name}</h3>
                        <span className="text-[10px] tracking-[0.15em] uppercase text-amp-caption">{f.role}</span>
                      </div>
                      <p className="text-sm text-amp-body leading-relaxed">{f.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
