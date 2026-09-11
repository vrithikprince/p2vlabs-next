/**
 * Precompute the globe's land dots at build time.
 *
 * The 21st.dev component generates its halftone dots in the browser on mount:
 * a lat/long sweep over every land feature's bounding box with a ray-casting
 * point-in-polygon test per candidate. Measured on this machine that is
 * ~33,500 tests producing 13,149 dots in **2.1 seconds of blocked main
 * thread** — before a single frame is drawn. On a marketing page that is an
 * INP catastrophe, and it is pure waste: the dots are a deterministic
 * function of a static GeoJSON file, so they can be computed once, here.
 *
 * Two artefacts are emitted into public/geo:
 *
 *   land-110m.json  Natural Earth 110m land, coordinates rounded to 2dp.
 *                   At globe scale 0.01 degrees is ~1.1km — far below one
 *                   screen pixel — and the rounding roughly halves the file.
 *                   Used for the coastline strokes.
 *
 *   land-dots.bin   Int16Array pairs of (lng*100, lat*100). Both fit Int16
 *                   comfortably (±18000, ±9000), so each dot costs 4 bytes
 *                   instead of the ~14 a JSON "[12.34,56.78]" pair would.
 *
 * Run: node scripts/build-globe-data.mjs [spacing]
 * The output is committed, so a normal build never fetches or recomputes.
 */
import { geoBounds } from 'd3-geo'
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'

const SOURCE =
  'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json'
const OUT_DIR = 'public/geo'
const RAW_CACHE = `${OUT_DIR}/.ne_110m_land.raw.json`

/* Matches the component's own spacing convention (step = spacing * 0.08
   degrees) so the visual density is comparable to the original. */
const SPACING = Number(process.argv[2] ?? 20)
const STEP = SPACING * 0.08

function pointInRing(x, y, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0]
    const yi = ring[i][1]
    const xj = ring[j][0]
    const yj = ring[j][1]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/* Same semantics as the original: inside the outer ring and outside every
   hole. Kept as-is so the dot field is the one the component was designed
   around, just computed somewhere sane. */
function pointInPolygon(x, y, rings) {
  if (!pointInRing(x, y, rings[0])) return false
  for (let i = 1; i < rings.length; i++) if (pointInRing(x, y, rings[i])) return false
  return true
}

function pointInFeature(x, y, feature) {
  const g = feature.geometry
  if (g.type === 'Polygon') return pointInPolygon(x, y, g.coordinates)
  if (g.type === 'MultiPolygon') {
    for (const rings of g.coordinates) if (pointInPolygon(x, y, rings)) return true
  }
  return false
}

const round2 = (n) => Math.round(n * 100) / 100
const roundCoords = (c) =>
  typeof c[0] === 'number' ? [round2(c[0]), round2(c[1])] : c.map(roundCoords)

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  let land
  if (existsSync(RAW_CACHE)) {
    land = JSON.parse(readFileSync(RAW_CACHE, 'utf8'))
  } else {
    const res = await fetch(SOURCE)
    if (!res.ok) throw new Error(`fetch ${SOURCE} -> ${res.status}`)
    const text = await res.text()
    writeFileSync(RAW_CACHE, text)
    land = JSON.parse(text)
  }

  // ---- coastlines ---------------------------------------------------------
  const slim = {
    type: 'FeatureCollection',
    features: land.features.map((f) => ({
      type: 'Feature',
      geometry: { type: f.geometry.type, coordinates: roundCoords(f.geometry.coordinates) },
    })),
  }
  writeFileSync(`${OUT_DIR}/land-110m.json`, JSON.stringify(slim))

  // ---- dots ---------------------------------------------------------------
  const t0 = performance.now()
  const dots = []
  for (const f of land.features) {
    const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(f)
    /* Latitude outer, longitude inner, with the longitude step widened by
       1/cos(lat). A constant angular grid — which is what the original uses —
       over-samples badly toward the poles, because meridians converge there
       while the step does not. On the rendered globe that turns Greenland,
       northern Canada and Siberia into dense banding while the tropics stay
       sparse. Scaling by 1/cos(lat) makes the spacing roughly equal-area, so
       density reads evenly across the sphere. cos is floored at 0.15 so the
       step cannot run away to infinity at the poles. */
    for (let lat = minLat; lat <= maxLat; lat += STEP) {
      const lngStep = STEP / Math.max(0.15, Math.cos(lat * (Math.PI / 180)))
      for (let lng = minLng; lng <= maxLng; lng += lngStep) {
        if (pointInFeature(lng, lat, f)) dots.push(lng, lat)
      }
    }
  }
  const ms = performance.now() - t0

  const i16 = new Int16Array(dots.length)
  for (let i = 0; i < dots.length; i++) i16[i] = Math.round(dots[i] * 100)
  writeFileSync(`${OUT_DIR}/land-dots.bin`, Buffer.from(i16.buffer))

  const kb = (n) => `${(n / 1024).toFixed(1)}kb`
  console.log(`spacing ${SPACING} (step ${STEP.toFixed(2)}deg)`)
  console.log(`  dots           ${dots.length / 2}  (computed in ${ms.toFixed(0)}ms, at build time)`)
  console.log(`  land-dots.bin  ${kb(i16.byteLength)}`)
  console.log(`  land-110m.json ${kb(Buffer.byteLength(JSON.stringify(slim)))}  (raw was ${kb(Buffer.byteLength(JSON.stringify(land)))})`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
