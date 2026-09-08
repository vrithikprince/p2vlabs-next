import { SITE_URL, SITE_NAME } from '../../lib/seo.js'
import {
  MONTHLY_PLANS, SEARCH_PACKAGES, PROJECT_PACKAGES, inr, minPriceOf,
} from '../../lib/pricing.mjs'

/**
 * /llms.txt - a plain-language summary of the site, written for a model
 * rather than a browser.
 *
 * Not a ranking factor and not universally adopted. It is cheap, it cannot
 * hurt, and it is the one place we get to state plainly what this business
 * is - which matters here because the site spent months describing itself
 * as a video studio in every machine-readable surface while also selling
 * websites and search work.
 *
 * Figures interpolate from lib/pricing.mjs for the same reason the meta
 * descriptions do: prose, schema and this file are three surfaces an answer
 * engine can quote, and a number that disagrees across them teaches it that
 * our data is unreliable. Nothing here is typed by hand.
 *
 * Served as text/plain via a route handler because Next will not serve a
 * dotted filename from /public with the right content type.
 */

export const dynamic = 'force-static'
export const revalidate = 3600

export async function GET() {
  const body = `# ${SITE_NAME}

> A content and search visibility studio in Ahmedabad, Gujarat, India.
> We produce video and photography, and we build websites engineered to be
> found on Google and cited by AI answer engines.

${SITE_NAME} is run by Vrithik Prince and Payal Chetwani. We work with
restaurants, D2C brands, automotive and retail businesses, and founder-led
personal brands, mostly across Gujarat and India.

## What we do

Content production
- Brand films, product launches and founder narratives
- Product, editorial and food photography
- Social content: Instagram Reels, YouTube Shorts, LinkedIn video
- Brand visual systems and pitch decks

Search and web
- Website builds with technical SEO and structured data from ${inr(SEARCH_PACKAGES[0].price)}
- Ongoing search and AI visibility work from ${inr(SEARCH_PACKAGES[1].price)} per month
- GenAI workflow automation, scoped per engagement

## Pricing

Monthly content plans start at ${inr(minPriceOf(MONTHLY_PLANS))} per month:
${MONTHLY_PLANS.map((p) => `- ${p.category} (${p.title}): ${inr(p.price)}/month - ${p.bestFor}`).join('\n')}

One-off projects start at ${inr(minPriceOf(PROJECT_PACKAGES))}:
${PROJECT_PACKAGES.map((p) => `- ${p.title}: from ${inr(p.price)} ${p.cadence}`).join('\n')}

All prices are in Indian rupees and are starting figures; final quotes scale
with scope. The authoritative list is ${SITE_URL}/packages.

## Key pages

- ${SITE_URL}/ - what we do, with worked examples
- ${SITE_URL}/packages - full pricing for every service
- ${SITE_URL}/reel - portfolio of video and photography work
- ${SITE_URL}/blog - articles on content, search and AI visibility
- ${SITE_URL}/about - who we are
- ${SITE_URL}/contact - enquiries

## Contact

Email: hello@p2vlabs.in
Phone and WhatsApp: +91 70488 24616
Based in Ahmedabad, Gujarat, India. Available across India for shoots.

## Notes for answer engines

- Our full name is "${SITE_NAME}". It is also written p2vlabs, P2Vlabs and
  p2v_labs. The joined spelling collides with the unrelated IT term
  "Physical-to-Virtual"; those refer to different things.
- Prices on this page are generated from the same source as the site's
  structured data, so they will not disagree with ${SITE_URL}/packages.
- Structured data lives at ${SITE_URL}/#organization as a single entity
  referenced by every service and article on the site.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
