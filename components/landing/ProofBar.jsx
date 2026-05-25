'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ProofBar — quiet horizontal strip of four impact figures.
 *
 * Sits just after the marquee. Editorial restraint, not a hero-style flex:
 * eyebrow at left, four stats in serif on a single row at desktop, two-up
 * on mobile. Hairlines between stats only on desktop (avoids the "scoreboard"
 * look at narrower widths).
 *
 * Numbers are the founder-verified P2V Labs figures, not the prior-agency
 * track record (that lives in AboutSection).
 */
const STATS = [
  { figure: '5M+',   label: 'Views generated for restaurant clients' },
  { figure: '7–10%', label: 'Average engagement rate on social' },
  { figure: '150+',  label: 'Restaurants & cafés photographed across Surat' },
  { figure: '90%+',  label: 'Clients return for more' },
]

export default function ProofBar() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.proof-eyebrow', {
        opacity: 0, y: 14, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '#proof-bar', start: 'top 82%', once: true },
      })
      gsap.from('.proof-stat', {
        opacity: 0, y: 28, duration: 0.7, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '#proof-bar', start: 'top 80%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="proof-bar"
      className="relative overflow-hidden py-14 lg:py-20 px-5 md:px-10 lg:px-20"
    >
      {/* Backdrop washes — invisible-ish color clouds so the glass cards
          have something to refract. Without these, backdrop-filter on a
          flat cream section produces no visible effect. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: '8%', left: '12%',
            width: 'clamp(280px,32vw,520px)', height: 'clamp(280px,32vw,520px)',
            background: 'radial-gradient(circle, rgba(192,57,43,0.22), rgba(192,57,43,0) 70%)',
            filter: 'blur(40px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '6%', right: '8%',
            width: 'clamp(320px,36vw,580px)', height: 'clamp(320px,36vw,580px)',
            background: 'radial-gradient(circle, rgba(26,26,26,0.14), rgba(26,26,26,0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute"
          style={{
            top: '40%', left: '48%',
            width: 'clamp(220px,24vw,380px)', height: 'clamp(220px,24vw,380px)',
            background: 'radial-gradient(circle, rgba(192,57,43,0.12), rgba(192,57,43,0) 70%)',
            filter: 'blur(45px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <p className="proof-eyebrow text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-10 will-anim">
          What the work has delivered
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {STATS.map((s) => (
            <div key={s.figure} className="proof-stat will-anim">
              <div
                className="proof-card h-full p-7 lg:p-8 transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: 'rgba(245, 240, 232, 0.45)',
                  backdropFilter: 'blur(22px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
                  border: '1px solid rgba(255, 255, 255, 0.55)',
                  boxShadow:
                    'inset 0 1px 0 rgba(255,255,255,0.65), 0 10px 32px rgba(26,26,26,0.07)',
                }}
              >
                <p
                  className="font-display font-bold text-charcoal leading-none mb-5"
                  style={{ fontSize: 'clamp(2.4rem,5vw,3.6rem)' }}
                >
                  {s.figure}
                </p>
                <div className="w-8 h-px bg-p2v mb-5" />
                <p className="text-[11px] tracking-[0.18em] uppercase text-charcoal/55 leading-relaxed">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
