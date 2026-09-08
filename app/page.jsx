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
