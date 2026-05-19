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
import { LoaderContext } from './LoaderContext.jsx'

/**
 * Client wrapper around the entire app. Mirrors the Vite app's Layout.jsx:
 *
 *   - Owns `loaded` state — true once the liquid loader's exit timeline finishes.
 *   - Provides LoaderContext so Hero / other sections can defer GSAP entrances.
 *   - Triggers ShutterTransition on every pathname change after first paint.
 *   - Mounts CustomCursor, ScrollToTop, Navbar, BottomNav.
 */
export default function RootClient({ children }) {
  const [loaded,        setLoaded]   = useState(false)
  const [transitionKey, setTransKey] = useState(0)
  const [prevPath,      setPrevPath] = useState(null)
  const pathname = usePathname()

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

  return (
    <LoaderContext.Provider value={{ loaderActive: !loaded }}>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <CustomCursor />
      <ShutterTransition trigger={transitionKey} />
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <BottomNav />
      <FloatingWhatsApp />
    </LoaderContext.Provider>
  )
}
