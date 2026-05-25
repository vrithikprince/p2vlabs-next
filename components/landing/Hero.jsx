'use client'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Icon from '../ui/Icon.jsx'
import { useLoader } from '../layout/LoaderContext.jsx'

gsap.registerPlugin(ScrollTrigger)

/**
 * Hero — clean editorial layout. Word-clip entrance with blur ramp + scroll
 * parallax + magnetic CTAs. Entrance delay is loader-aware: 4.10s on hard
 * page load (so the liquid loader can complete), ~0s on soft navigation.
 */
export default function Hero() {
  const router = useRouter()
  const heroRef = useRef(null)
  const { loaderActive } = useLoader()

  const scrollTo = (id) => {
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const D = loaderActive ? 4.10 : 0.05

      /* Word-clip + blur entrance */
      const heroWords = heroRef.current.querySelectorAll('.hero-word')
      gsap.from(heroWords, {
        yPercent: 105, opacity: 0, filter: 'blur(12px)',
        duration: 0.85, ease: 'power3.out', stagger: 0.14,
        delay: D,
      })
      gsap.from('.hero-tagline', {
        opacity: 0, x: 30, duration: 0.9, ease: 'power3.out',
        delay: D + 0.2,
      })
      gsap.from('.hero-cta', {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out',
        stagger: 0.1, delay: D + 0.3,
      })
      gsap.from('.scroll-indicator', {
        opacity: 0, y: 14, duration: 0.6, ease: 'power3.out',
        delay: D + 0.5,
      })

      /* Scroll-scrub depth parallax */
      gsap.to('.hero-headline', {
        yPercent: -22, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
      gsap.to('.hero-tagline', {
        yPercent: -12, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 2 },
      })
      gsap.to('.scroll-indicator', {
        opacity: 0, y: 18, ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: '18% top', scrub: 1 },
      })

      /* Magnetic effect on primary CTAs */
      const magCleanup = []
      heroRef.current.querySelectorAll('.hero-cta').forEach((btn) => {
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
    }, heroRef)

    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section ref={heroRef} className="hero-section lg:min-h-[92vh] flex flex-col lg:justify-center px-5 md:px-10 lg:px-20 py-10 lg:py-20">
      <div className="max-w-7xl mx-auto w-full">
        <p className="hero-tagline text-[10px] tracking-[0.4em] uppercase text-charcoal/45 mb-6 lg:mb-10 will-anim">
          Ahmedabad, India · Est. 2026
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <h1 className="hero-headline font-display font-bold text-[clamp(3rem,9vw,7.5rem)] leading-[1.05] tracking-tight text-charcoal will-anim">
              <span className="clip-wrap"><span className="hero-word block">Visual</span></span>
              <span className="clip-wrap"><span className="hero-word block">Storytelling</span></span>
              <span className="clip-wrap"><em className="hero-word not-italic text-p2v block">Done Right.</em></span>
            </h1>
          </div>

          <div className="hero-tagline lg:col-span-4 space-y-5 lg:pb-3 will-anim">
            <div className="border border-charcoal/15 p-6">
              <p className="font-display text-lg italic text-charcoal/60 leading-snug">
                "Pixels · Purpose · Visuals"
              </p>
              <div className="mt-4 pt-4 border-t border-charcoal/10">
                <p className="text-xs text-charcoal/40 leading-relaxed">
                  We bridge data-driven strategy with cinematic craft — creating content that performs as well as it looks.
                </p>
              </div>
            </div>

            <button onClick={() => router.push('/reel')}
              className="hero-cta w-full flex items-center justify-between px-5 py-4 bg-p2v text-cream hover:bg-charcoal transition-colors group will-anim">
              <span className="text-xs tracking-[0.15em] uppercase font-medium">View Our Reel</span>
              <Icon n="aur" s={17} />
            </button>

            <button onClick={() => scrollTo('contact')}
              className="hero-cta w-full flex items-center justify-between px-5 py-4 border border-charcoal/20 text-charcoal hover:border-charcoal/50 transition-colors group will-anim">
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Get In Touch</span>
              <Icon n="arrow" s={17} />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="scroll-indicator mt-8 lg:mt-16 flex items-center gap-4 will-anim">
          <div className="w-8 h-px bg-charcoal/30" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal/35">Scroll to explore</p>
        </div>
      </div>
    </section>
  )
}
