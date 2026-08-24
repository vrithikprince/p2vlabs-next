'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import Loader from './Loader.jsx'
import CustomCursor from './CustomCursor.jsx'
import ShutterTransition from './ShutterTransition.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import Navbar from './Navbar.jsx'
import BottomNav from './BottomNav.jsx'
import FloatingWhatsApp from './FloatingWhatsApp.jsx'
import ContactSection from '../landing/ContactSection.jsx'
import Footer from './Footer.jsx'
import { LoaderContext } from './LoaderContext.jsx'

/**
 * Client wrapper around the entire app. Mirrors the Vite app's Layout.jsx:
 *
 *   - Owns `loaded` state - true once the ink loader's exit timeline finishes.
 *     Persisted to sessionStorage so the loader doesn't replay if RootClient
 *     happens to remount during a soft route change (the symptom: clicking
 *     "View Our Reel" replayed the full 3.3s handwriting animation).
 *   - Provides LoaderContext so Hero / other sections can defer GSAP entrances.
 *   - Triggers ShutterTransition on every pathname change after first paint.
 *   - Mounts CustomCursor, ScrollToTop, Navbar, BottomNav.
 */
const LOADER_DONE_KEY = 'p2v-loader-done'

export default function RootClient({ children }) {
  /* Initial state stays `false` so SSR and client first-paint match -
     prevents hydration mismatch. The sessionStorage check happens in the
     effect below, immediately after mount. */
  const [loaded,        setLoaded]   = useState(false)
  const [transitionKey, setTransKey] = useState(0)
  const [prevPath,      setPrevPath] = useState(null)
  const pathname = usePathname()

  /* On mount, if the loader has already played in this tab/session, flip
     `loaded` to true synchronously. The Loader's own GSAP timeline lives
     in a child useEffect that runs *before* this parent effect, but it
     fires off async tweens - by the time the first frame renders, we've
     already unmounted the Loader, so visually it's a no-op. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem(LOADER_DONE_KEY) === '1') {
        setLoaded(true)
      }
    } catch {
      /* Some privacy modes throw on sessionStorage access. Fall through
         and let the loader play - better than a hard error. */
    }
  }, [])

  /* First render: capture pathname so we don't fire the shutter on initial mount. */
  useEffect(() => {
    if (prevPath === null) {
      setPrevPath(pathname)
      return
    }
    if (pathname !== prevPath) {
      setTransKey((k) => k + 1)
      setPrevPath(pathname)
      window.scrollTo(0, 0)
    }
  }, [pathname, prevPath])

  const handleLoaderDone = () => {
    try { sessionStorage.setItem(LOADER_DONE_KEY, '1') } catch { /* see above */ }
    setLoaded(true)
  }

  return (
    <LoaderContext.Provider value={{ loaderActive: !loaded }}>
      {!loaded && <Loader onDone={handleLoaderDone} />}
      <CustomCursor />
      <ShutterTransition trigger={transitionKey} />
      <ScrollToTop />
      <Navbar />
      {/* relative + z-10 makes this an explicit, positive-z-index sibling
          of #footer-portal-root (see app/layout.jsx) - Footer's fixed
          reveal panel sits at z-0, so this always paints over it. Two
          explicitly-positioned siblings compared by z-index is the one
          stacking case every engine gets right; relying on "negative
          z-index sinks below static content" did not hold up in practice
          on a page this dense with GSAP-driven layers.

          The closing CTA and the Footer live HERE rather than in each
          page for two reasons:

          1. Every page gets the same ending - the CTA band and the big
             wordmark reveal - without ten copies to keep in sync.
          2. It is what makes the reveal work at all. z-10 only controls
             ORDER, not coverage: the fixed panel still shows through any
             transparent pixel above it. The homepage looked fine only
             because every one of its sections happens to set bg-white,
             while /blog rendered on a bare `pt-16` wrapper and the
             wordmark bled straight through the post grid.
             So page content gets an explicit opaque wrapper, and the
             Footer's transparent spacer sits OUTSIDE it as a sibling -
             the one region the panel is allowed to show through.
             Painting <main> itself would have covered the panel
             everywhere and killed the reveal instead of fixing it. */}
      <main className="relative z-10">
        <div className="bg-white">{children}</div>
        {/* /contact already opens with this exact block - a second copy
            would ask the same question twice on one page. */}
        {pathname !== '/contact' && <ContactSection />}
        <Footer />
      </main>
      <BottomNav />
      <FloatingWhatsApp />
    </LoaderContext.Provider>
  )
}
