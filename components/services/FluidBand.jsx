'use client'
import { useEffect, useRef } from 'react'

/**
 * Host for the vgpu "Interactive Fluid" example inside the /services process
 * band. Nearly all of the integration lives here: ten of the twelve files
 * under ./fluid are byte-identical to the pinned upstream revision, and the
 * two that differ change colour constants only. See fluid/UPSTREAM.md for the
 * revision, the hashes and the exact diff.
 *
 * Upstream's own index.tsx mounts the renderer full-bleed on a black page and
 * never unmounts it. That is right for a gallery demo and wrong for a band
 * halfway down a marketing page, so the differences are all lifecycle and
 * compositing, never simulation:
 *
 *   Compositing. The display pass writes an opaque near-black background, so
 *   dropping the canvas into the band as-is would black out the navy gradient,
 *   the lit grid and the registration marks underneath. Rather than fork
 *   display.wgsl or switch the surface to premultiplied alpha, the canvas is
 *   composited with mix-blend-mode: screen. Black is the identity colour for
 *   screen, so the empty parts of the simulation vanish and the dye adds light
 *   over the band. Zero shader changes, and it reads as light in the fluid
 *   rather than a video playing in a box.
 *
 *   Lifecycle. Upstream runs requestAnimationFrame for the life of the page,
 *   pausing only on document.hidden. A band that is off-screen for most of a
 *   visit must cost nothing, so an IntersectionObserver creates the renderer on
 *   first entry and disposes it after it has been out of view for a moment.
 *   That drives the example's own createRenderer/dispose contract from outside
 *   instead of reaching into its loop, so its resource cleanup - cancelling the
 *   frame, disposing pointer capture, disposing the GPU device - runs exactly
 *   as written. Re-entry builds a fresh device and the dye starts over, which
 *   is a feature here.
 *
 *   Gating. Three checks before anything loads:
 *     - navigator.gpu. WebGPU is absent in Firefox by default and in Safari
 *       before 18. Those visitors keep the band exactly as it was.
 *     - prefers-reduced-motion, which a continuously moving fluid plainly is.
 *     - (hover: hover) and (pointer: fine). Not a taste call: installStirInput
 *       sets touch-action: none on the canvas, so on a touch device a swipe
 *       starting on the band would stir the fluid instead of scrolling the
 *       page. Desktop-only avoids trapping the scroll, and saves phone battery
 *       on a simulation nobody can hover anyway.
 *
 *   Import cost. vgpu plus the WGSL modules are pulled in through a dynamic
 *   import that only runs once all three gates pass and the band is actually
 *   in view, so none of it lands in the initial bundle for /services.
 */
/* Screen blend at full strength lets a bright dye front wash out the step
   copy underneath. 0.8 keeps the fluid reading the same and keeps the text
   safely above it. */
const FULL = '0.8'

export default function FluidBand({ className = '' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const mq = (q) => window.matchMedia(q).matches
    if (typeof navigator === 'undefined' || !navigator.gpu) return
    if (mq('(prefers-reduced-motion: reduce)')) return
    if (!mq('(hover: hover) and (pointer: fine)')) return

    let renderer = null
    let cancelled = false
    let starting = false
    let leaveTimer = 0

    const start = async () => {
      if (cancelled || renderer || starting) return
      starting = true
      try {
        const { createRenderer } = await import('./fluid/renderer')
        if (cancelled) return
        renderer = createRenderer({ canvas })
        // The example surfaces init failures through `ready`; an unsupported
        // adapter or a lost device must degrade to the plain band, not throw
        // into an unhandled rejection.
        renderer.ready?.catch(() => {
          renderer?.dispose()
          renderer = null
          canvas.style.opacity = '0'
        })
        canvas.style.opacity = FULL
      } catch {
        renderer = null
      } finally {
        starting = false
      }
    }

    const stop = () => {
      renderer?.dispose()
      renderer = null
      canvas.style.opacity = '0'
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(leaveTimer)
          void start()
        } else {
          // Debounced: a fast scroll past the band should not build and tear
          // down a GPU device on the way through.
          clearTimeout(leaveTimer)
          leaveTimer = setTimeout(stop, 1500)
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(canvas)

    return () => {
      cancelled = true
      clearTimeout(leaveTimer)
      io.disconnect()
      stop()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{
        mixBlendMode: 'screen',
        opacity: 0,
        transition: 'opacity 900ms ease',
      }}
    />
  )
}
