import Link from 'next/link'
import Hero from '../components/landing/Hero.jsx'
import Marquee from '../components/layout/Marquee.jsx'
import ProofBar from '../components/landing/ProofBar.jsx'
import Positioning from '../components/landing/Positioning.jsx'
import Services from '../components/landing/Services.jsx'
import ReelPreview from '../components/landing/ReelPreview.jsx'
import AboutSection from '../components/landing/AboutSection.jsx'
import FAQ from '../components/landing/FAQ.jsx'
import LeadCapture from '../components/landing/LeadCapture.jsx'
import Rule from '../components/ui/Rule.jsx'
import { websiteJsonLd } from '../lib/seo.js'

/**
 * Landing - Static Site Generation. Rebuilt on deploy and re-validated hourly.
 * The full editorial scroll lives here (Hero → Marquee → ProofBar → Positioning
 * → Services → ReelPreview → About → FAQ → LeadCapture); the closing CTA +
 * footer are global. Each /about, /contact, /packages route also exposes the
 * same section under its own URL for direct linking + SEO.
 */
export const revalidate = 3600


/* WebSite JSON-LD - home page only (per Google's docs). The
   SearchAction tells Google where the site search lives so the
   Sitelinks Searchbox can eventually surface in SERPs for brand
   queries. /search route below backs this. */
const websiteData = websiteJsonLd({ withSearch: true })

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Only WebSite here. The Organization/ProfessionalService node - which
          used to be duplicated on this page as an un-@id'd LocalBusiness -
          is emitted once from the root layout and referenced by @id from
          everywhere else. See lib/seo.js organizationJsonLd(). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Hero />
      <Marquee />
      <ProofBar />
      <Rule />
      <Positioning />
      <section aria-labelledby="aeo-specialty" className="px-5 md:px-10 lg:px-20 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-amp-caption mb-4">Our specialty</p>
          <h2 id="aeo-specialty" className="font-plex text-3xl md:text-4xl font-semibold mb-6">Answer engine optimization, built on strong SEO.</h2>
          <p className="max-w-3xl text-amp-body leading-relaxed mb-8">Answer engine optimization (AEO) helps businesses make their expertise easier to discover and understand in AI search. P2V Labs specializes in AEO and SEO from Ahmedabad, combining technical website improvements, clear answers to customer questions and consistent business information.</p>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div><h3 className="font-semibold mb-3">Make your site discoverable</h3><p className="text-amp-body leading-relaxed">Review crawlability, indexability, canonical URLs and internal links so search engines can find your important pages.</p></div>
            <div><h3 className="font-semibold mb-3">Publish useful answers</h3><p className="text-amp-body leading-relaxed">Explain your services, process and pricing in clear language. Support claims with evidence and keep structured data consistent with visible content.</p></div>
            <div><h3 className="font-semibold mb-3">Measure what changes</h3><p className="text-amp-body leading-relaxed">Track search performance and enquiries alongside repeated checks of relevant AI questions. AI answers vary; rankings and citations are never guaranteed.</p></div>
          </div>
          <Link href="/services/ai-search-visibility" className="inline-block underline underline-offset-4 font-semibold mr-6">Explore our AEO services</Link>
          <Link href="/services/seo" className="inline-block underline underline-offset-4 font-semibold">Explore our SEO services</Link>
        </div>
      </section>
      <Rule />
      <Services />
      <Rule />
      <ReelPreview />
      <Rule />
      <AboutSection />
      <Rule />
      <FAQ />
      <Rule />
      {/* Sits after the FAQ on purpose: objections answered first, then the
          ask. The closing ContactSection CTA and the Footer are rendered
          centrally for every route in RootClient, so they are deliberately
          absent here - see the comment there for why. */}
      <LeadCapture />
    </div>
  )
}
