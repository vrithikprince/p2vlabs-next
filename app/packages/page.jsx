import Footer from '../../components/layout/Footer.jsx'
import PageHeader from '../../components/layout/PageHeader.jsx'
import PricingIllustration from '../../components/illustrations/PricingIllustration.jsx'
import PortalMockup from '../../components/packages/PortalMockup.jsx'
import Rule from '../../components/ui/Rule.jsx'
import { SITE_URL } from '../../lib/seo.js'

/**
 * /packages — pricing page. SSG, no revalidation (pricing changes are deploys).
 *
 * Structure:
 *   1. Hero intro (eyebrow + headline + framing copy)
 *   2. Project-based packages (Food Photography, Brand Reel, Brand Film)
 *   3. Monthly retainers (Standard, Premium)
 *   4. Process — three-step "how we work"
 *   5. Charcoal CTA section ("Not sure which fits?")
 *
 * Each package CTA opens WhatsApp with a *package-specific* prefilled
 * message — qualifies the inbound so the conversation starts on the
 * right package instead of "what are your prices?".
 *
 * Service + Offer JSON-LD on the page so Google can pick up pricing in
 * rich results / knowledge graph. priceSpecification uses minPrice
 * (correct for "starting from") rather than a fixed price.
 */
export const revalidate = false

const WA_BASE = 'https://wa.me/917048824616?text='
const waLink = (msg) => WA_BASE + encodeURIComponent(msg)

const PROJECT_PACKAGES = [
  {
    category: 'Photography',
    title: 'Food Photography',
    price: 8000,
    priceLabel: 'From ₹8,000',
    cadence: '/ shoot',
    blurb: 'Editorial-quality stills built for Zomato, Swiggy, and Instagram. The kind of photography that earns the order.',
    bullets: [
      'Up to 8 dishes / signature plates',
      'Half-day shoot at your venue',
      'Edit, colour, and delivery-ready files',
      'Optimised crops for Zomato / Swiggy / Instagram',
    ],
    bestFor: 'Restaurants · Cafés · Cloud kitchens',
    wa: 'Hi P2V Labs, I’d like to discuss the Food Photography package for my restaurant. When can we talk?',
  },
  {
    category: 'Social Video',
    title: 'Brand Reel',
    price: 8000,
    priceLabel: 'From ₹8,000',
    cadence: '/ reel',
    blurb: 'A single 15–30 second reel — scripted, shot, and cut to convert scroll into engagement.',
    bullets: [
      'Concept, script, and storyboard',
      'Half-day shoot',
      'Edit with sound design and captions',
      'Instagram + YouTube Shorts ready',
    ],
    bestFor: 'New menu drops · Product launches · Campaigns',
    wa: 'Hi P2V Labs, I’d like to discuss a Brand Reel for my brand. Could we get on a call?',
  },
  {
    category: 'Video Production',
    title: 'Brand Film',
    price: 35000,
    priceLabel: 'From ₹35,000',
    cadence: '/ film',
    blurb: 'A 1–2 minute hero film for your website, pitch deck, or ads. Cinematic, intentional, made to last.',
    bullets: [
      '1–2 min film, full concept development',
      'Multi-day shoot with scripted scenes',
      'Edit, colour grade, sound, motion',
      'Master + cutdowns for socials',
    ],
    bestFor: 'Founder narratives · Brand launches · Anchor assets',
    wa: 'Hi P2V Labs, I’d like to discuss a Brand Film for my business. Could you share the next steps?',
  },
]

const RETAINER_PACKAGES = [
  {
    category: 'Social Content',
    title: 'Standard Retainer',
    price: 25000,
    priceLabel: 'From ₹25,000',
    cadence: '/ month',
    blurb: 'A steady monthly cadence of stills and reels — built around one shoot day and a working content calendar.',
    bullets: [
      '10–12 deliverables per month',
      'Mix of stills + 2–3 reels',
      'Single shoot day, monthly calendar',
      'Edits and revisions within scope',
    ],
    bestFor: 'Restaurants or brands needing reliable cadence',
    wa: 'Hi P2V Labs, I’d like to discuss the Standard monthly retainer. Could we explore details?',
  },
  {
    category: 'Social Content + Strategy',
    title: 'Premium Retainer',
    price: 40000,
    priceLabel: 'From ₹40,000',
    cadence: '/ month',
    blurb: 'Strategy plus production. For brands scaling content output and treating their feed like a channel, not a checklist.',
    bullets: [
      'Everything in Standard',
      '4+ reels per month with concepts',
      'Strategy, posting cadence, analytics',
      'Priority turnaround on requests',
    ],
    bestFor: 'Scaling brands · Multi-location restaurants · Series launches',
    wa: 'Hi P2V Labs, I’d like to discuss the Premium monthly retainer for my brand. Could we plan a strategy call?',
  },
]

const PROCESS = [
  { n: '01', title: 'Brief',   detail: 'A short call (or WhatsApp) to align on scope, deliverables, and timelines.' },
  { n: '02', title: 'Shoot',   detail: 'Production day at your venue — set up, capture, on-the-spot review. Tight, fast, deliberate.' },
  { n: '03', title: 'Deliver', detail: 'Edited files in 5–7 working days. Two rounds of revisions within the scope.' },
]

export async function generateMetadata() {
  return {
    title: 'Packages & Pricing — P2V Labs Ahmedabad',
    description:
      'Transparent starting prices for food photography (from ₹8,000), brand reels (from ₹8,000), brand films (from ₹35,000), and monthly social retainers (from ₹25,000). P2V Labs — content built to perform for Ahmedabad brands.',
    alternates: { canonical: '/packages' },
    openGraph: {
      title: 'Packages & Pricing — P2V Labs',
      description:
        'Food photography, brand reels, brand films, monthly retainers — transparent starting prices for Ahmedabad brands.',
      url: '/packages',
    },
  }
}

/* Service + Offer JSON-LD so Google can surface starting prices in
   rich results. minPrice signals "starting from" — using `price` alone
   would imply a fixed cost. */
const buildOffersJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [...PROJECT_PACKAGES, ...RETAINER_PACKAGES].map((p) => ({
    '@type': 'Service',
    name: p.title,
    serviceType: p.category,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'City', name: 'Ahmedabad' },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/packages`,
      priceCurrency: 'INR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: p.price,
        priceCurrency: 'INR',
      },
    },
  })),
})

function PackageCard({ pkg }) {
  return (
    <div
      className="flex flex-col h-full p-7 lg:p-9 border border-charcoal/10 transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: '#FDFCFA',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 28px rgba(26,26,26,0.06)',
      }}
    >
      <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-4">
        {pkg.category}
      </p>
      <h3 className="font-display text-2xl lg:text-3xl font-bold text-charcoal leading-tight mb-3">
        {pkg.title}
      </h3>
      <p className="text-[14px] text-charcoal/60 leading-relaxed mb-6">
        {pkg.blurb}
      </p>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-[9px] tracking-[0.3em] uppercase text-charcoal/40">From</span>
        <span className="font-display text-3xl lg:text-4xl font-bold text-p2v leading-none">
          ₹{pkg.price.toLocaleString('en-IN')}
        </span>
        <span className="text-[11px] text-charcoal/45">{pkg.cadence}</span>
      </div>

      <ul className="space-y-2.5 mb-7 flex-1">
        {pkg.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-[14px] text-charcoal/70 leading-relaxed">
            <span className="text-p2v leading-relaxed flex-shrink-0">→</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="pt-5 mt-auto border-t border-charcoal/10">
        <p className="text-[11px] tracking-[0.1em] uppercase text-charcoal/40 mb-4">
          Best for: <span className="text-charcoal/60 normal-case tracking-normal">{pkg.bestFor}</span>
        </p>
        <a
          href={waLink(pkg.wa)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-5 py-3 bg-charcoal text-cream hover:bg-p2v transition-colors"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium">Discuss this package</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>
    </div>
  )
}

export default function PackagesPage() {
  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOffersJsonLd()) }}
      />

      <PageHeader
        kicker="Pricing"
        title="Transparent starts."
        italic="Scope shapes the rest."
      >
        <PricingIllustration />
      </PageHeader>

      {/* Project-based packages */}
      <section className="py-12 lg:py-20 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-4">
              Project-based
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal leading-tight max-w-2xl">
              One-off shoots, one-off films.
            </h2>
            <p className="mt-4 text-charcoal/50 italic text-sm lg:text-base max-w-2xl leading-relaxed">
              Starting figures — scope shapes the final quote. Every project includes
              production, post, and revisions within scope.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECT_PACKAGES.map((p) => (
              <PackageCard key={p.title} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* Monthly retainers */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-4">
              Monthly retainers
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal leading-tight max-w-2xl">
              Treat your feed like a channel.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RETAINER_PACKAGES.map((p) => (
              <PackageCard key={p.title} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* Premium portal differentiator — editorial mockup of clients.p2vlabs.in
          to justify the ₹40K Premium tier. Sits between retainers and process
          so the reader sees pricing, then sees what Premium uniquely buys. */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-4">
                Inside Premium
              </p>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal leading-tight mb-5">
                A private portal.
                <br />
                <em className="not-italic text-p2v">Not a Drive folder.</em>
              </h2>
              <p className="text-charcoal/60 leading-relaxed text-[15px] mb-8">
                Premium retainers get a dedicated workspace on
                clients.p2vlabs.in. Every shoot, every deliverable, every
                approval lives in one place — no version sprawl, no chasing
                files in WhatsApp threads.
              </p>
              <ul className="space-y-3 border-t border-charcoal/15 pt-6">
                <li className="flex items-start gap-3 text-[14px] text-charcoal/70 leading-relaxed">
                  <span className="text-p2v flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-charcoal font-medium">Asset library.</em>{' '}
                    High-res downloads, available anytime.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-charcoal/70 leading-relaxed">
                  <span className="text-p2v flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-charcoal font-medium">One-click approvals.</em>{' '}
                    Review and sign-off in seconds, synced to WhatsApp.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-charcoal/70 leading-relaxed">
                  <span className="text-p2v flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-charcoal font-medium">Single source of truth.</em>{' '}
                    Shoot schedule, revisions, and status in one view.
                  </span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-8">
              <PortalMockup />
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* Process */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-4">
              How we work
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-charcoal leading-tight max-w-2xl">
              Brief. Shoot. Deliver.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS.map((step) => (
              <div key={step.n} className="border-t border-charcoal/15 pt-6">
                <p className="font-display text-3xl font-bold text-p2v/30 mb-3 leading-none">
                  {step.n}
                </p>
                <h3 className="font-display text-xl font-bold text-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-charcoal/60 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — charcoal section for emphasis */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20 bg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-cream/40 mb-6">
            Not sure which fits?
          </p>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-cream leading-tight mb-8">
            Send the brief.
            <br />
            <em className="not-italic text-p2v">We'll shape the rest.</em>
          </h2>
          <p className="text-cream/60 leading-relaxed text-[15px] max-w-xl mx-auto mb-10">
            Hybrid scopes, multi-deliverable projects, brand systems — talk to us
            and we'll quote against what you actually need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <a
              href={waLink('Hi P2V Labs, I’d like to discuss a project that doesn’t quite fit your standard packages. Can we talk?')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between px-6 py-4 bg-p2v text-cream hover:bg-cream hover:text-charcoal transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">WhatsApp</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="mailto:hello@p2vlabs.in?subject=Project%20inquiry"
              className="flex-1 flex items-center justify-between px-6 py-4 border border-cream/25 text-cream hover:border-cream transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Email</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
