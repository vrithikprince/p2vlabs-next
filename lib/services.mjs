/**
 * The service cluster — one entry per query cluster the site should own.
 *
 * Why this exists: until now the site had no /services route at all. Website,
 * SEO and AI-visibility work appeared only as cards on /packages, and the
 * homepage service list did not mention them. You cannot rank for a service
 * you have no page for, so those queries had nothing to land on.
 *
 * One page per cluster, generated from this file. Adding a service is an entry
 * here, not a new route — which is also what keeps the hub, the detail pages,
 * the Service JSON-LD and the sitemap from drifting apart.
 *
 * On slugs: clean (`/services/seo`), with the geography in the title, H1 and
 * copy rather than the URL. Exact-match-in-URL is a thin, ageing signal and it
 * makes every URL longer for the non-local services.
 *
 * `answer` is the most important field. It is the first paragraph of the page
 * AND the thing an answer engine lifts, so it must be self-contained: name the
 * business, the service, the city and the number, without depending on the
 * heading above it for meaning.
 *
 * .mjs to match lib/pricing.mjs — package.json declares no "type", so a
 * standalone node script importing this would choke on ESM in a .js file.
 */

import { MONTHLY_PLANS, SEARCH_PACKAGES, PROJECT_PACKAGES, inr } from './pricing.mjs'

const plan  = (cat)   => MONTHLY_PLANS.find((p) => p.category === cat)
const search = (title) => SEARCH_PACKAGES.find((p) => p.title === title)
const proj  = (title) => PROJECT_PACKAGES.find((p) => p.title === title)

export const SERVICES = [
  /* ── content ──────────────────────────────────────────────────────── */
  {
    slug: 'video-production',
    name: 'Video Production',
    h1: 'Video production in Ahmedabad',
    kicker: 'Content',
    accent: 'navy',
    query: 'video production Ahmedabad',
    tagline: 'Brand films, product launches and founder narratives.',
    answer: `P2V Labs produces brand films, product launches, founder narratives and corporate video from Ahmedabad, working across Gujarat and India. A single brand reel starts at ${inr(proj('Brand Reel').price)} and a 1–2 minute brand film at ${inr(proj('Brand Film').price)}, including concept, script, shoot, edit, colour and sound.`,
    includes: [
      'Concept, script and storyboard before anyone picks up a camera',
      'Multi-day shoots with scripted scenes where the story needs them',
      'Edit, colour grade, sound design and motion graphics',
      'A master cut plus platform cutdowns for social',
    ],
    bestFor: 'Brand launches, founder narratives, anchor assets for a website or pitch deck',
    priceFrom: proj('Brand Reel').price,
    priceNote: `from ${inr(proj('Brand Reel').price)} per reel · brand films from ${inr(proj('Brand Film').price)}`,
    faqs: [
      { q: 'How much does a brand film cost in Ahmedabad?',
        a: `A 1–2 minute brand film from P2V Labs starts at ${inr(proj('Brand Film').price)}. That covers concept development, a multi-day shoot with scripted scenes, edit, colour grade, sound and motion, plus cutdowns for social. A single 15–30 second brand reel starts at ${inr(proj('Brand Reel').price)}.` },
      { q: 'How long does a brand film take?',
        a: 'Brand films take two to three weeks from brief to final cut, depending on script complexity and post-production. Single reels and photography deliver in five to seven working days from the shoot date.' },
    ],
    related: ['photography', 'social-content'],
  },
  {
    slug: 'photography',
    name: 'Photography',
    h1: 'Product and food photography in Ahmedabad',
    kicker: 'Content',
    accent: 'violet',
    query: 'product photography Ahmedabad',
    tagline: 'Product, editorial and food photography built for where it will be used.',
    answer: `P2V Labs shoots product, editorial and food photography in Ahmedabad. A half-day food photography session covering up to eight dishes starts at ${inr(proj('Food Photography').price)}, delivered with crops optimised for Zomato, Swiggy and Instagram rather than one set of files you have to re-crop yourself.`,
    includes: [
      'Up to 8 dishes or products per half-day session',
      'Shot at your venue, with on-the-spot review',
      'Edit, colour and delivery-ready files',
      'Platform-specific crops, not a single master you have to cut down',
    ],
    bestFor: 'Restaurants, cafés and cloud kitchens · D2C product brands · menu and catalogue refreshes',
    priceFrom: proj('Food Photography').price,
    priceNote: `from ${inr(proj('Food Photography').price)} per shoot`,
    faqs: [
      { q: 'How much does food photography cost in Ahmedabad?',
        a: `A half-day food photography session with P2V Labs starts at ${inr(proj('Food Photography').price)} and covers up to eight dishes, shot at your venue. That includes editing, colour and files cropped for Zomato, Swiggy and Instagram.` },
      { q: 'Do you shoot at our restaurant or in a studio?',
        a: 'At your venue, in almost every case. Food photographed where it is made, plated by the people who plate it every day, looks like what the customer actually receives — which is the point.' },
    ],
    related: ['video-production', 'social-content'],
  },
  {
    slug: 'social-content',
    name: 'Social Content',
    h1: 'Social media content for brands in Ahmedabad',
    kicker: 'Content',
    accent: 'periwinkle',
    query: 'social media agency Ahmedabad',
    tagline: 'A dependable monthly cadence, not a burst of posts and silence.',
    answer: `P2V Labs runs monthly social content for brands in Ahmedabad, from ${inr(plan('Plan A').price)} a month. A plan covers a set number of photos and reels, stories from the shoot footage, and daily comment and DM replies — so the feed keeps moving without anyone in your team owning it.`,
    includes: [
      'A fixed monthly cadence of photos and reels',
      'Stories through the week, cut from the same shoot',
      'Daily comment and DM replies in business hours',
      'Higher tiers add Google Business Profile, reviews and strategy',
    ],
    bestFor: 'Brands that need consistency more than they need one brilliant post',
    priceFrom: plan('Plan A').price,
    priceNote: `from ${inr(plan('Plan A').price)} per month`,
    faqs: [
      { q: 'How much does a social media agency cost in Ahmedabad?',
        a: `Monthly social content from P2V Labs starts at ${inr(plan('Plan A').price)} a month for 9 photos and 3 reels plus daily community management. ${inr(plan('Plan B').price)} a month adds Google Business Profile management and review responses; ${inr(plan('Plan C').price)} adds strategy, a content calendar, analytics and a client portal.` },
      { q: 'Do you post on our behalf or just deliver the files?',
        a: 'Both are possible. Plans include posting and daily community management in business hours; if you would rather your own team publishes, we hand over scheduled, captioned, correctly-cropped files.' },
    ],
    related: ['photography', 'seo'],
  },

  /* ── search & web ─────────────────────────────────────────────────── */
  {
    slug: 'website-development',
    name: 'Website Development',
    h1: 'Website development in Ahmedabad, built to be found',
    kicker: 'Search & web',
    accent: 'navy',
    query: 'website development Ahmedabad',
    tagline: 'A fast, structured site — not a brochure that happens to be online.',
    answer: `P2V Labs builds websites in Ahmedabad from ${inr(search('Website + AEO/SEO').price)}, with technical SEO and structured data from the first commit rather than bolted on afterwards. That includes service pages mapped to real search demand, schema markup so AI answer engines can read and cite the site, Google Business Profile setup, and analytics handover.`,
    includes: [
      'Service pages mapped to what people actually search for',
      'Technical and on-page SEO from the first commit',
      'Schema and entity markup so AI answers can cite you',
      'Google Business Profile and local search setup',
      'Analytics and Search Console handed over to you, in your account',
    ],
    bestFor: 'Businesses whose current site is invisible in search, or who have no site at all',
    priceFrom: search('Website + AEO/SEO').price,
    priceNote: `from ${inr(search('Website + AEO/SEO').price)} per project`,
    faqs: [
      { q: 'How much does a website cost in Ahmedabad?',
        a: `A website build from P2V Labs starts at ${inr(search('Website + AEO/SEO').price)}. That is a complete build with technical SEO, structured data, service pages mapped to search demand, Google Business Profile setup and analytics handover. Ongoing search work runs separately from ${inr(search('Search & AI Visibility').price)} a month.` },
      { q: 'Do I need a mobile app as well as a website?',
        a: 'Usually not. For most local and service businesses a progressive web app — installable, works offline, sends notifications — does the same job as a native app for a fraction of the cost, and unlike an app it can be found in search. We will say so rather than sell you two codebases you do not need.' },
    ],
    related: ['seo', 'ai-search-visibility'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    h1: 'SEO services in Ahmedabad',
    kicker: 'Search & web',
    accent: 'violet',
    query: 'SEO services Ahmedabad',
    tagline: 'Technical foundations, local search, and content that answers real queries.',
    answer: `P2V Labs runs SEO for businesses in Ahmedabad from ${inr(search('Search & AI Visibility').price)} a month, covering technical fixes, structured data, Google Business Profile and local citations, and a monthly publishing cadence built from real search demand. Work is reported against Search Console data in your own account, not a dashboard only we can see.`,
    includes: [
      'Technical audit and fixes — crawlability, speed, canonicals, structured data',
      'Keyword and question research from actual demand, not guesswork',
      'Google Business Profile, reviews and local citation consistency',
      'Two optimised articles a month against the query clusters that matter',
      'Monthly reporting from your own Search Console',
    ],
    bestFor: 'Businesses that rank for their own name and nothing else',
    priceFrom: search('Search & AI Visibility').price,
    priceNote: `from ${inr(search('Search & AI Visibility').price)} per month`,
    faqs: [
      { q: 'How much do SEO services cost in Ahmedabad?',
        a: `SEO with P2V Labs starts at ${inr(search('Search & AI Visibility').price)} a month, covering technical work, local search, structured data and two optimised articles a month. A one-off technical build or rebuild starts at ${inr(search('Website + AEO/SEO').price)}.` },
      { q: 'How long does SEO take to show results?',
        a: 'Three to six months before movement is meaningful, and we will say so before you sign rather than after. Technical fixes and Google Business Profile work can shift local visibility faster; competitive rankings do not. Anyone promising faster is selling you something else.' },
    ],
    related: ['ai-search-visibility', 'website-development'],
  },
  {
    slug: 'ai-search-visibility',
    name: 'AI Search Visibility',
    /* Titled for the query people type. Roughly 46% of buyers search "AI
       search optimization" and only ~3% search "AEO" — so the acronym belongs
       in the copy, where it shows fluency, not in the H1 where it costs
       traffic. */
    h1: 'AI search visibility — getting cited by ChatGPT and AI answers',
    kicker: 'Search & web',
    accent: 'periwinkle',
    query: 'AI search optimization India',
    tagline: 'Being the answer, not just a link in a list.',
    answer: `P2V Labs works on AI search visibility — also called answer engine optimisation or AEO — from ${inr(search('Search & AI Visibility').price)} a month. When someone asks ChatGPT, Gemini or Perplexity for a recommendation instead of searching Google, the engine names a handful of businesses and cites its sources. Getting into that shortlist needs a clean entity record, quotable answers, and third-party corroboration — a different job from ranking.`,
    includes: [
      'One consolidated entity record: schema, aliases, and profiles that agree',
      'Content written to be extracted — self-contained answers a model can quote',
      'Third-party corroboration: business profiles, directories, reviews, citations',
      'Prompt-set measurement — a citation rate across repeated runs, not a screenshot',
      'Honest reporting, including the runs where you did not appear',
    ],
    bestFor: 'Businesses whose buyers have started asking an AI before they search',
    priceFrom: search('Search & AI Visibility').price,
    priceNote: `from ${inr(search('Search & AI Visibility').price)} per month`,
    faqs: [
      { q: 'Can you get my business recommended by ChatGPT?',
        a: 'Nobody can guarantee it, and anyone who does is guessing — answer engines are non-deterministic, and the same question asked twice returns different answers. What can be done is make you the kind of source they cite: one clean entity record, content written so a model can lift a self-contained answer, and independent sources that corroborate what you say about yourself. We measure it as a citation rate across repeated runs rather than a single screenshot.' },
      { q: 'Is AEO different from SEO?',
        a: 'They share most of their plumbing — both need a fast, crawlable site a machine can read without running JavaScript. They diverge on extractability. SEO gets you into a ranked list of links; AEO gets a passage of your page quoted inside a generated answer with your name attached. The second rewards being unambiguously the right thing to point at.' },
    ],
    related: ['seo', 'website-development'],
  },
  {
    slug: 'genai-automation',
    name: 'GenAI Automation',
    h1: 'GenAI workflows and automation for businesses',
    kicker: 'Search & web',
    accent: 'violet',
    query: 'GenAI automation for business India',
    tagline: 'The internal workflows we run on our own studio, built for yours.',
    answer: 'P2V Labs builds custom GenAI workflows for businesses — content pipelines, lead-response automation, reporting, and internal tools that take repetitive work off a small team. Scoped per engagement rather than sold as a package, because the useful version depends entirely on where your team actually loses hours.',
    includes: [
      'An audit of where the team actually loses hours — before building anything',
      'Custom content and reporting pipelines',
      'Draft generation trained on your own brand voice',
      'Handover, documentation and training so it does not depend on us',
    ],
    bestFor: 'Teams whose output is capped by headcount rather than by demand',
    priceFrom: null,
    priceNote: 'scoped per engagement',
    faqs: [
      { q: 'What does a GenAI workflow actually do?',
        a: 'It removes a repetitive step a person is currently doing by hand — drafting captions from a shoot list, turning a month of data into a client report, triaging and replying to inbound enquiries. We audit where the hours actually go first, because most teams guess wrong about which task is costing them most.' },
    ],
    related: ['ai-search-visibility', 'social-content'],
  },
]

export const serviceBySlug = (slug) => SERVICES.find((s) => s.slug === slug)

/** Groups for the hub page, in the order they should read. */
export const SERVICE_GROUPS = [
  { kicker: 'Content',      blurb: 'What we shoot, cut and publish.' },
  { kicker: 'Search & web', blurb: 'What makes sure anyone sees it.' },
]

/* Tailwind needs literal class strings, so accents map here rather than being
   built from the `accent` key at render time. */
export const ACCENT = {
  navy:       { text: 'text-amp-navy',       bg: 'bg-amp-navy',       dot: 'bg-amp-navy',       hex: '#001a4f' },
  violet:     { text: 'text-amp-violet',     bg: 'bg-amp-violet',     dot: 'bg-amp-violet',     hex: '#a273ff' },
  periwinkle: { text: 'text-amp-periwinkle', bg: 'bg-amp-periwinkle', dot: 'bg-amp-periwinkle', hex: '#6980ff' },
}
