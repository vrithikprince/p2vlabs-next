'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon from '../ui/Icon.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-heading', {
        y: 65, opacity: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '#contact', start: 'top 82%', once: true },
      })
      gsap.from('.contact-desc', {
        opacity: 0, y: 25, duration: 0.7, ease: 'power3.out', delay: 0.15,
        scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
      })
      gsap.utils.toArray('.contact-btn').forEach((btn, i) => {
        gsap.from(btn, {
          x: 55, opacity: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.12,
          scrollTrigger: { trigger: '#contact', start: 'top 78%', once: true },
        })
      })

      /* Magnetic CTAs */
      const magCleanup = []
      sectionRef.current.querySelectorAll('.contact-btn').forEach((btn) => {
        const onMove = (e) => {
          const r = btn.getBoundingClientRect()
          const dx = (e.clientX - (r.left + r.width  / 2)) * 0.32
          const dy = (e.clientY - (r.top  + r.height / 2)) * 0.32
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
      return () => magCleanup.forEach((fn) => fn())
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative pt-16 lg:pt-24 pb-8 lg:pb-10 px-5 md:px-10 lg:px-20 bg-amp-ink-pill shadow-[0_60px_90px_-20px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <h2 className="contact-heading font-plex text-4xl md:text-6xl font-semibold text-white leading-tight tracking-[-0.01em] mb-6 will-anim">
              Ready to tell your<br />
              {/* Cobalt stays reserved for the hero's rotating word; on this
                  dark surface the brighter periwinkle plays the same
                  "one accent moment" role. */}
              <em className="not-italic text-amp-periwinkle">story?</em>
            </h2>
            <p className="contact-desc text-white/50 text-lg leading-relaxed max-w-xl will-anim">
              We take on select projects each month to ensure every client gets our
              full attention. Let's talk about yours.
            </p>
          </div>
          <div className="lg:col-span-5 space-y-4">
            {/* Primary CTA - white fill, black text, full pill: this
                section's dark-canvas inversion of the near-black-on-white
                CTA used everywhere else on the page. */}
            <a href="mailto:hello@p2vlabs.in"
              className="contact-btn flex items-center justify-between h-14 px-7 rounded-full bg-white text-black hover:bg-white/90 transition-colors group will-anim">
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Email Us</span>
              <Icon n="aur" s={17} c="#000000" />
            </a>
            <a href="https://wa.me/917048824616"
              className="contact-btn flex items-center justify-between h-14 px-6 rounded-full border border-white/18 text-white hover:border-white/40 transition-colors will-anim">
              <span className="text-xs tracking-[0.15em] uppercase font-medium">WhatsApp</span>
              <Icon n="arrow" s={17} />
            </a>
            <p className="text-white/25 text-xs pt-2">
              hello@p2vlabs.in · Ahmedabad, Gujarat, India
            </p>
          </div>
        </div>

        {/* Utility bar - lives at the bottom of this section (not inside
            the fixed Footer reveal panel below) so it stays with the last
            piece of real content and scrolls away with it, rather than
            sitting inside the big wordmark's own space. */}
        <div className="mt-16 lg:mt-20 pt-6 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs tracking-wide">
            © 2026 P2V Labs · Ahmedabad, India
          </p>
          <a
            href="https://founders.p2vlabs.in/founders"
            className="text-[10px] text-white/45 hover:text-amp-periwinkle transition-colors tracking-wider uppercase"
          >
            Founders
          </a>
        </div>
      </div>
    </section>
  )
}
