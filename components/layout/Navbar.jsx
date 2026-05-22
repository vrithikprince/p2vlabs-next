'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { gsap } from 'gsap'
import Logo from '../ui/Logo.jsx'
import Icon from '../ui/Icon.jsx'

/**
 * Public-site navbar. Same visual design as the Vite app — directional hover
 * effect, scroll-aware compact glass state, mobile menu. Differences from the
 * Vite version:
 *   - "Client Login" CTA points at clients.p2vlabs.in (private SPA subdomain)
 *     instead of an in-app /login route.
 *   - About + Services entries now route to standalone pages (/about, /packages)
 *     instead of in-page anchors — keeps SEO and editorial scroll in sync.
 */
const PRIMARY = [
  { id: 'reel',     label: 'The Reel', path: '/reel' },
  { id: 'blog',     label: 'Journal',  path: '/blog' },
  { id: 'vlog',     label: 'Films',    path: '/vlog' },
  { id: 'about',    label: 'About',    path: '/about' },
  { id: 'packages', label: 'Services', path: '/packages' },
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
    <nav className={`fixed top-0 inset-x-0 z-50 border-b border-charcoal/10 transition-all duration-300 ${
      compact ? 'glass-nav' : 'bg-cream/95 backdrop-blur-sm'
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
            <button
              key={id}
              onClick={() => go(path)}
              onMouseEnter={onEnter}
              onMouseLeave={onLeave}
              className={`nav-dir-link relative text-xs tracking-[0.15em] uppercase font-medium pb-0.5 border-b transition-colors overflow-hidden ${
                isActive(id, path)
                  ? 'border-p2v text-p2v'
                  : 'border-transparent text-charcoal/60 hover:text-charcoal hover:border-charcoal/30'
              }`}
            >
              <span className="nav-text-out block">{label}</span>
              <span className="nav-text-in absolute inset-0 flex items-center justify-center opacity-0">{label}</span>
            </button>
          ))}
          <div className="w-px h-4 bg-charcoal/15" />
          <a href={CLIENT_LOGIN_URL}
            className="text-xs tracking-[0.15em] uppercase px-5 py-2.5 bg-charcoal text-cream font-medium hover:bg-p2v transition-colors">
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
        <div className="md:hidden bg-cream border-t border-charcoal/10 px-5 py-6 space-y-1">
          {PRIMARY.map(({ id, label, path }) => (
            <button
              key={id}
              onClick={() => go(path)}
              className="block w-full text-left py-3 text-sm font-medium text-charcoal/70 hover:text-p2v transition-colors"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-charcoal/10">
            <a href={CLIENT_LOGIN_URL}
              onClick={() => setOpen(false)}
              className="block w-full mt-1 py-3 bg-charcoal text-cream text-xs tracking-[0.15em] uppercase font-medium hover:bg-p2v transition-colors text-center">
              Client Login
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
