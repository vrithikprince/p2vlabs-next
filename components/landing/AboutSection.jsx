'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FOUNDERS = [
  { name: 'Vrithik',                role: 'Founder',     detail: 'Creative direction, cinematography, and visual strategy. The eye behind every frame.' },
  { name: 'Payal Chetwani',         role: 'Co-Founder',  detail: 'Production operations, client relations, and project management. The backbone of every shoot.' },
  { name: 'Palash Karamchandani',   role: 'Co-Founder',  detail: 'Post-production, motion graphics, and digital content. The craft in the edit room.' },
]

export default function AboutSection() {
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
    <section ref={sectionRef} id="about" className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-5 about-sticky-col">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-5">The Studio</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-8">
              <span className="clip-wrap"><span className="about-heading-line block">Where Data</span></span>
              <span className="clip-wrap"><span className="about-heading-line block">Meets Visual</span></span>
              <span className="clip-wrap"><em className="about-heading-line not-italic text-p2v block">Craft.</em></span>
            </h2>
            <p className="about-para text-charcoal/55 leading-relaxed mb-5 text-[15px] will-anim">
              P2V Labs was founded on a simple belief: great visual content isn't just beautiful —
              it's built on insight. We combine analytical thinking with cinematic execution to
              create work that performs as well as it looks.
            </p>
            <p className="about-para text-charcoal/55 leading-relaxed mb-5 text-[15px] will-anim">
              Based in Ahmedabad, we work with brands across India — from heritage businesses to
              emerging startups — helping them tell stories that stick.
            </p>
            <p className="about-para text-charcoal/55 leading-relaxed text-[15px] will-anim">
              Led by <span className="text-charcoal">Vrithik Prince</span>, who previously
              co-founded a Surat creative agency working with 50+ F&amp;B, retail, and lifestyle
              brands. That run drove 120% average engagement growth, shipped 1,500+ visuals and
              300+ brand videos, and built a workflow 30% faster than industry peers. P2V Labs is
              the next chapter — same craft, sharper focus.
            </p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-8">Founded By</p>
            <div className="founders-list">
              {FOUNDERS.map((f, i) => (
                <div key={f.name} className="founder-row py-7 border-b border-charcoal/10 first:border-t will-anim">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2 md:col-span-1 pt-1">
                      <span className="font-display text-lg font-bold text-p2v/25">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <div className="flex flex-wrap items-baseline gap-2 mb-1.5">
                        <h3 className="font-display text-xl font-bold text-charcoal">{f.name}</h3>
                        <span className="text-[10px] tracking-[0.15em] uppercase text-charcoal/40">{f.role}</span>
                      </div>
                      <p className="text-sm text-charcoal/55 leading-relaxed">{f.detail}</p>
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
