import PageHeader from '../../components/layout/PageHeader.jsx'
import PricingIllustration from '../../components/illustrations/PricingIllustration.jsx'
import PortalMockup from '../../components/packages/PortalMockup.jsx'
import Rule from '../../components/ui/Rule.jsx'
import { SITE_URL } from '../../lib/seo.js'

/**
 * /packages - pricing page. SSG, no revalidation (pricing changes are deploys).
 *
 * Structure:
 *   1. Hero intro (eyebrow + headline + framing copy)
 *   2. Monthly plans (Plan A / B / C - bundled content + reputation tiers)
 *   3. Project-based packages (Food Photography, Brand Reel, Brand Film)
 *   4. Plan C portal differentiator (editorial mockup)
 *   5. Process - three-step "how we work"
 *   6. Dark ink CTA section ("Not sure which fits?")
 *
 * Amp design system: white canvas painted on the page wrapper (the global
 * body ground is not the amp ground), IBM Plex Sans throughout, hairline
 * cards. Accents are rare - navy carries the Plan C thread (featured tier
 * card + the portal section that justifies it), periwinkle marks the
 * process numerals. Every other tier stays monochrome; that contrast IS
 * the hierarchy signal, so nothing else on the page may take a colour.
 *
 * Each package CTA opens WhatsApp with a *package-specific* prefilled
 * message - qualifies the inbound so the conversation starts on the
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
    blurb: 'A single 15-30 second reel - scripted, shot, and cut to convert scroll into engagement.',
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
    blurb: 'A 1-2 minute hero film for your website, pitch deck, or ads. Cinematic, intentional, made to last.',
    bullets: [
      '1-2 min film, full concept development',
      'Multi-day shoot with scripted scenes',
      'Edit, colour grade, sound, motion',
      'Master + cutdowns for socials',
    ],
    bestFor: 'Founder narratives · Brand launches · Anchor assets',
    wa: 'Hi P2V Labs, I’d like to discuss a Brand Film for my business. Could you share the next steps?',
  },
]

/* Bundled monthly plans - replace the two-tier retainer + à la carte add-on
   pricing. Each plan stacks the previous one's deliverables (Plan B includes
   Plan A, Plan C includes Plan B) so the buyer's decision is a clean A/B/C
   ladder. Mirrors the same data in scripts/gen-pricing-pdf.mjs. */
const MONTHLY_PLANS = [
  {
    category: 'Plan A',
    title: 'Social Presence',
    price: 20000,
    priceLabel: 'From ₹20,000',
    cadence: '/ month',
    blurb: 'A reliable monthly cadence of content + community management for restaurants finding their voice.',
    bullets: [
      '9 photos + 3 reels per month',
      '3-4 stories per week from shoot content',
      'Daily comment & DM replies (business hours)',
    ],
    bestFor: 'Restaurants establishing a consistent feed',
    wa: 'Hi P2V Labs, I’d like to discuss Plan A - Social Presence. Could we explore details?',
  },
  {
    category: 'Plan B',
    title: 'Social + Reputation',
    price: 30000,
    priceLabel: 'From ₹30,000',
    cadence: '/ month',
    blurb: 'Everything in Plan A, plus your Zomato / Swiggy footprint and Google Business presence - actively managed.',
    bullets: [
      'Everything in Plan A',
      'Zomato / Swiggy profile shoot & optimisation',
      'Google Business Profile management',
      'Review responses (Google + Zomato + Swiggy)',
    ],
    bestFor: 'Established brands ready to own search + reviews',
    wa: 'Hi P2V Labs, I’d like to discuss Plan B - Social + Reputation. When can we talk?',
  },
  {
    category: 'Plan C',
    title: 'Full Growth Retainer',
    price: 40000,
    priceLabel: 'From ₹40,000',
    cadence: '/ month',
    blurb: 'Everything in Plan B, plus strategy, content calendar, analytics, and priority turnaround - content as a growth channel.',
    bullets: [
      'Everything in Plan B',
      'Strategy + content calendar + analytics',
      '4+ reels per month with concepts',
      'Priority turnaround on requests',
      'Private client portal access',
    ],
    bestFor: 'Scaling brands treating content as a growth channel',
    wa: 'Hi P2V Labs, I’d like to discuss Plan C - Full Growth Retainer. Could we plan a strategy call?',
  },
]

const PROCESS = [
  { n: '01', title: 'Brief',   detail: 'A short call (or WhatsApp) to align on scope, deliverables, and timelines.' },
  { n: '02', title: 'Shoot',   detail: 'Production day at your venue - set up, capture, on-the-spot review. Tight, fast, deliberate.' },
  { n: '03', title: 'Deliver', detail: 'Edited files in 5-7 working days. Two rounds of revisions within the scope.' },
]

export async function generateMetadata() {
  return {
    title: 'Packages & Pricing - P2V Labs Ahmedabad',
    description:
      'Transparent starting prices for food photography (from ₹8,000), brand reels (from ₹8,000), brand films (from ₹35,000), and monthly content + reputation plans (from ₹20,000). P2V Labs - content built to perform for Ahmedabad brands.',
    alternates: { canonical: '/packages' },
    openGraph: {
      title: 'Packages & Pricing - P2V Labs',
      description:
        'Food photography, brand reels, brand films, monthly content + reputation plans - transparent starting prices for Ahmedabad brands.',
      url: '/packages',
    },
  }
}

/* Service + Offer JSON-LD so Google can surface starting prices in
   rich results. minPrice signals "starting from" - using `price` alone
   would imply a fixed cost. */
const buildOffersJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [...PROJECT_PACKAGES, ...MONTHLY_PLANS].map((p) => ({
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

/* `featured` is purely a styling flag - the recommended tier gets the
   plan ladder's accent (navy hairline, navy figures, elevation) and every
   other card stays flat monochrome. Colour is doing the ranking here, so
   only ever one card in a grid may be featured. Navy is the ladder's
   accent only; the process section below carries its own (periwinkle). */
function PackageCard({ pkg, featured = false }) {
  return (
    <div
      className={`flex flex-col h-full p-7 lg:p-9 rounded-[16px] bg-white border transition-transform duration-300 hover:-translate-y-1 ${
        featured
          ? 'border-amp-navy/30 shadow-[0_16px_40px_-16px_rgba(0,26,79,0.18)]'
          : 'border-amp-hairline'
      }`}
    >
      <p className={`text-[11px] font-semibold tracking-[0.08em] uppercase mb-4 ${featured ? 'text-amp-navy' : 'text-amp-caption'}`}>
        {pkg.category}
      </p>
      <h3 className="font-plex text-2xl lg:text-3xl font-semibold text-black leading-tight tracking-[-0.01em] mb-3">
        {pkg.title}
      </h3>
      <p className="text-[14px] text-amp-body leading-relaxed mb-6">
        {pkg.blurb}
      </p>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-amp-caption">From</span>
        <span className={`font-plex text-3xl lg:text-4xl font-semibold leading-none tracking-[-0.01em] ${featured ? 'text-amp-navy' : 'text-black'}`}>
          ₹{pkg.price.toLocaleString('en-IN')}
        </span>
        <span className="text-[11px] text-amp-caption">{pkg.cadence}</span>
      </div>

      <ul className="space-y-2.5 mb-7 flex-1">
        {pkg.bullets.map((b) => (
          <li key={b} className="flex gap-2.5 text-[14px] text-amp-body leading-relaxed">
            <span className={`leading-relaxed flex-shrink-0 ${featured ? 'text-amp-navy' : 'text-amp-caption'}`}>→</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div className="pt-5 mt-auto border-t border-amp-hairline">
        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-4">
          Best for: <span className="text-amp-body font-normal normal-case tracking-normal">{pkg.bestFor}</span>
        </p>
        <a
          href={waLink(pkg.wa)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-between px-5 py-3 rounded-full bg-amp-ink-pill text-white hover:bg-black transition-colors"
        >
          <span className="text-[13px] font-semibold">Discuss this package</span>
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
    <div className="pt-16 bg-white">
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

      {/* Monthly plans - primary commerce surface. Lead with the
          recurring revenue offer; one-off shoots follow as a secondary
          path for prospects who aren't ready for a monthly commitment. */}
      <section className="py-12 lg:py-20 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
              Monthly plans
            </p>
            <h2 className="font-plex text-3xl lg:text-4xl font-semibold text-black leading-[1.08] tracking-[-0.01em] max-w-2xl">
              Three ways to grow.
            </h2>
            <p className="mt-4 text-amp-body text-sm lg:text-base max-w-2xl leading-relaxed">
              Pick one bundle a month - content cadence, reputation, and
              strategy scale together as you climb tiers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan C is the recommended tier and the only accented card in
                the ladder - it is also the one the portal section below
                exists to justify. */}
            {MONTHLY_PLANS.map((p) => (
              <PackageCard key={p.title} pkg={p} featured={p.category === 'Plan C'} />
            ))}
          </div>
        </div>
      </section>

      <Rule />

      {/* Project-based packages - secondary path for one-off shoots. */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            {/* No featured card here - one-off packages are alternatives,
                not a ladder, so the whole grid stays monochrome. */}
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              Project-based
            </p>
            <h2 className="font-plex text-3xl lg:text-4xl font-semibold text-black leading-[1.08] tracking-[-0.01em] max-w-2xl">
              One-off shoots, one-off films.
            </h2>
            <p className="mt-4 text-amp-body text-sm lg:text-base max-w-2xl leading-relaxed">
              Starting figures - scope shapes the final quote. Every project includes
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

      {/* Plan C differentiator - editorial mockup of clients.p2vlabs.in to
          justify the ₹40K top tier. Sits between the plans and the process
          so the reader sees pricing, then sees what Plan C uniquely buys. */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              {/* Same navy as the featured Plan C card above, so the tier
                  and its differentiator read as one thread. */}
              <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
                Inside Plan C
              </p>
              <h2 className="font-plex text-3xl lg:text-4xl font-semibold text-black leading-[1.08] tracking-[-0.01em] mb-5">
                A private portal.
                <br />
                <em className="not-italic text-black">Not a Drive folder.</em>
              </h2>
              <p className="text-amp-body leading-relaxed text-[15px] mb-8">
                Plan C clients get a dedicated workspace on
                clients.p2vlabs.in. Every shoot, every deliverable, every
                approval lives in one place - no version sprawl, no chasing
                files in WhatsApp threads.
              </p>
              <ul className="space-y-3 border-t border-amp-hairline pt-6">
                <li className="flex items-start gap-3 text-[14px] text-amp-body leading-relaxed">
                  <span className="text-amp-navy flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-black font-semibold">Asset library.</em>{' '}
                    High-res downloads, available anytime.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-amp-body leading-relaxed">
                  <span className="text-amp-navy flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-black font-semibold">One-click approvals.</em>{' '}
                    Review and sign-off in seconds, synced to WhatsApp.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-[14px] text-amp-body leading-relaxed">
                  <span className="text-amp-navy flex-shrink-0">→</span>
                  <span>
                    <em className="not-italic text-black font-semibold">Single source of truth.</em>{' '}
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
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-periwinkle" />
              How we work
            </p>
            <h2 className="font-plex text-3xl lg:text-4xl font-semibold text-black leading-[1.08] tracking-[-0.01em] max-w-2xl">
              Brief. Shoot. Deliver.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {PROCESS.map((step) => (
              <div key={step.n} className="border-t border-amp-hairline pt-6">
                {/* Periwinkle is this section's own accent - kept off navy so
                    the process steps never read as a fourth pricing tier. */}
                <p className="font-plex text-3xl font-semibold text-amp-periwinkle mb-3 leading-none tracking-[-0.01em]">
                  {step.n}
                </p>
                <h3 className="font-plex text-xl font-semibold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-[14px] text-amp-body leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA - dark ink section for emphasis. Deliberately the one
          fully monochrome block on the page: the accents already did their
          work above, and the inversion is emphasis enough here. */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20 bg-amp-ink-pill">
        <div className="max-w-4xl mx-auto text-center">
          <p className="flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-white/55 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            Not sure which fits?
          </p>
          <h2 className="font-plex text-3xl lg:text-5xl font-semibold text-white leading-[1.08] tracking-[-0.01em] mb-8">
            Send the brief.
            <br />
            <em className="not-italic text-white">We'll shape the rest.</em>
          </h2>
          <p className="text-white/70 leading-relaxed text-[15px] max-w-xl mx-auto mb-10">
            Hybrid scopes, multi-deliverable projects, brand systems - talk to us
            and we'll quote against what you actually need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            {/* primary CTA, inverted - on the ink ground the near-black pill
                would vanish, so white carries the fill instead. */}
            <a
              href={waLink('Hi P2V Labs, I’d like to discuss a project that doesn’t quite fit your standard packages. Can we talk?')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between px-6 py-4 rounded-full bg-white text-black hover:bg-white/90 transition-colors"
            >
              <span className="text-[14px] font-semibold">WhatsApp</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="mailto:hello@p2vlabs.in?subject=Project%20inquiry"
              className="flex-1 flex items-center justify-between px-6 py-4 rounded-full border border-white/25 text-white hover:border-white transition-colors"
            >
              <span className="text-[14px] font-semibold">Email</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
