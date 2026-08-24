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
import { websiteJsonLd, SOCIAL_LINKS } from '../lib/seo.js'

/**
 * Landing - Static Site Generation. Rebuilt on deploy and re-validated hourly.
 * The full editorial scroll lives here (Hero → Marquee → ProofBar → Positioning
 * → Services → ReelPreview → About → FAQ → LeadCapture); the closing CTA +
 * footer are global. Each /about, /contact, /packages route also exposes the
 * same section under its own URL for direct linking + SEO.
 */
export const revalidate = 3600

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'P2V Labs',
  /* See Organization schema in lib/seo.js for the rationale -
     same alternates so Google fuses the LocalBusiness (homepage),
     Organization (site-wide), GBP, and IG handle into one entity.
     One-word 'p2vlabs' / 'P2Vlabs' aliases resolve the joined-spelling
     brand query (which otherwise collides with "Physical-to-Virtual"). */
  alternateName: ['p2vlabs', 'P2Vlabs', 'p2v_labs', 'Pixels · Purpose · Visuals'],
  description: 'Visual content agency specialising in video production, product photography, food photography, and social media content.',
  url: 'https://p2vlabs.in',
  telephone: '+917048824616',
  email: 'hello@p2vlabs.in',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 23.0225,
    longitude: 72.5714,
  },
  areaServed: ['Ahmedabad', 'Gujarat', 'India'],
  serviceType: [
    'Video Production',
    'Product Photography',
    'Food Photography',
    'Corporate Films',
    'Brand Reels',
    'Social Media Content',
    'Photography Workshops',
  ],
  priceRange: '₹₹',
  openingHours: 'Mo-Sa 09:00-19:00',
  /* sameAs is shared with the Organization schema in lib/seo.js - single
     source of truth so adding a Facebook/LinkedIn link later only needs
     one edit. */
  sameAs: SOCIAL_LINKS,
  founder: [
    { '@type': 'Person', name: 'Vrithik Prince' },
    { '@type': 'Person', name: 'Payal Chetwani' },
  ],
}

/* WebSite JSON-LD - home page only (per Google's docs). The
   SearchAction tells Google where the site search lives so the
   Sitelinks Searchbox can eventually surface in SERPs for brand
   queries. /search route below backs this. */
const websiteData = websiteJsonLd({ withSearch: true })

export default function HomePage() {
  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
