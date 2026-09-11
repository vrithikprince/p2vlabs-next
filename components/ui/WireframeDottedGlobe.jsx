'use client'
import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import { timer } from 'd3-timer'

/**
 * Wireframe dotted globe — halftone land over a graticule sphere.
 *
 * Adapted from the 21st.dev "wireframe-dotted-globe" component. The geometry
 * and the look are theirs; what changed is everything that made it unsuitable
 * for a production marketing page. Each departure is deliberate:
 *
 *   Dots are precomputed. The original sweeps every land feature's bounding
 *   box in the browser running a ray-casting point-in-polygon test per
 *   candidate — measured here at 2.1 seconds of blocked main thread before
 *   the first frame. They are a pure function of a static GeoJSON, so
 *   scripts/build-globe-data.mjs does it once and ships 8,422 dots as a 33kb
 *   Int16 binary. Mount cost is now a fetch.
 *
 *   Data is local. The original fetches Natural Earth from raw.githubusercontent
 *   .com on every mount: a third-party runtime dependency with no SLA on a
 *   page we need to be fast and indexable. Both assets are served from /geo.
 *
 *   d3-geo + d3-timer, not d3. The component uses four functions; pulling the
 *   whole of d3 for them would add far more to the bundle than the globe.
 *
 *   Back faces are culled. d3's projection(point) applies rotation and the raw
 *   projection but NOT clipAngle — that only happens in the stream pipeline
 *   geoPath uses. So the original projects far-side dots too and folds them
 *   onto the near hemisphere, which is why its land reads as double-exposed.
 *   Each dot carries a precomputed unit vector; a dot product against the view
 *   centre rejects the far side before any trig, which fixes the artefact and
 *   halves the per-frame work.
 *
 *   One path, one fill. The original issues beginPath/arc/fill per dot, so
 *   8,000+ canvas path objects per frame. Batching into a single path is most
 *   of the remaining frame cost.
 *
 *   No wheel zoom. The original calls preventDefault on wheel, which hijacks
 *   the scroll: a visitor scrolling the page over the globe would zoom it
 *   instead and get stuck. Dropped outright — this is a decorative element on
 *   a long page, not a map viewer.
 *
 *   Drag is fine-pointer only, and touch-action is left alone, so a swipe that
 *   starts on the globe scrolls the page rather than being captured.
 *
 *   Lifecycle. An IntersectionObserver stops the timer off-screen, the tab
 *   being hidden stops it, prefers-reduced-motion paints one static frame and
 *   never animates, and a ResizeObserver keeps the canvas matched to its
 *   container — the original measured window.innerWidth once at mount, which
 *   is wrong inside any container and never updates.
 *
 *   Palette. The original's hardcoded black sphere with white lines is
 *   inverted for the amp system; `tone` picks light or dark and every colour
 *   resolves from one table.
 */

/* Amp tokens, resolved here rather than through Tailwind classes because
   these are canvas fills, not CSS. Kept in one place so the two tones stay
   in step. */
const TONES = {
  light: {
    sphere: 'rgba(242,244,248,0.55)', // amp-surface, barely there on white
    limb: 'rgba(0,26,79,0.45)', // amp-navy
    graticule: 'rgba(0,26,79,0.13)',
    coast: 'rgba(0,26,79,0.55)',
    dot: 'rgba(105,128,255,0.85)', // amp-periwinkle
  },
  dark: {
    sphere: 'rgba(255,255,255,0.03)',
    limb: 'rgba(255,255,255,0.38)',
    graticule: 'rgba(255,255,255,0.11)',
    coast: 'rgba(255,255,255,0.34)',
    dot: 'rgba(162,115,255,0.95)', // amp-violet
  },
}

const DEG = Math.PI / 180

export default function WireframeDottedGlobe({
  tone = 'light',
  spin = 0.12,
  interactive = true,
  className = '',
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const C = TONES[tone] ?? TONES.light
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    const projection = geoOrthographic().clipAngle(90)
    const path = geoPath(projection, ctx)
    const graticule = geoGraticule10()

    let land = null
    /* Parallel arrays rather than objects: 8,422 dots touched every frame, and
       three Float64Arrays beat an array of {x,y,z} for both memory and access. */
    let lng = null
    let lat = null
    let vx = null
    let vy = null
    let vz = null

    const rotation = [0, -12] // a slight tilt reads better than dead-on equator
    let width = 0
    let height = 0
    let radius = 0

    const resize = () => {
      const r = wrap.getBoundingClientRect()
      width = Math.max(1, Math.round(r.width))
      height = Math.max(1, Math.round(r.height))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      radius = Math.min(width, height) / 2.15
      projection.scale(radius).translate([width / 2, height / 2])
      render()
    }

    const render = () => {
      if (!width || !height) return
      ctx.clearRect(0, 0, width, height)
      const cx = width / 2
      const cy = height / 2

      // sphere
      ctx.beginPath()
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI)
      ctx.fillStyle = C.sphere
      ctx.fill()
      ctx.strokeStyle = C.limb
      ctx.lineWidth = 1
      ctx.stroke()

      // graticule — drawn whether or not the land data arrived, so a failed
      // fetch degrades to a bare wireframe sphere instead of an empty box
      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = C.graticule
      ctx.lineWidth = 1
      ctx.stroke()

      if (land) {
        ctx.beginPath()
        path(land)
        ctx.strokeStyle = C.coast
        ctx.lineWidth = 1
        ctx.stroke()
      }

      if (!lng) return

      /* Unit vector of the geographic point currently at the centre of the
         disc. rotate([l, p]) brings [-l, -p] to the centre, so a dot is on the
         near hemisphere exactly when its vector has a positive dot product
         with this one. Cheaper than any trig, and exact. */
      const cl = -rotation[0] * DEG
      const cp = -rotation[1] * DEG
      const ccp = Math.cos(cp)
      const ax = ccp * Math.cos(cl)
      const ay = ccp * Math.sin(cl)
      const az = Math.sin(cp)

      const dotR = Math.max(0.75, radius * 0.0055)
      ctx.beginPath()
      for (let i = 0; i < lng.length; i++) {
        if (vx[i] * ax + vy[i] * ay + vz[i] * az <= 0) continue
        const p = projection([lng[i], lat[i]])
        if (!p) continue
        const px = p[0]
        const py = p[1]
        if (px < -2 || py < -2 || px > width + 2 || py > height + 2) continue
        ctx.moveTo(px + dotR, py)
        ctx.arc(px, py, dotR, 0, 2 * Math.PI)
      }
      ctx.fillStyle = C.dot
      ctx.fill()
    }

    // ---- data ---------------------------------------------------------------
    let disposed = false
    const load = async () => {
      try {
        const [geo, bin] = await Promise.all([
          fetch('/geo/land-110m.json').then((r) => (r.ok ? r.json() : null)),
          fetch('/geo/land-dots.bin').then((r) => (r.ok ? r.arrayBuffer() : null)),
        ])
        if (disposed) return
        land = geo
        if (bin) {
          const raw = new Int16Array(bin)
          const n = raw.length >> 1
          lng = new Float64Array(n)
          lat = new Float64Array(n)
          vx = new Float64Array(n)
          vy = new Float64Array(n)
          vz = new Float64Array(n)
          for (let i = 0; i < n; i++) {
            const lo = raw[i * 2] / 100
            const la = raw[i * 2 + 1] / 100
            lng[i] = lo
            lat[i] = la
            const cla = Math.cos(la * DEG)
            vx[i] = cla * Math.cos(lo * DEG)
            vy[i] = cla * Math.sin(lo * DEG)
            vz[i] = Math.sin(la * DEG)
          }
        }
        render()
      } catch {
        // Decorative: a failed fetch leaves the wireframe sphere, not an error.
        render()
      }
    }

    // ---- motion -------------------------------------------------------------
    let spinning = !reduced
    let last = 0
    let running = false
    const tick = (elapsed) => {
      if (!spinning) {
        last = elapsed
        return
      }
      // Degrees per second, framerate-independent, so a 120Hz display does not
      // spin twice as fast as a 60Hz one.
      const dt = Math.min(100, elapsed - last)
      last = elapsed
      rotation[0] = (rotation[0] + spin * dt * 0.06) % 360
      projection.rotate(rotation)
      render()
    }

    let t = null
    const play = () => {
      if (running || reduced) return
      running = true
      last = 0
      t = timer(tick)
    }
    const stop = () => {
      running = false
      t?.stop()
      t = null
    }

    // ---- interaction --------------------------------------------------------
    /* Pointer capture on the canvas, and touch-action deliberately untouched:
       a drag that starts here on a phone must still scroll the page. Drag is
       limited to fine pointers for the same reason. */
    let dragId = null
    let sx = 0
    let sy = 0
    let sr = [0, 0]
    let resume = 0

    const onDown = (e) => {
      if (!interactive || !fine || dragId !== null) return
      dragId = e.pointerId
      canvas.setPointerCapture?.(e.pointerId)
      sx = e.clientX
      sy = e.clientY
      sr = [rotation[0], rotation[1]]
      spinning = false
      clearTimeout(resume)
    }
    const onMove = (e) => {
      if (dragId !== e.pointerId) return
      const k = 0.25
      rotation[0] = sr[0] + (e.clientX - sx) * k
      rotation[1] = Math.max(-75, Math.min(75, sr[1] - (e.clientY - sy) * k))
      projection.rotate(rotation)
      render()
    }
    const onUp = (e) => {
      if (dragId !== e.pointerId) return
      if (canvas.hasPointerCapture?.(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
      dragId = null
      // The original resumed after 10ms, which is indistinguishable from
      // never pausing. A beat of stillness after release reads as intentional.
      clearTimeout(resume)
      resume = setTimeout(() => {
        if (!reduced) spinning = true
      }, 900)
    }

    if (interactive && fine) {
      canvas.addEventListener('pointerdown', onDown)
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerup', onUp)
      canvas.addEventListener('pointercancel', onUp)
      canvas.style.cursor = 'grab'
    }

    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()

    /* The data fetch is deferred to first intersection, not fired on mount.
       The globe sits below the fold, and a visitor who never scrolls to it
       should not pay ~100kb for something they never see. */
    let loaded = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) {
          stop()
          return
        }
        if (!loaded) {
          loaded = true
          load()
        }
        play()
      },
      { rootMargin: '150px' },
    )
    io.observe(wrap)

    const onVis = () => (document.hidden ? stop() : play())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      disposed = true
      stop()
      clearTimeout(resume)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [tone, spin, interactive])

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />
    </div>
  )
}
