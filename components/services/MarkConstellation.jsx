import Link from 'next/link'
import { SERVICE_MARKS } from '../illustrations/ServiceMarks.jsx'
import { SERVICES, ACCENT } from '../../lib/services.mjs'

/**
 * The hero's subject: the seven service marks laid out as a constellation.
 *
 * The masthead's real problem was not the backdrop, it was that the right
 * half was empty - a headline and a paragraph on the left and a void beside
 * them. No shader fixes that; a hero needs something to be about.
 *
 * This uses drawings the site already owns rather than stock imagery, and it
 * says the thing the copy says. The upper cluster is Content, the lower is
 * Search & web, and a dashed bridge runs between them: one half puts
 * something into the world, the other makes sure it is seen. SEO sits as the
 * hub of the lower cluster because structurally that is what it is.
 *
 * It is also the page's navigation, not decoration - every node is a real
 * link to its service, so the ornament and the index are the same object.
 *
 * Server-rendered. Hover is CSS and the drift is driven by ServicesMotion
 * off the data attributes, so this ships no JavaScript of its own and the
 * links are in the static HTML for a crawler.
 */

/* Positions in a 0-100 square. Deliberately uneven: a constellation on an
   even grid reads as a table of icons, which is what this must not be. */
const LAYOUT = {
  'video-production':   { x: 11, y: 17 },
  photography:          { x: 45, y: 6 },
  'social-content':     { x: 79, y: 21 },
  'website-development':{ x: 15, y: 52 },
  seo:                  { x: 50, y: 43 },
  'ai-search-visibility': { x: 86, y: 57 },
  'genai-automation':   { x: 45, y: 83 },
}

/* [from, to, isBridge] - the bridge is the one edge that crosses between the
   two halves, so it is dashed and the rest are solid. */
const EDGES = [
  ['video-production', 'photography', false],
  ['photography', 'social-content', false],
  ['social-content', 'seo', true],
  ['website-development', 'seo', false],
  ['seo', 'ai-search-visibility', false],
  ['seo', 'genai-automation', false],
]

export default function MarkConstellation({ className = '' }) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio: '1 / 1' }}
      data-anim="constellation"
    >
      {/* Edges sit behind the marks. non-scaling-stroke keeps the hairline a
          hairline while preserveAspectRatio="none" stretches the coordinate
          space to whatever box the layout gives us. */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {EDGES.map(([from, to, bridge]) => {
          const a = LAYOUT[from]
          const b = LAYOUT[to]
          if (!a || !b) return null
          return (
            <line
              key={`${from}-${to}`}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={bridge ? '#a273ff' : '#9fa5ad'}
              strokeWidth={bridge ? 1.1 : 0.9}
              strokeOpacity={bridge ? 0.55 : 0.35}
              strokeDasharray={bridge ? '3 3' : undefined}
              vectorEffect="non-scaling-stroke"
              data-anim="edge"
            />
          )
        })}
      </svg>

      {SERVICES.map((s) => {
        const pos = LAYOUT[s.slug]
        if (!pos) return null
        const a = ACCENT[s.accent]
        const Mark = SERVICE_MARKS[s.mark]
        return (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            data-anim="node"
            className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            aria-label={`${s.name} - ${s.tagline}`}
          >
            <span
              className="relative block w-[clamp(38px,4.4vw,60px)] transition-transform duration-500 ease-out group-hover:scale-[1.18]"
            >
              {/* The glow only exists on hover, so at rest the constellation
                  is seven line drawings on white and stays quiet. */}
              <span
                className="pointer-events-none absolute -inset-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle, rgb(${a.rgb} / 0.28), rgb(${a.rgb} / 0) 70%)`,
                  filter: 'blur(10px)',
                }}
              />
              {Mark && <Mark accent={a.hex} className="relative w-full h-auto" />}
            </span>

            <span className="mt-2 flex flex-col items-center">
              <span className="font-plex text-[10px] font-semibold tracking-[0.18em] text-amp-caption/60">
                {s.n}
              </span>
              {/* Absolutely placed so seven labels appearing on hover never
                  reflow the constellation under the pointer. */}
              <span className="relative block h-0">
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-1 whitespace-nowrap text-[11px] font-semibold ${a.text} opacity-0 translate-y-1 transition-all duration-400 ease-out group-hover:opacity-100 group-hover:translate-y-0`}
                >
                  {s.name}
                </span>
              </span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
