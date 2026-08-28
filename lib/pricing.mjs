/**
 * Single source of truth for everything P2V Labs charges.
 *
 * These figures previously lived in three places - app/packages/page.jsx,
 * the answer copy in components/landing/FAQ.jsx, and a second hand-kept copy
 * inside scripts/gen-pricing-pdf.mjs. Three copies drift, and a pricing page
 * that disagrees with the PDF you emailed is worse than no pricing page.
 * Everything now derives from here.
 *
 * .mjs, not .js: package.json declares no "type", so node parses lib/*.js as
 * CommonJS and the ESM `export` below would be a syntax error when
 * gen-pricing-pdf.mjs imports it. Next resolves .mjs without complaint.
 *
 * `price: null` means "scoped per engagement" - the card renders a phrase
 * instead of a figure and is left out of the Offer JSON-LD, because a null
 * minPrice is invalid structured data.
 */

/* Plans also carry a `short`: the printable PDF lays three tiers side by side
   in fixed columns, so it needs a one-line tagline the web card does not. Two
   lengths, one source - better than the PDF keeping its own copy and drifting,
   which is exactly what it used to do. */

/** Formats a figure the way the site and the PDF both want it. */
export const inr = (n) => `₹${n.toLocaleString('en-IN')}`

/** "From ₹20,000" / "Scoped per project" - one rule, used everywhere. */
export const priceLabel = (p) => (p.price === null ? 'Scoped per project' : `From ${inr(p.price)}`)

const WA_BASE = 'https://wa.me/917048824616?text='
export const waLink = (msg) => WA_BASE + encodeURIComponent(msg)

/* ── Monthly plans ─────────────────────────────────────────────────────────
   A stacking A/B/C ladder: each tier contains the one below it, so the
   buyer's decision stays a single axis.

   Deliberately no longer written as restaurant-only. The copy used to say
   "for restaurants finding their voice" and Plan B's headline deliverable was
   a Zomato/Swiggy shoot, which meant a 1957 tyre retailer or a perfume brand
   could not see themselves anywhere on this page. F&B is still named, as an
   example rather than as the definition. */
export const MONTHLY_PLANS = [
  {
    category: 'Plan A',
    title: 'Social Presence',
    price: 20000,
    cadence: '/ month',
    blurb: 'A dependable monthly cadence of content and community management, for brands still finding their voice.',
    short: 'A reliable monthly cadence of content + community.',
    bullets: [
      '9 photos + 3 reels per month',
      '3-4 stories per week from shoot content',
      'Daily comment & DM replies (business hours)',
    ],
    bestFor: 'Brands establishing a consistent feed',
    wa: 'Hi P2V Labs, I’d like to discuss Plan A - Social Presence. Could we explore details?',
  },
  {
    category: 'Plan B',
    title: 'Social + Reputation',
    price: 30000,
    cadence: '/ month',
    blurb: 'Everything in Plan A, plus the places people check before they buy - your Google profile, your reviews, and your marketplace listings, actively managed.',
    short: 'Everything in Plan A, plus profiles, reviews and local search.',
    bullets: [
      'Everything in Plan A',
      'Google Business Profile management',
      'Marketplace profile shoots + optimisation (Zomato, Swiggy, Amazon)',
      'Review responses across Google and your marketplaces',
    ],
    bestFor: 'Established brands ready to own search and reviews',
    wa: 'Hi P2V Labs, I’d like to discuss Plan B - Social + Reputation. When can we talk?',
  },
  {
    category: 'Plan C',
    title: 'Full Growth Retainer',
    price: 40000,
    cadence: '/ month',
    blurb: 'Everything in Plan B, plus strategy, content calendar, analytics, and priority turnaround - content run as a growth channel.',
    short: 'Everything in Plan B, plus strategy, analytics and priority.',
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

/* ── Search, build & AI visibility ─────────────────────────────────────────
   The half of the business the pricing page was missing entirely. The site's
   own positioning is "built to get you found" and leads arrive citing an AI
   recommendation, but until now a visitor who wanted a website, SEO or AEO
   had nothing on this page to point at. */
export const SEARCH_PACKAGES = [
  {
    category: 'Build',
    title: 'Website + AEO/SEO',
    price: 75000,
    cadence: '/ project',
    blurb: 'A fast, structured site built so both Google and AI answer engines can read it - not a brochure that happens to be online.',
    bullets: [
      'Service pages mapped to real search demand',
      'Technical + on-page SEO from the first commit',
      'Schema and entity markup so AI answers can cite you',
      'Google Business Profile + local search setup',
      'Analytics and Search Console handover',
    ],
    bestFor: 'Businesses invisible in search and AI answers',
    wa: 'Hi P2V Labs, I’d like to discuss a website build with SEO and AEO. Could you share the next steps?',
  },
  {
    category: 'Retainer',
    title: 'Search & AI Visibility',
    price: 25000,
    cadence: '/ month',
    blurb: 'Ongoing work to make you the answer people get - in search results, and in what ChatGPT and Gemini say when someone asks.',
    bullets: [
      'Question and keyword research from real demand',
      'Two optimised articles a month',
      'Schema, entity and citation upkeep',
      'Review and Google Business Profile operations',
      'Monthly rankings + AI-citation report',
    ],
    bestFor: 'Brands that want to be the cited answer',
    wa: 'Hi P2V Labs, I’d like to discuss the Search & AI Visibility retainer. When can we talk?',
  },
  {
    category: 'Automation',
    title: 'GenAI Workflows',
    price: null,
    cadence: '',
    blurb: 'The internal workflows we run on our own studio, built for yours - so your team produces more without hiring for it.',
    bullets: [
      'Audit of where your team actually loses hours',
      'Custom content and reporting pipelines',
      'Draft generation trained on your brand voice',
      'Handover, documentation and team training',
    ],
    bestFor: 'Teams whose output is capped by their headcount',
    wa: 'Hi P2V Labs, I’d like to discuss GenAI workflows for my business. Could we get on a call?',
  },
]

/* ── Project-based ─────────────────────────────────────────────────────────
   One-off shoots. An alternative path rather than a ladder, so nothing here
   is featured. */
export const PROJECT_PACKAGES = [
  {
    category: 'Photography',
    title: 'Food Photography',
    price: 8000,
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

/** Cheapest entry point in a list - lets prose cite a floor without hardcoding it. */
export const minPriceOf = (list) =>
  Math.min(...list.filter((p) => p.price !== null).map((p) => p.price))

/** Look a plan up by tier label, so FAQ copy can name Plan B without an index. */
export const planByCategory = (cat) => MONTHLY_PLANS.find((p) => p.category === cat)
