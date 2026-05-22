'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { REEL_ITEMS, categoryBg } from '../../data/reelItems.js'
import Icon from '../ui/Icon.jsx'

gsap.registerPlugin(ScrollTrigger)

/** First 3 reel items, rendered as the home page's "Selected Work" preview. */
export default function ReelPreview() {
  const router = useRouter()
  const sectionRef = useRef(null)
  const items = REEL_ITEMS.slice(0, 3)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reel-preview-header', {
        opacity: 0, y: 30, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.reel-preview-section', start: 'top 82%', once: true },
      })
      const offsets = [{ y: 70, x: -25 }, { y: 95, x: 0 }, { y: 70, x: 25 }]
      gsap.utils.toArray('.reel-preview-card').forEach((card, i) => {
        gsap.from(card, {
          y: offsets[i].y, x: offsets[i].x, opacity: 0,
          duration: 1, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: '.reel-preview-section', start: 'top 78%', once: true },
        })
      })

      /* 3D tilt on preview cards */
      const tiltCleanup = []
      sectionRef.current.querySelectorAll('.reel-preview-card').forEach((card) => {
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
    <section ref={sectionRef} className="reel-preview-section py-24 px-5 md:px-10 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="reel-preview-header flex items-end justify-between mb-12 will-anim">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-bone/45 mb-4">Selected Work</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-bone">The Reel</h2>
          </div>
          <button onClick={() => router.push('/reel')}
            className="hidden md:flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-bone/50 hover:text-amber transition-colors">
            <span>View All</span>
            <Icon n="aur" s={15} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div key={item.id}
                 className="reel-preview-card group cursor-pointer will-anim"
                 onClick={() => router.push('/reel')}>
              <div
                className={`relative overflow-hidden border border-bone/8 group-hover:border-amber/25 transition-all ${
                  i === 1 ? 'h-52' : 'h-72'
                }`}
                style={{ backgroundColor: categoryBg[item.category] || '#E8E4DF' }}
              >
                {(item.thumbnailUrl || item.imageUrl) && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:    `url(${item.thumbnailUrl || item.imageUrl})`,
                      backgroundSize:     'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                <div className="absolute inset-[10px] border border-bone/8 group-hover:border-amber/15 transition-colors" />
                {!(item.thumbnailUrl || item.imageUrl) && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-10 h-10 border border-bone/15 flex items-center justify-center mx-auto mb-3 group-hover:border-amber/30 transition-colors">
                        <Icon n={item.category === 'photo' ? 'camera' : 'film'} s={18} c="#1a1a1a" className="opacity-25" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-ink/95 px-3 py-2.5">
                    <p className="font-display text-sm font-semibold text-bone">{item.title}</p>
                    <p className="text-[11px] text-bone/55 mt-0.5">{item.client}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-[9px] tracking-[0.15em] uppercase bg-ink/70 text-bone/60 px-2 py-1">
                    {item.date}
                  </span>
                </div>
              </div>
              <div className="pt-3">
                <div className="flex items-baseline justify-between">
                  <p className="font-display font-semibold text-bone text-base">{item.title}</p>
                </div>
                <p className="text-xs text-bone/45 mt-0.5">{item.client}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <button onClick={() => router.push('/reel')}
            className="w-full py-3 border border-bone/18 text-xs tracking-[0.15em] uppercase text-bone/60 hover:border-amber hover:text-amber transition-colors">
            View All Work
          </button>
        </div>
      </div>
    </section>
  )
}
