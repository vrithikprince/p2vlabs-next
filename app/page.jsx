import Hero from '../components/landing/Hero.jsx'
import Marquee from '../components/layout/Marquee.jsx'
import Services from '../components/landing/Services.jsx'
import ReelPreview from '../components/landing/ReelPreview.jsx'
import AboutSection from '../components/landing/AboutSection.jsx'
import ContactSection from '../components/landing/ContactSection.jsx'
import Footer from '../components/layout/Footer.jsx'
import Rule from '../components/ui/Rule.jsx'

/**
 * Landing — Static Site Generation. Rebuilt on deploy and re-validated hourly.
 * The full editorial scroll lives here (Hero → Marquee → Services → ReelPreview
 * → About → Contact → Footer); each /about, /contact, /packages route also
 * exposes the same section under its own URL for direct linking + SEO.
 */
export const revalidate = 3600

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'P2V Labs',
  description: 'Visual content agency specialising in video production, product photography, food photography, and social media content.',
  url: 'https://www.p2vlabs.in',
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
  sameAs: [
    'https://www.instagram.com/p2vlabs',
    'https://www.linkedin.com/company/p2vlabs',
  ],
  founder: [
    { '@type': 'Person', name: 'Vrithik Prince' },
    { '@type': 'Person', name: 'Payal Chetwani' },
    { '@type': 'Person', name: 'Palash Karamchandani' },
  ],
}

export default function HomePage() {
  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero />
      <Marquee />
      <Services />
      <Rule />
      <ReelPreview />
      <Rule />
      <AboutSection />
      <Rule />
      <ContactSection />
      <Footer />
    </div>
  )
}
