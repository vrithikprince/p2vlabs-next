'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon from '../ui/Icon.jsx'
import { SERVICE_MARKS } from '../illustrations/ServiceMarks.jsx'

gsap.registerPlugin(ScrollTrigger)

/* Each card cycles through the secondary-accent trio (navy/violet/
   periwinkle) - Tailwind classes are literal strings here (not built from
   `accentHex`) so the JIT scanner actually generates them. `accentHex` is
   the same colour again, passed to the SVG mark which needs a real value
   rather than a class. `mark` keys into SERVICE_MARKS. */
const SERVICES = [
  { n: '01', title: 'Video Production', mark: 'video',
    desc: 'Brand films, product launches, founder narratives, and corporate documentaries. Cinematic quality, story-first approach.',
    railBg: 'bg-amp-navy/10', linkBg: 'bg-amp-navy', linkText: 'text-amp-navy', accentHex: '#001a4f' },
  { n: '02', title: 'Photography', mark: 'photography',
    desc: 'Product photography, editorial portraits, food and beverage, event coverage. Every image built for the brand.',
    railBg: 'bg-amp-violet/15', linkBg: 'bg-amp-violet', linkText: 'text-amp-violet', accentHex: '#a273ff' },
  { n: '03', title: 'Social Content', mark: 'social',
    desc: 'Instagram Reels, YouTube Shorts, LinkedIn videos. Platform-native content that converts scroll to engagement.',
    railBg: 'bg-amp-periwinkle/15', linkBg: 'bg-amp-periwinkle', linkText: 'text-amp-periwinkle', accentHex: '#6980ff' },
  { n: '04', title: 'Brand Visuals', mark: 'brand',
    desc: 'Full visual identity systems, pitch deck design, presentation templates, and brand guidelines.',
    railBg: 'bg-amp-navy/10', linkBg: 'bg-amp-navy', linkText: 'text-amp-navy', accentHex: '#001a4f' },
  { n: '05', title: 'GenAI Development', mark: 'genai',
    desc: 'Custom GenAI workflows and automations for your business - content pipelines, lead-response bots, and internal tools that take the repetitive work off your team.',
    railBg: 'bg-amp-violet/15', linkBg: 'bg-amp-violet', linkText: 'text-amp-violet', accentHex: '#a273ff' },
]

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Heading reveal */
      gsap.from('.services-heading-line', {
        yPercent: 105, duration: 0.9, ease: 'power4.out', stagger: 0.1,
        scrollTrigger: { trigger: '#services', start: 'top 80%', once: true },
      })
      gsap.from('.services-desc', {
        opacity: 0, y: 28, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '#services', start: 'top 78%', once: true },
      })

      /* Sticky-stack bounce + scale-down chain */
      const stackOuters = gsap.utils.toArray('.sticky-card-outer')
      stackOuters.forEach((outer, i) => {
        const card = outer.querySelector('.sticky-card')
        gsap.from(card, {
          y: 90, scale: 0.91, opacity: 0, duration: 1.1, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: outer, start: 'top 90%', once: true },
        })
        if (i < stackOuters.length - 1) {
          gsap.to(outer, {
            scale: 0.96, transformOrigin: 'top center',
            scrollTrigger: {
              trigger: stackOuters[i + 1], start: 'top 82%', end: 'top 48%', scrub: 1.2,
            },
          })
        }
      })

      /* 3D tilt on service cards */
      const tiltCleanup = []
      sectionRef.current.querySelectorAll('.service-card').forEach((card) => {
        const onMove = (e) => {
          const r = card.getBoundingClientRect()
          const x = ((e.clientX - r.left) / r.width  - 0.5) * 14
          const y = ((e.clientY - r.top)  / r.height - 0.5) * 14
          gsap.to(card, { rotateY: x, rotateX: -y, transformPerspective: 900, duration: 0.3, ease: 'power2.out' })
        }
        const onLeave = () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' })
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        tiltCleanup.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })

      return () => tiltCleanup.forEach((fn) => fn())
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="bg-white py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              What We Do
            </p>
            <h2 className="font-plex text-4xl md:text-5xl font-semibold text-black leading-tight tracking-[-0.01em]">
              <span className="clip-wrap"><span className="services-heading-line block">Our</span></span>
              <span className="clip-wrap"><span className="services-heading-line block">Services</span></span>
            </h2>
          </div>
          <div className="lg:col-span-8 flex items-end">
            <p className="services-desc text-lg text-amp-body max-w-2xl leading-relaxed will-anim">
              From concept to delivery, we handle every frame. Our work spans brand films,
              photography, and social content - each piece crafted to perform and endure.
            </p>
          </div>
        </div>

        {/* Sticky-stacking cards */}
        <div className="sticky-cards-section relative" style={{ paddingBottom: '5rem' }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.n}
              className="sticky-card-outer"
              style={{
                position: 'sticky',
                top: `${80 + i * 20}px`,
                zIndex: 10 + i,
                /* every card but the last needs the gap - was hard-coded to
                   `i < 3` back when there were exactly four */
                marginBottom: i < SERVICES.length - 1 ? '2rem' : 0,
                transformOrigin: 'top center',
              }}
            >
              <div
                className="sticky-card service-card group rounded-[18px] overflow-hidden border border-amp-hairline bg-white"
                style={{
                  boxShadow: `0 ${6 + i * 4}px ${20 + i * 10}px rgba(26,26,26,${0.05 + i * 0.018})`,
                }}
              >
                <div className="flex flex-col md:flex-row" style={{ minHeight: 'clamp(240px,32vh,340px)' }}>

                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-full md:w-52 lg:w-60 py-8 md:py-0 border-b md:border-b-0 md:border-r border-amp-hairline ${s.railBg}`}>
                    {(() => {
                      const Mark = SERVICE_MARKS[s.mark]
                      return Mark ? <Mark accent={s.accentHex} className="w-24 lg:w-28 h-auto" /> : null
                    })()}
                    <div className="w-6 h-px bg-black/15 my-3" />
                    <span className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption">{s.n}</span>
                  </div>

                  <div className="relative flex-1 overflow-hidden flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16">
                    <span
                      className="absolute right-2 bottom-0 font-plex font-semibold leading-none select-none pointer-events-none text-black/[0.04]"
                      style={{ fontSize: 'clamp(5rem,11vw,10rem)', lineHeight: 0.82 }}
                      aria-hidden="true"
                    >
                      {s.n}
                    </span>
                    <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-4 relative z-10">
                      Service - {s.n}
                    </p>
                    <h3 className="font-plex font-semibold text-black leading-tight mb-4 relative z-10 tracking-[-0.01em]"
                        style={{ fontSize: 'clamp(1.7rem,3.2vw,2.8rem)' }}>
                      {s.title}
                    </h3>
                    <p className="text-amp-body leading-relaxed relative z-10 max-w-lg"
                       style={{ fontSize: 'clamp(0.875rem,1.4vw,0.975rem)' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-3 mt-6 relative z-10">
                      <div className={`w-8 h-px ${s.linkBg}`} />
                      <span className={`text-[10px] font-semibold tracking-wide uppercase ${s.linkText}`}>Get in Touch</span>
                      <Icon n="aur" s={13} c={s.accentHex} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
