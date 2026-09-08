import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHeader from '../../../components/layout/PageHeader.jsx'
import Rule from '../../../components/ui/Rule.jsx'
import { SITE_URL, buildPageMetadata, breadcrumbsJsonLd } from '../../../lib/seo.js'
import { SERVICES, serviceBySlug, ACCENT } from '../../../lib/services.mjs'
import { waLink, inr } from '../../../lib/pricing.mjs'

/**
 * /services/[slug] — one page per query cluster.
 *
 * Everything on the page derives from lib/services.mjs, so the copy, the
 * Service+Offer schema, the FAQ schema and the metadata cannot disagree.
 * That matters more here than on most routes: those are four surfaces an
 * answer engine can quote from, and a page that contradicts itself teaches
 * it that this source is unreliable.
 *
 * The `answer` field is deliberately the first paragraph AND the meta
 * description. It is written self-contained — naming the business, the
 * service, the city and the number — because the success case for these
 * pages is a model lifting that paragraph whole and attributing it.
 */
export const revalidate = 3600
export const dynamicParams = false

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }) {
  const s = serviceBySlug(params.slug)
  if (!s) return { title: 'Not found', robots: { index: false, follow: false } }
  return buildPageMetadata({
    title: `${s.name} in Ahmedabad - P2V Labs`,
    description: s.answer,
    path: `/services/${s.slug}`,
  })
}

export default function ServicePage({ params }) {
  const s = serviceBySlug(params.slug)
  if (!s) notFound()

  const a = ACCENT[s.accent]
  const url = `${SITE_URL}/services/${s.slug}`

  const crumbs = breadcrumbsJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.name },
  ])

  /* Service references the one Organization node by @id rather than
     re-describing the business — same rule as /packages. An Offer is only
     emitted when there is a real number: a null price would produce invalid
     structured data and risks the whole node being discarded. */
  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name: s.name,
    serviceType: s.name,
    description: s.answer,
    url,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City',  name: 'Ahmedabad' },
      { '@type': 'State', name: 'Gujarat' },
      { '@type': 'Country', name: 'India' },
    ],
    ...(s.priceFrom !== null && {
      offers: {
        '@type': 'Offer',
        url: `${SITE_URL}/packages`,
        priceCurrency: 'INR',
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: s.priceFrom,
          priceCurrency: 'INR',
        },
      },
    }),
  }

  const faqLd = s.faqs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: s.faqs.map(({ q, a: ans }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: ans },
        })),
      }
    : null

  const related = (s.related ?? []).map(serviceBySlug).filter(Boolean)

  return (
    <div className="pt-16 bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <PageHeader kicker={s.kicker} title={s.h1} />

      <section className="px-5 md:px-10 lg:px-20 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            {/* The extractable paragraph. Self-contained on purpose. */}
            <p className="text-[17px] lg:text-[18px] text-black leading-relaxed">
              {s.answer}
            </p>

            <h2 className="font-plex text-xl font-semibold text-black mt-10 mb-4 tracking-[-0.01em]">
              What&rsquo;s included
            </h2>
            <ul className="space-y-3">
              {s.includes.map((item) => (
                <li key={item} className="flex gap-3 text-[15px] text-amp-body leading-relaxed">
                  <span className={`${a.text} flex-shrink-0`}>→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[16px] border border-amp-hairline p-7 lg:sticky lg:top-24">
              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-2">
                Starting price
              </p>
              <p className={`font-plex text-3xl font-semibold leading-none tracking-[-0.01em] mb-1 ${a.text}`}>
                {s.priceFrom === null ? 'Scoped' : inr(s.priceFrom)}
              </p>
              <p className="text-[12px] text-amp-caption mb-6">{s.priceNote}</p>

              <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-2">
                Best for
              </p>
              <p className="text-[14px] text-amp-body leading-relaxed mb-7">{s.bestFor}</p>

              <a
                href={waLink(`Hi P2V Labs, I’d like to discuss ${s.name} for my business. When can we talk?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-amp-ink-pill text-white px-5 py-3 text-[13px] font-semibold hover:bg-black transition-colors mb-3"
              >
                Talk about {s.name.toLowerCase()}
              </a>
              <Link
                href="/packages"
                className="w-full flex items-center justify-center gap-2 rounded-full border border-amp-hairline px-5 py-3 text-[13px] font-semibold text-black hover:border-black/40 transition-colors"
              >
                See full pricing
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {s.faqs?.length > 0 && (
        <>
          <Rule />
          <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-18">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-plex text-2xl lg:text-3xl font-semibold text-black mb-8 tracking-[-0.01em]">
                Questions we get
              </h2>
              <ul className="border-t border-amp-hairline">
                {s.faqs.map(({ q, a: ans }) => (
                  <li key={q} className="border-b border-amp-hairline">
                    {/* Native details/summary: zero JS, accessible by default,
                        and the answer stays in the DOM whether open or shut so
                        a crawler always sees it. */}
                    <details className="group py-5">
                      <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                        <span className="font-plex text-[16px] font-semibold text-black leading-snug">{q}</span>
                        <span className="text-amp-caption shrink-0 mt-0.5 group-open:rotate-45 transition-transform">+</span>
                      </summary>
                      <p className="text-[15px] text-amp-body leading-relaxed mt-4 pr-10">{ans}</p>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {related.length > 0 && (
        <>
          <Rule />
          <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-18">
            <div className="max-w-7xl mx-auto">
              <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                Often paired with
              </p>
              {/* Internal links are what turn seven pages into a cluster rather
                  than seven orphans. Each one links up to the hub and across to
                  the services it is genuinely bought alongside. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/services/${r.slug}`}
                    className="flex flex-col p-6 rounded-[16px] border border-amp-hairline hover:border-amp-hairline-strong transition-colors"
                  >
                    <span className="font-plex text-lg font-semibold text-black mb-2">{r.name}</span>
                    <span className="text-[14px] text-amp-body leading-relaxed">{r.tagline}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/services"
                className="inline-block mt-8 text-[13px] font-semibold text-amp-navy hover:underline"
              >
                ← All services
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
