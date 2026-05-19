/**
 * YouTube URL parsing helpers — server + client safe. Mirrors the Vite
 * app's lib/youtube.js so embed URLs and thumbnail logic match across
 * the CMS preview and the public site.
 */

const ID_PATTERNS = [
  /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([\w-]{11})/i,
  /youtu\.be\/([\w-]{11})/i,
  /youtube\.com\/embed\/([\w-]{11})/i,
  /youtube\.com\/shorts\/([\w-]{11})/i,
  /youtube\.com\/live\/([\w-]{11})/i,
]

export function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed
  for (const re of ID_PATTERNS) {
    const m = trimmed.match(re)
    if (m) return m[1]
  }
  return null
}

export function youtubeThumbnail(id, quality = 'maxres') {
  if (!id) return null
  const map = {
    maxres:  'maxresdefault.jpg',
    hq:      'hqdefault.jpg',
    mq:      'mqdefault.jpg',
    default: 'default.jpg',
  }
  return `https://i.ytimg.com/vi/${id}/${map[quality] || map.maxres}`
}

export function youtubeEmbed(id, opts = {}) {
  if (!id) return null
  const params = new URLSearchParams()
  if (opts.autoplay) params.set('autoplay', '1')
  if (opts.mute)     params.set('mute', '1')
  if (opts.start)    params.set('start', String(opts.start))
  params.set('rel', '0')
  params.set('modestbranding', '1')
  const qs = params.toString()
  return `https://www.youtube-nocookie.com/embed/${id}${qs ? `?${qs}` : ''}`
}

/** Canonical YouTube watch URL — used as VideoObject.contentUrl. */
export function youtubeWatch(id) {
  if (!id) return null
  return `https://www.youtube.com/watch?v=${id}`
}

export function durationToIso(input) {
  if (!input) return null
  const parts = String(input).trim().split(':').map((n) => parseInt(n, 10))
  if (parts.some(isNaN)) return null
  let h = 0, m = 0, s = 0
  if (parts.length === 2)      [m, s] = parts
  else if (parts.length === 3) [h, m, s] = parts
  else                          return null
  let out = 'PT'
  if (h) out += `${h}H`
  if (m) out += `${m}M`
  if (s) out += `${s}S`
  return out === 'PT' ? null : out
}
