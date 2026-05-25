'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Positioning — the buyer's-language block that earns the next scroll.
 *
 * Lives between the ProofBar and Services. The numbers above answer "is
 * this real?"; this section answers "do they understand what I'm dealing
 * with?". Two-column layout matches AboutSection so the page rhythm holds.
 *
 * Word-clip + blur entrance reuses the same vocabulary as the Hero
 * headline so it reads as a deliberate echo rather than a new motion idea.
 */
export default function Positioning() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.positioning-eyebrow', {
        opacity: 0, y: 14, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '#positioning', start: 'top 82%', once: true },
      })
      gsap.from('.positioning-headline-line', {
        yPercent: 105, opacity: 0, filter: 'blur(10px)',
        duration: 0.95, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: '#positioning', start: 'top 78%', once: true },
      })
      gsap.from('.positioning-body', {
        opacity: 0, y: 24, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '#positioning', start: 'top 72%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="positioning" className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <p className="positioning-eyebrow text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-6 will-anim">
              The brief
            </p>
            <h2
              className="font-display font-bold text-charcoal leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.25rem,5.5vw,4.25rem)' }}
            >
              <span className="clip-wrap"><span className="positioning-headline-line block">Most brand content</span></span>
              <span className="clip-wrap"><span className="positioning-headline-line block">blends in.</span></span>
              <span className="clip-wrap"><em className="positioning-headline-line not-italic text-p2v block">Yours shouldn't.</em></span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="positioning-body text-charcoal/60 leading-relaxed text-[15px] md:text-base max-w-xl will-anim">
              Restaurants and brands come to us because their photos disappear on
              Zomato, their reels stall under a thousand views, and their feed
              isn't doing the selling. We shoot, direct, and edit to a standard
              that performs — and clients keep coming back because the numbers
              show up after we ship.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
