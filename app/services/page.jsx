import Link from 'next/link'
import PageHeader from '../../components/layout/PageHeader.jsx'
import Rule from '../../components/ui/Rule.jsx'
import { SITE_URL, buildPageMetadata, breadcrumbsJsonLd } from '../../lib/seo.js'
import { SERVICES, SERVICE_GROUPS, ACCENT } from '../../lib/services.mjs'
import { inr } from '../../lib/pricing.mjs'

/**
 * /services — the hub.
 *
 * Exists because the site previously had no services route at all: website,
 * SEO and AI-visibility work appeared only as cards on /packages, and the
 * homepage list did not mention them. There was nothing to rank, and nothing
 * for an internal link to point at.
 *
 * The hub's job is two-fold — give each cluster a parent to link up to, and
 * state in one place that this studio does both halves of the work. Both are
 * as much for a crawler as for a reader.
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

export default function ServicesPage() {
  const crumbs = breadcrumbsJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services' },
  ])

  /* ItemList rather than a bare page: it tells a crawler this URL is the
     parent of a set, and names every child with its own URL. That is the
     cheapest way to make a hub legible as a hub. */
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
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHeader
        kicker="Services"
        title="Two halves of the same job."
        italic="Make the work. Make it findable."
      />

      {SERVICE_GROUPS.map((group, gi) => {
        const items = SERVICES.filter((s) => s.kicker === group.kicker)
        return (
          <section key={group.kicker} className="px-5 md:px-10 lg:px-20 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto">
              <div className="mb-10">
                <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${gi === 0 ? 'bg-black' : 'bg-amp-violet'}`} />
                  {group.kicker}
                </p>
                <p className="font-plex text-2xl lg:text-3xl font-semibold text-black leading-tight tracking-[-0.01em] max-w-xl">
                  {group.blurb}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((s) => {
                  const a = ACCENT[s.accent]
                  return (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="group flex flex-col h-full p-7 rounded-[16px] bg-white border border-amp-hairline hover:border-amp-hairline-strong transition-colors"
                    >
                      <h2 className="font-plex text-xl lg:text-2xl font-semibold text-black leading-tight tracking-[-0.01em] mb-3">
                        {s.name}
                      </h2>
                      <p className="text-[14px] text-amp-body leading-relaxed mb-6 flex-1">
                        {s.tagline}
                      </p>
                      <div className="pt-4 border-t border-amp-hairline flex items-baseline justify-between gap-3">
                        <span className="text-[12px] text-amp-caption">
                          {s.priceFrom === null ? 'Scoped per project' : `From ${inr(s.priceFrom)}`}
                        </span>
                        <span className={`text-[10px] font-semibold tracking-[0.12em] uppercase ${a.text}`}>
                          Detail →
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      <Rule />

      <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-plex text-2xl lg:text-3xl font-semibold text-black leading-tight tracking-[-0.01em] mb-4">
            Every price on one page.
          </h2>
          <p className="text-amp-body leading-relaxed mb-7">
            Monthly plans, project work and search retainers, with the starting
            figure for each. No form to fill in first.
          </p>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full bg-amp-ink-pill text-white px-6 py-3 text-[13px] font-semibold hover:bg-black transition-colors"
          >
            See packages &amp; pricing
          </Link>
        </div>
      </section>
    </div>
  )
}
