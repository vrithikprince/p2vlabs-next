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
                className="pointer-events-none absolute inset-0 hidden lg:flex items-end justify-center"
                aria-hidden="true"
                style={{
                  /* Fades the globe's top so the founder rows - and in
                     particular the 10px role tags - sit on clean white
                     rather than on dots. Bottom-anchored at 340px it mostly
                     clears them already; the fade covers the case where a
                     shorter left column pulls this row's height in. */
                  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 26%)',
                  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 26%)',
                }}
              >
                <WireframeDottedGlobe
                  tone="light"
                  spin={0.1}
                  className="pointer-events-auto w-[340px] aspect-square opacity-[0.5]"
                />
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
