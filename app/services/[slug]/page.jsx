import Link from 'next/link'
import { notFound } from 'next/navigation'
import Rule from '../../../components/ui/Rule.jsx'
import { SERVICE_MARKS } from '../../../components/illustrations/ServiceMarks.jsx'
import { GridField, Wash, RegMarks, DarkGround } from '../../../components/services/Decor.jsx'
import { SITE_URL, buildPageMetadata, breadcrumbsJsonLd } from '../../../lib/seo.js'
import { SERVICES, serviceBySlug, ACCENT } from '../../../lib/services.mjs'
import { waLink, inr } from '../../../lib/pricing.mjs'

/**
 * /services/[slug] - one page per query cluster.
 *
 * Built from the homepage's vocabulary so the site speaks one language: the
 * drawn service mark at real size, the index numeral as a ghost behind the
 * masthead, hairline rules doing the structure, numbered ruled rows instead
 * of bulleted arrows, and the price stated as a line of type rather than
 * boxed in a widget.
 *
 * Each page is tinted by its own accent - the wash behind the masthead, the
 * rule on the answer, the glow under the price - all driven from the one
 * `rgb` triple on ACCENT. Seven pages that differ by a single variable stay
 * a system; seven pages with hand-picked colours become seven pages.
 *
 * Unchanged on purpose: every piece of schema, the copy, and the URLs. The
 * `answer` field is still the first paragraph AND the meta description,
 * still written self-contained so a model can lift it whole.
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
  const Mark = SERVICE_MARKS[s.mark]
  const url = `${SITE_URL}/services/${s.slug}`

  const crumbs = breadcrumbsJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: s.name },
  ])

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
      { '@type': 'City', name: 'Ahmedabad' },
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
    <div className="pt-16 bg-white" style={{ '--svc-accent': a.rgb }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* ── masthead ─────────────────────────────────────────────────── */}
      <section className="relative px-5 md:px-10 lg:px-20 pt-8 lg:pt-12 pb-10 lg:pb-14 overflow-hidden">
        <GridField />
        {/* Tinted to this service rather than to a fixed palette - it is the
            one thing that makes seven structurally identical pages feel like
            seven subjects instead of one template run seven times. */}
        <Wash rgb={a.rgb} alpha={0.18} size="clamp(300px,36vw,560px)" style={{ top: '-18%', right: '-4%' }} />
        <Wash rgb="0 26 79" alpha={0.09} size="clamp(240px,28vw,440px)" style={{ top: '4%', left: '-6%' }} />
        <RegMarks />

        <div className="max-w-7xl mx-auto relative">
          <nav className="flex items-center gap-2 text-[12px] text-amp-caption mb-8" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-black transition-colors">Services</Link>
            <span aria-hidden="true">/</span>
            <span className="text-black">{s.kicker}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            <div className="lg:col-span-8">
              <p className={`flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase ${a.text} mb-6`}>
                <span className={`w-1.5 h-1.5 rounded-full ${a.dot}`} />
                Service {s.n}
              </p>
              <h1
                className="font-plex font-semibold text-black leading-[0.98] tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2.2rem,6vw,4.6rem)' }}
              >
                {s.h1}
              </h1>
              {/* The query, stated plainly. On a page selling search
                  visibility, showing the target is the proof of method. */}
              <p className="flex items-center gap-2.5 mt-7">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-amp-caption/70">
                  Target query
                </span>
                <span className="h-px w-6 bg-amp-hairline-strong/50" aria-hidden="true" />
                <span className="svc-query text-[12px] md:text-[13px] text-amp-body">{s.query}</span>
              </p>
            </div>

            {/* The mark at real size, not a 24px icon. It is a drawing, and
                letting it be one is most of what stops this reading as a
                template. The disc behind it is the accent as light, giving
                the drawing a ground to sit on rather than floating. */}
            <div className="lg:col-span-4 flex lg:justify-end">
              <div className="relative">
                <span
                  className="pointer-events-none absolute -inset-8 rounded-full"
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle, rgb(${a.rgb} / 0.16), rgb(${a.rgb} / 0) 68%)`,
                    filter: 'blur(18px)',
                  }}
                />
                {Mark && <Mark accent={a.hex} className="relative w-28 lg:w-40 h-auto" />}
              </div>
            </div>
          </div>

          <span
            className="pointer-events-none select-none absolute -left-3 -bottom-16 font-plex font-semibold text-black/[0.035] leading-none"
            style={{ fontSize: 'clamp(9rem,24vw,22rem)' }}
            aria-hidden="true"
          >
            {s.n}
          </span>
        </div>
      </section>

      {/* ── the extractable paragraph, given the room it deserves ─────── */}
      <section className="px-5 md:px-10 lg:px-20 pb-14 lg:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-3xl overflow-hidden">
            <span className={`absolute left-0 top-0 bottom-0 w-[2px] ${a.bg}`} aria-hidden="true" />
            {/* The wash fades out well before the text ends, so the paragraph
                is never read through colour - it only marks where the rule
                is. Tint behind body copy is the fastest way to lose it. */}
            <span
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
              style={{ background: `linear-gradient(90deg, rgb(${a.rgb} / 0.07), rgb(${a.rgb} / 0) 55%)` }}
            />
            <p
              className="relative text-black leading-[1.5] tracking-[-0.01em] pl-6 md:pl-10 py-2"
              style={{ fontSize: 'clamp(1.05rem,2.1vw,1.4rem)' }}
            >
              {s.answer}
            </p>
          </div>
        </div>
      </section>

      <Rule />

      {/* ── what's included: numbered ruled rows, the `.points` idiom ──── */}
      <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-black">
              What&rsquo;s included
            </h2>
            <p className="text-[14px] text-amp-caption leading-relaxed mt-4 max-w-xs">
              {s.bestFor}
            </p>
          </div>

          <ol className="lg:col-span-8 border-t border-amp-hairline">
            {s.includes.map((item, i) => (
              <li
                key={item}
                className="group relative grid grid-cols-[2.5rem_1fr] gap-5 py-5 border-b border-amp-hairline items-baseline"
              >
                <span className="svc-sweep" aria-hidden="true" />
                <span className={`relative font-plex text-[13px] font-semibold ${a.text}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative text-[15px] md:text-[16px] text-amp-body leading-relaxed">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── price as a statement, not a widget ────────────────────────── */}
      <DarkGround rgb={a.rgb}>
        <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-20 py-14 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-white/50 mb-5">
                {s.priceFrom === null ? 'Pricing' : 'Starts at'}
              </p>
              <p
                className="font-plex font-semibold text-white leading-none tracking-[-0.03em]"
                style={{ fontSize: 'clamp(2.6rem,7vw,5rem)' }}
              >
                {s.priceFrom === null ? 'Scoped per project' : inr(s.priceFrom)}
              </p>
              <p className="text-[14px] text-white/60 mt-5">{s.priceNote}</p>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:justify-end gap-3">
              <a
                href={waLink(`Hi P2V Labs, I’d like to discuss ${s.name} for my business. When can we talk?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-7 py-3.5 text-[13px] font-semibold hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Talk it through
                <span aria-hidden="true">&rarr;</span>
              </a>
              <Link
                href="/packages"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white px-7 py-3.5 text-[13px] font-semibold hover:border-white/70 transition-colors whitespace-nowrap"
              >
                Full pricing
              </Link>
            </div>
          </div>
        </div>
      </DarkGround>

      {/* ── questions ─────────────────────────────────────────────────── */}
      {s.faqs?.length > 0 && (
        <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <h2 className="lg:col-span-4 font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-black">
              Questions we get
            </h2>
            <ul className="lg:col-span-8 border-t border-amp-hairline">
              {s.faqs.map(({ q, a: ans }) => (
                <li key={q} className="border-b border-amp-hairline">
                  {/* Native details/summary: zero JS, and the answer stays in
                      the DOM open or shut so a crawler always sees it. */}
                  <details className="group py-6">
                    <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                      <span className="font-plex text-[17px] md:text-[19px] font-semibold text-black leading-snug tracking-[-0.01em]">
                        {q}
                      </span>
                      <span
                        className={`shrink-0 mt-0.5 flex items-center justify-center w-7 h-7 rounded-full border border-amp-hairline text-[16px] ${a.text} group-open:rotate-45 group-open:border-transparent group-hover:border-amp-hairline-strong transition-all duration-300`}
                      >
                        +
                      </span>
                    </summary>
                    <p className="text-[15px] md:text-[16px] text-amp-body leading-relaxed mt-5 pr-8 max-w-2xl">
                      {ans}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── related: same index row language as the hub ───────────────── */}
      {related.length > 0 && (
        <>
          <Rule />
          <section className="px-5 md:px-10 lg:px-20 py-14 lg:py-20">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-baseline justify-between gap-6 pb-5 border-b-2 border-black">
                <h2 className="font-plex text-[13px] font-semibold tracking-[0.16em] uppercase text-black">
                  Often paired with
                </h2>
                <Link href="/services" className="text-[13px] text-amp-caption hover:text-black transition-colors">
                  All services &rarr;
                </Link>
              </div>

              {related.map((r, i) => {
                const ra = ACCENT[r.accent]
                const RMark = SERVICE_MARKS[r.mark]
                return (
                  <Link
                    key={r.slug}
                    href={`/services/${r.slug}`}
                    style={{ '--svc-accent': ra.rgb }}
                    className={`group relative flex items-center gap-6 md:gap-10 py-7 md:py-8 ${
                      i === related.length - 1 ? '' : 'border-b border-amp-hairline'
                    }`}
                  >
                    <span className="svc-sweep" aria-hidden="true" />
                    <span
                      className={`absolute left-0 top-0 bottom-0 w-0 ${ra.bg} transition-all duration-500 ease-out group-hover:w-[3px]`}
                      aria-hidden="true"
                    />
                    <span className="relative font-plex text-[11px] font-semibold tracking-[0.2em] text-amp-caption/60 w-8 shrink-0">
                      {r.n}
                    </span>
                    <div className="relative min-w-0 flex-1">
                      <h3
                        className="font-plex font-semibold text-black leading-tight tracking-[-0.02em]"
                        style={{ fontSize: 'clamp(1.3rem,2.6vw,2rem)' }}
                      >
                        {r.name}
                      </h3>
                      <p className="text-[14px] text-amp-body leading-relaxed mt-1.5 max-w-lg">{r.tagline}</p>
                    </div>
                    <div className="relative hidden lg:block shrink-0 w-[64px] opacity-0 translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                      {RMark && <RMark accent={ra.hex} className="w-full h-auto" />}
                    </div>
                    <span
                      className={`relative shrink-0 hidden md:block text-[18px] ${ra.text} opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0`}
                      aria-hidden="true"
                    >
                      &rarr;
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
