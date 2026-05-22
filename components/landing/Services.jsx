'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon from '../ui/Icon.jsx'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  { n: '01', title: 'Video Production', icon: 'film',
    desc: 'Brand films, product launches, founder narratives, and corporate documentaries. Cinematic quality, story-first approach.',
    accent: '#E8E4DF' },
  { n: '02', title: 'Photography', icon: 'camera',
    desc: 'Product photography, editorial portraits, food and beverage, event coverage. Every image built for the brand.',
    accent: '#DFE8E3' },
  { n: '03', title: 'Social Content', icon: 'play',
    desc: 'Instagram Reels, YouTube Shorts, LinkedIn videos. Platform-native content that converts scroll to engagement.',
    accent: '#EDE8E1' },
  { n: '04', title: 'Brand Visuals', icon: 'grid',
    desc: 'Full visual identity systems, pitch deck design, presentation templates, and brand guidelines.',
    accent: '#E4E0DC' },
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
    <section ref={sectionRef} id="services" className="py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          <div className="lg:col-span-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bone/45 mb-5">What We Do</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-bone leading-tight">
              <span className="clip-wrap"><span className="services-heading-line block">Our</span></span>
              <span className="clip-wrap"><span className="services-heading-line block">Services</span></span>
            </h2>
          </div>
          <div className="lg:col-span-8 flex items-end">
            <p className="services-desc text-lg text-bone/55 max-w-2xl leading-relaxed will-anim">
              From concept to delivery, we handle every frame. Our work spans brand films,
              photography, and social content — each piece crafted to perform and endure.
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
                marginBottom: i < 3 ? '2rem' : 0,
                transformOrigin: 'top center',
              }}
            >
              <div
                className="sticky-card service-card group"
                style={{
                  background: '#FDFCFA',
                  border: '1px solid rgba(26,26,26,0.08)',
                  boxShadow: `0 ${6 + i * 4}px ${20 + i * 10}px rgba(26,26,26,${0.05 + i * 0.018})`,
                }}
              >
                <div className="flex flex-col md:flex-row" style={{ minHeight: 'clamp(240px,32vh,340px)' }}>

                  <div
                    className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-52 lg:w-60 py-8 md:py-0 border-b md:border-b-0 md:border-r border-bone/8"
                    style={{ background: s.accent }}
                  >
                    <Icon n={s.icon} s={34} c="rgba(26,26,26,0.45)" />
                    <div className="w-6 h-px bg-ink/20 my-3" />
                    <span className="text-[9px] tracking-[0.45em] uppercase text-bone/35 font-medium">{s.n}</span>
                  </div>

                  <div className="relative flex-1 overflow-hidden flex flex-col justify-center px-8 py-10 md:px-12 lg:px-16">
                    <span
                      className="absolute right-2 bottom-0 font-display font-bold leading-none select-none pointer-events-none text-bone/[0.038]"
                      style={{ fontSize: 'clamp(5rem,11vw,10rem)', lineHeight: 0.82 }}
                      aria-hidden="true"
                    >
                      {s.n}
                    </span>
                    <p className="text-[9px] tracking-[0.4em] uppercase text-bone/30 mb-4 relative z-10">
                      Service — {s.n}
                    </p>
                    <h3 className="font-display font-bold text-bone leading-tight mb-4 relative z-10"
                        style={{ fontSize: 'clamp(1.7rem,3.2vw,2.8rem)' }}>
                      {s.title}
                    </h3>
                    <p className="text-bone/50 leading-relaxed relative z-10 max-w-lg"
                       style={{ fontSize: 'clamp(0.875rem,1.4vw,0.975rem)' }}>
                      {s.desc}
                    </p>
                    <div className="flex items-center gap-3 mt-6 relative z-10">
                      <div className="w-8 h-px bg-amber" />
                      <span className="text-[9px] tracking-[0.3em] uppercase font-medium text-amber">Get in Touch</span>
                      <Icon n="aur" s={13} c="#c0392b" />
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
