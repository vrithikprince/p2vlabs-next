import Link from 'next/link'
import Rule from '../../components/ui/Rule.jsx'
import { SERVICE_MARKS } from '../../components/illustrations/ServiceMarks.jsx'
import { SITE_URL, buildPageMetadata, breadcrumbsJsonLd } from '../../lib/seo.js'
import { SERVICES, SERVICE_GROUPS, ACCENT } from '../../lib/services.mjs'
import { inr } from '../../lib/pricing.mjs'

/**
 * /services — the hub, as an editorial index rather than a card grid.
 *
 * The first version of this page was three columns of identical rounded
 * cards. It ranked fine and looked like every Tailwind template ever
 * shipped, which is a real cost for a studio selling design.
 *
 * This uses the vocabulary the homepage already established and this page
 * had ignored: index numerals, the drawn service marks, hairline rules
 * doing the structural work, and a giant ghost numeral bleeding off the
 * edge. Seven equal cards give a reader no hierarchy and no rhythm; seven
 * full-bleed numbered rows read as an index, scan faster, and let the
 * typography carry weight a 320px card never can.
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

function IndexRow({ s, last }) {
  const a = ACCENT[s.accent]
  const Mark = SERVICE_MARKS[s.mark]

  return (
    <Link
      href={`/services/${s.slug}`}
      className={`group relative block ${last ? '' : 'border-b border-amp-hairline'}`}
    >
      {/* The accent creeps in from the left on hover rather than the whole row
          filling - a 96px-tall block of navy would shout, and the point is
          that the index stays calm until you address one line of it. */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-0 ${a.bg} transition-all duration-500 ease-out group-hover:w-[3px]`}
        aria-hidden="true"
      />

      <div className="flex items-center gap-6 md:gap-10 py-7 md:py-9 pl-0 md:pl-6 transition-[padding] duration-500 ease-out group-hover:pl-4 md:group-hover:pl-10">
        <span className="font-plex text-[11px] font-semibold tracking-[0.2em] text-amp-caption/60 w-8 shrink-0 pt-1">
          {s.n}
        </span>

        <div className="min-w-0 flex-1">
          <h3
            className="font-plex font-semibold text-black leading-[1.05] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(1.6rem,3.6vw,2.9rem)' }}
          >
            {s.name}
          </h3>
          <p className="text-[14px] md:text-[15px] text-amp-body leading-relaxed mt-2 max-w-xl">
            {s.tagline}
          </p>
        </div>

        {/* The drawn mark, held back until hover on desktop so the index reads
            as type first. Always visible on touch, where there is no hover. */}
        <div className="hidden lg:block shrink-0 w-[76px] opacity-0 translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0">
          {Mark && <Mark accent={a.hex} className="w-full h-auto" />}
        </div>

        <div className="shrink-0 text-right w-[104px] md:w-[132px]">
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
          →
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
    <div className="pt-16 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      {/* ── masthead: type at a scale the old PageHeader would not allow ── */}
      <section className="relative px-5 md:px-10 lg:px-20 pt-10 lg:pt-16 pb-10 lg:pb-14 overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
            Services
          </p>
          <h1
            className="font-plex font-semibold text-black leading-[0.94] tracking-[-0.035em] max-w-[16ch]"
            style={{ fontSize: 'clamp(2.6rem,8vw,6.2rem)' }}
          >
            Make the work.
            <br />
            <span className="text-amp-violet">Make it findable.</span>
          </h1>
          <p className="mt-8 text-[16px] lg:text-[18px] text-amp-body leading-relaxed max-w-xl">
            Seven things, in two halves. One half puts something worth finding
            into the world. The other makes sure a search engine — and whatever
            people ask instead of one — can actually see it.
          </p>

          <span
            className="pointer-events-none select-none absolute -right-4 -bottom-14 font-plex font-semibold text-black/[0.035] leading-none"
            style={{ fontSize: 'clamp(9rem,22vw,20rem)' }}
            aria-hidden="true"
          >
            07
          </span>
        </div>
      </section>

      {/* ── the index ── */}
      {SERVICE_GROUPS.map((group) => {
        const items = SERVICES.filter((s) => s.kicker === group.kicker)
        return (
          <section key={group.kicker} className="px-5 md:px-10 lg:px-20 pb-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-6 pt-10 pb-5 border-b-2 border-black">
                <h2 className="font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-black">
                  {group.kicker}
                </h2>
                <p className="text-[13px] text-amp-caption text-right">{group.blurb}</p>
              </div>
              {items.map((s, i) => (
                <IndexRow key={s.slug} s={s} last={i === items.length - 1} />
              ))}
            </div>
          </section>
        )
      })}

      <Rule />

      <section className="px-5 md:px-10 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7">
            <h2
              className="font-plex font-semibold text-black leading-[1.02] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)' }}
            >
              Every price on one page.
            </h2>
            <p className="mt-4 text-amp-body leading-relaxed max-w-lg">
              Monthly plans, project work and search retainers, with the
              starting figure for each. No form to fill in first.
            </p>
          </div>
          <div className="lg:col-span-5 lg:text-right">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-full bg-amp-ink-pill text-white px-7 py-3.5 text-[13px] font-semibold hover:bg-black transition-colors"
            >
              Packages &amp; pricing
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
