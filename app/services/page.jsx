import Link from 'next/link'
import { SERVICE_MARKS } from '../../components/illustrations/ServiceMarks.jsx'
import { GridField, Wash, RegMarks } from '../../components/services/Decor.jsx'
import ShaderField from '../../components/services/ShaderField.jsx'
import ServicesMotion from '../../components/services/ServicesMotion.jsx'
import MarkConstellation from '../../components/services/MarkConstellation.jsx'
import FluidBand from '../../components/services/FluidBand.jsx'
import { SITE_URL, buildPageMetadata, breadcrumbsJsonLd } from '../../lib/seo.js'
import { SERVICES, SERVICE_GROUPS, ACCENT } from '../../lib/services.mjs'
import { inr } from '../../lib/pricing.mjs'

/**
 * /services - the hub, as an editorial index rather than a card grid.
 *
 * Seven equal cards give a reader no hierarchy and no rhythm. Seven
 * full-bleed numbered rows read as an index, scan faster, and let the
 * typography carry weight a 320px card never can.
 *
 * The structure underneath is drafted rather than decorated: a hairline
 * field, registration crosses, and accent colour that arrives as light
 * across a row on hover instead of filling it. A 96px block of navy would
 * shout, and an index should stay calm until you address one line of it.
 *
 * Nothing about the SEO changed - same schema, same copy, same URLs.
 */
export const revalidate = 3600

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Services - Content, Websites & Search Visibility',
    description:
      'What P2V Labs does, in Ahmedabad and across India: video production, product and food photography, social content, website development, SEO, AI search visibility and GenAI automation.',
    path: '/services',
  })
}

/* How an engagement actually runs. Four steps is the real number - adding a
   fifth to balance a grid is how process sections start lying. */
const STEPS = [
  { n: '01', t: 'Brief',  d: 'A call about what you sell, who buys it, and what already exists. No form to fill in first.' },
  { n: '02', t: 'Scope',  d: 'Deliverables, dates and a fixed monthly or project figure, in writing before anything starts.' },
  { n: '03', t: 'Make',   d: 'Shoot, cut, build or optimise, on a shared calendar you can see rather than a black box.' },
  { n: '04', t: 'Report', d: 'What moved: rankings, citations, reach, enquiries. Whatever the work was actually hired to do.' },
]

function IndexRow({ s, last }) {
  const a = ACCENT[s.accent]
  const Mark = SERVICE_MARKS[s.mark]

  return (
    <Link
      href={`/services/${s.slug}`}
      data-anim="row"
      style={{ '--svc-accent': a.rgb }}
      className={`group relative block ${last ? '' : 'border-b border-amp-hairline'}`}
    >
      {/* Light crossing the row from the left, not a fill. */}
      <span className="svc-sweep" aria-hidden="true" />
      <span
        className={`absolute left-0 top-0 bottom-0 w-0 ${a.bg} transition-all duration-500 ease-out group-hover:w-[3px]`}
        aria-hidden="true"
      />

      <div className="relative flex items-center gap-5 md:gap-10 py-7 md:py-9 pl-0 md:pl-6 transition-[padding] duration-500 ease-out group-hover:pl-4 md:group-hover:pl-10">
        <span className="font-plex text-[11px] font-semibold tracking-[0.2em] w-8 shrink-0 pt-1 text-amp-caption/60">
          {s.n}
        </span>

        <div className="relative min-w-0 flex-1">
          <h3
            className="font-plex font-semibold text-black leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.6rem,3.6vw,2.9rem)' }}
          >
            {s.name}
          </h3>
          <p className="text-[14px] md:text-[15px] text-amp-body leading-relaxed mt-2 max-w-xl">
            {s.tagline}
          </p>
          {/* The search this page exists to win. Worth showing on a studio
              that sells search visibility: it says the pages were built
              against real queries rather than named after internal
              departments. Positioned out of flow so it costs the row no
              height when idle - reserving space for it left every row
              visibly bottom-heavy - and it lands inside the row's own
              padding, so nothing below it moves. */}
          <p className="hidden md:flex absolute left-0 top-full mt-2 items-center gap-2 opacity-0 -translate-y-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
            <span className={`w-1 h-1 rounded-full ${a.dot}`} aria-hidden="true" />
            <span className="svc-query text-[11px] tracking-[0.02em] text-amp-caption/80 whitespace-nowrap">
              {s.query}
            </span>
          </p>
        </div>

        {/* The mark held back until hover on desktop so the index reads as
            type first. Always visible on touch, where there is no hover. */}
        <div className="hidden lg:block shrink-0 w-[76px] opacity-0 translate-x-2 scale-95 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100">
          {Mark && <Mark accent={a.hex} className="w-full h-auto" />}
        </div>

        <div className="shrink-0 text-right w-[92px] md:w-[132px]">
          <span className="block text-[11px] uppercase tracking-[0.14em] text-amp-caption/70">
            {s.priceFrom === null ? 'Scoped' : 'From'}
          </span>
          <span className={`block font-plex text-[15px] md:text-[17px] font-semibold ${a.text} mt-1`}>
            {s.priceFrom === null ? 'per project' : inr(s.priceFrom)}
          </span>
        </div>

        <span
          className={`shrink-0 hidden md:block text-[20px] ${a.text} opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0`}
          aria-hidden="true"
        >
          &rarr;
        </span>
      </div>
    </Link>
  )
}

export default function ServicesPage() {
  const crumbs = breadcrumbsJsonLd([{ name: 'Home', path: '/' }, { name: 'Services' }])

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'P2V Labs services',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/services/${s.slug}`,
    })),
  }

  return (
    <ServicesMotion>
    <div className="pt-16 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      {/* ── masthead ──────────────────────────────────────────────────────
          Layered back to front: the static CSS washes (which are also the
          no-WebGL fallback, so they are tuned to stand on their own), then
          the shader, then the drafting grid, then type. The washes sit
          lower than they would alone - with the shader over them the two
          colour layers otherwise compound into mud.                       */}
      <section className="relative px-5 md:px-10 lg:px-20 pt-12 lg:pt-16 pb-12 lg:pb-14 overflow-hidden flex flex-col justify-center min-h-[62vh] lg:min-h-[74vh]">
        <Wash rgb="0 26 79" alpha={0.1} style={{ top: '-16%', left: '2%' }} />
        <Wash rgb="162 115 255" alpha={0.11} size="clamp(260px,30vw,480px)" style={{ top: '-8%', right: '4%' }} />
        <ShaderField />
        <GridField />
        <RegMarks />

        <div className="max-w-7xl mx-auto relative w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-7">
            <p
              data-anim="eyebrow"
              className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-7"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
              Services
            </p>
            {/* Each line gets its own clip box so the reveal wipes rather than
                fades. .clip-wrap is the site's existing idiom for this - it
                carries the descender padding that stops "y" being sliced. */}
            <h1
              className="font-plex font-semibold text-black leading-[0.94] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.5rem,6.4vw,5.4rem)' }}
            >
              <span data-anim="line" className="clip-wrap">
                <span className="block">Make the work.</span>
              </span>
              <span data-anim="line" className="clip-wrap">
                <span className="block text-amp-violet">Make it findable.</span>
              </span>
            </h1>
            <p
              data-anim="lede"
              className="mt-7 text-[16px] lg:text-[18px] text-amp-body leading-relaxed max-w-xl"
            >
              Seven things, in two halves. One half puts something worth finding
              into the world. The other makes sure a search engine &mdash; and whatever
              people ask instead of one &mdash; can actually see it.
            </p>
          </div>

          {/* The subject. Below lg it is dropped rather than shrunk - at
              phone width seven nodes and their labels collapse into an
              unreadable tangle, and the index immediately below already
              lists all seven properly. */}
          <div className="hidden lg:block lg:col-span-5">
            <MarkConstellation className="max-w-[520px] ml-auto" />
          </div>
        </div>
      </section>

      {/* ── the queries these pages are built against ─────────────────── */}
      <div className="relative border-y border-amp-hairline bg-amp-surface/70 overflow-hidden">
        <div className="relative flex items-center py-3">
          <span className="hidden sm:block shrink-0 pl-5 md:pl-10 lg:pl-20 pr-5 text-[10px] font-semibold tracking-[0.18em] uppercase text-amp-caption/70">
            Built to rank for
          </span>
          {/* The track has to be clipped by a box of its own. It translates
              -50% of its own very wide width, so with only the band clipping
              it, it slides out from under the label and prints over it. */}
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="marquee-track" data-anim="marquee">
              {/* Duplicated exactly once - the keyframe travels -50%, so any
                  other multiple makes the loop visibly jump. The copy is
                  aria-hidden so a screen reader hears the list a single time. */}
              {[0, 1].map((pass) => (
                <span key={pass} className="inline-flex items-center" aria-hidden={pass === 1 ? 'true' : undefined}>
                  {SERVICES.map((s) => (
                    <span key={s.slug} className="inline-flex items-center gap-3 px-6">
                      <span className={`w-1 h-1 rounded-full ${ACCENT[s.accent].dot}`} />
                      <span className="svc-query text-[12px] text-amp-body/80">{s.query}</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-amp-surface to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-amp-surface to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* ── the index ─────────────────────────────────────────────────── */}
      {SERVICE_GROUPS.map((group) => {
        const items = SERVICES.filter((s) => s.kicker === group.kicker)
        return (
          <section key={group.kicker} className="px-5 md:px-10 lg:px-20 pb-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-6 pt-12 pb-5 border-b-2 border-black">
                <h2 className="font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-black flex items-baseline gap-3">
                  {group.kicker}
                  <span className="text-amp-caption/60 font-normal tracking-[0.1em]">
                    {String(items.length).padStart(2, '0')}
                  </span>
                </h2>
                <p className="text-[13px] text-amp-caption text-right">{group.blurb}</p>
              </div>
              <div data-anim="rows">
                {items.map((s, i) => (
                  <IndexRow key={s.slug} s={s} last={i === items.length - 1} />
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* ── how it runs ───────────────────────────────────────────────────
          The dark band sits here rather than on the closing call, because
          the site footer is itself dark: putting the page's one dark moment
          immediately above it merged the two into a single long dark mass
          and cost both their impact. Mid-page, framed by white on both
          sides, it lands - and the page alternates light, dark, light, dark
          instead of running downhill into black.                          */}
      <section className="relative mt-14 lg:mt-20 overflow-hidden svc-grain">
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{ background: 'linear-gradient(140deg, #001a4f 0%, #0a1226 52%, #16191f 100%)' }}
        />
        <GridField dark band tight />
        <Wash rgb="105 128 255" alpha={0.26} blur={60} size="clamp(300px,36vw,560px)" style={{ top: '-24%', right: '4%' }} />
        <Wash rgb="162 115 255" alpha={0.2} blur={60} size="clamp(260px,30vw,460px)" style={{ bottom: '-30%', left: '-4%' }} />
        {/* Sits above the wash and below the type, screen-blended so it adds
            light to the band rather than replacing it. Self-gating: renders
            nothing without WebGPU, a fine pointer and motion consent, in which
            case the band is exactly what it was. */}
        <FluidBand />
        <RegMarks dark />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-24">
          <div className="flex items-baseline justify-between gap-6 mb-12">
            <h2 className="font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-white">
              How it runs
            </h2>
            <p className="text-[13px] text-white/55 text-right max-w-xs">
              The same four steps whether it&rsquo;s one film or a search retainer.
            </p>
          </div>

          {/* A real grid: hairline-divided cells rather than floating cards.
              Dividers are a left border on each cell after the first in its
              row, so adjacent cells never stack two hairlines into one 2px
              rule that reads heavier than the others. */}
          <div className="relative">
            {/* The rule is its own element rather than a border so it can be
                drawn in. The step nodes still sit on it: they are pinned to
                each cell's top edge, which is this line. */}
            <span
              data-anim="rule"
              className="absolute left-0 right-0 top-0 h-px bg-white/30"
              aria-hidden="true"
            />
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((st, i) => {
              /* Which cells start a new column depends on the breakpoint, and
                 the node has to travel with the padding or it detaches from
                 its own text. Deriving both from one condition per cell is
                 what keeps them in step.
                   sm (2 up): cells 1 and 3 are the right-hand column
                   lg (4 up): cells 1, 2 and 3 all sit against a rule       */
              const dividesAtSm = i % 2 === 1
              const dividesOnlyAtLg = i % 4 === 2

              return (
                <li
                  key={st.n}
                  data-anim="step"
                  className={[
                    'relative pt-8 pb-8 pr-0 sm:pr-8',
                    dividesAtSm ? 'sm:border-l sm:border-white/15 sm:pl-8' : '',
                    dividesOnlyAtLg ? 'lg:border-l lg:border-white/15 lg:pl-8' : '',
                    i < STEPS.length - 1 ? 'border-b border-white/15' : '',
                    /* Rows divide at sm (two rows of two); at lg it is one
                       row, so every horizontal rule goes away. */
                    i % 2 === 1 ? 'sm:border-b-0' : 'sm:border-b lg:border-b-0',
                    i >= STEPS.length - 2 ? 'sm:border-b-0' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {/* The node sits on the top rule the way a stop sits on a
                      line - it is what makes four cells read as a sequence
                      rather than four unrelated boxes. */}
                  <span
                    className={[
                      'absolute -top-[5px] w-[9px] h-[9px] rounded-full bg-amp-periwinkle ring-4 ring-[#0a1226] left-0',
                      dividesAtSm ? 'sm:left-8' : '',
                      dividesOnlyAtLg ? 'lg:left-8' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden="true"
                  />
                  <span className="block font-plex text-[11px] font-semibold tracking-[0.2em] text-white/45">
                    {st.n}
                  </span>
                  <h3 className="font-plex text-[20px] lg:text-[22px] font-semibold text-white mt-3 tracking-[-0.015em]">
                    {st.t}
                  </h3>
                  <p className="text-[14px] text-white/70 leading-relaxed mt-2.5 max-w-[30ch]">{st.d}</p>
                </li>
              )
            })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── closing call ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white">
        <GridField />
        <Wash rgb="162 115 255" alpha={0.14} size="clamp(280px,32vw,520px)" style={{ top: '-30%', right: '2%' }} />
        <Wash rgb="0 26 79" alpha={0.09} size="clamp(240px,28vw,440px)" style={{ bottom: '-40%', left: '4%' }} />
        <RegMarks />

        <div className="relative max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.16em] uppercase text-amp-caption mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
                Pricing
              </p>
              <h2
                className="font-plex font-semibold text-black leading-[1.0] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2rem,5vw,3.6rem)' }}
              >
                Every price on one page.
              </h2>
              <p className="mt-5 text-[15px] lg:text-[17px] text-amp-body leading-relaxed max-w-lg">
                Monthly plans, project work and search retainers, with the
                starting figure for each. No form to fill in first.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <Link
                href="/packages"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-amp-ink-pill text-white px-7 py-3.5 text-[13px] font-semibold hover:bg-black transition-colors whitespace-nowrap"
              >
                Packages &amp; pricing
                <span aria-hidden="true">&rarr;</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-amp-hairline-strong/50 bg-white px-7 py-3.5 text-[13px] font-semibold text-black hover:border-black transition-colors whitespace-nowrap"
              >
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </ServicesMotion>
  )
}
