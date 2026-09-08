'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import Logo from '../ui/Logo.jsx'
import Icon from '../ui/Icon.jsx'

/**
 * Public-site navbar. Same behaviour as the Vite app - directional hover
 * effect, scroll-aware compact glass state, mobile menu - but the type is on
 * the amp system now (font-plex, sentence case, ~15px/500) rather than the old
 * editorial small-caps idiom, so the chrome reads as one piece with the hero.
 * Differences from the Vite version:
 *   - "Client Login" CTA points at clients.p2vlabs.in (private SPA subdomain)
 *     instead of an in-app /login route.
 *   - About + Packages entries route to standalone pages (/about, /packages)
 *     instead of in-page anchors - keeps SEO and editorial scroll in sync.
 *     ("Packages" was previously labelled "Services" - same destination,
 *      label changed for lead-gen clarity / pricing intent.)
 */
const PRIMARY = [
  /* Services sits first: it is the hub the whole /services cluster links
     up to, and a cluster nothing links into does not get crawled as one. */
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'reel',     label: 'The Reel', path: '/reel' },
  { id: 'blog',     label: 'Journal',  path: '/blog' },
  { id: 'vlog',     label: 'Films',    path: '/vlog' },
  { id: 'about',    label: 'About',    path: '/about' },
  { id: 'packages', label: 'Packages', path: '/packages' },
]

const CLIENT_LOGIN_URL = 'https://clients.p2vlabs.in/login'

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [compact, setCompact] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (path) => {
    setOpen(false)
    router.push(path)
  }

  const isActive = (id, path) => {
    return pathname === path || (id === 'reel' && pathname.startsWith('/reel'))
  }

  /* Directional hover (gsap, kill-tweens-of guarded) */
  const onEnter = (e) => {
    const btn = e.currentTarget
    const tIn  = btn.querySelector('.nav-text-in')
    const tOut = btn.querySelector('.nav-text-out')
    const fromTop = e.clientY < btn.getBoundingClientRect().top + btn.offsetHeight / 2
    gsap.killTweensOf([tIn, tOut])
    gsap.fromTo(tIn,
      { y: fromTop ? '-100%' : '100%', opacity: 1 },
      { y: '0%', opacity: 1, duration: 0.28, ease: 'power3.out' })
    gsap.to(tOut,
      { y: fromTop ? '100%' : '-100%', opacity: 0, duration: 0.28, ease: 'power3.out' })
  }
  const onLeave = (e) => {
    const btn = e.currentTarget
    const tIn  = btn.querySelector('.nav-text-in')
    const tOut = btn.querySelector('.nav-text-out')
    gsap.killTweensOf([tIn, tOut])
    gsap.set(tIn,  { opacity: 0, y: '0%' })
    gsap.set(tOut, { clearProps: 'transform,opacity' })
  }

  return (
    /* font-plex sits on the root so the mobile sheet inherits it too - one
       declaration instead of one per link.
       The border width stays on in both states (so nothing shifts by a pixel
       on scroll) but its colour goes transparent while compact: .glass-nav
       paints its own `0 1px 0 rgba(213,217,224,.9)` rule, and stacking that
       under the amp-hairline border read as a 2px line the moment you
       scrolled. One hairline in both states, same #d5d9e0 either way. */
    <nav className={`font-plex fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
      compact ? 'glass-nav border-transparent' : 'bg-white/95 backdrop-blur-sm border-amp-hairline'
    }`}>
      <div className={`max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between transition-all duration-300 ${
        compact ? 'h-16 md:h-12' : 'h-16'
      }`}>
        <Link href="/" className="hover:opacity-70 transition-opacity">
          <Logo />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {PRIMARY.map(({ id, label, path }) => (
            /* type stays on the button, never on the two label spans - the
               directional swap only reads right while .nav-text-in and
               .nav-text-out measure identically. */
            <button
              key={id}
              onClick={() => go(path)}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              className={`nav-dir-link relative text-[15px] font-medium pb-0.5 border-b transition-colors overflow-hidden ${
                isActive(id, path)
                  ? 'border-black text-black'
                  : 'border-transparent text-amp-caption hover:text-black hover:border-black/30'
              }`}
            >
              <span className="nav-text-out block">{label}</span>
              <span className="nav-text-in absolute inset-0 flex items-center justify-center opacity-0">{label}</span>
            </button>
          ))}
          <div className="w-px h-4 bg-amp-hairline-strong" />
          {/* pill shape + ink fill are already on-system; only the label idiom
              changes, a notch smaller and heavier than the links so it still
              reads as the CTA without shouting in caps. */}
          <a href={CLIENT_LOGIN_URL}
            className="text-sm font-semibold px-5 py-2.5 rounded-full bg-amp-ink-pill text-white hover:bg-black transition-colors">
            Client Login
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-1" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <Icon n={open ? 'x' : 'menu'} s={22} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-amp-hairline px-5 py-6 space-y-1">
          {PRIMARY.map(({ id, label, path }) => (
            <button
              key={id}
              onClick={() => go(path)}
              className="block w-full text-left py-3 text-[15px] font-medium text-amp-caption hover:text-black transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-amp-hairline">
            <a href={CLIENT_LOGIN_URL}
              onClick={() => setOpen(false)}
              className="block w-full mt-1 py-3 rounded-full bg-amp-ink-pill text-white text-sm font-semibold hover:bg-black transition-colors text-center">
              Client Login
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
