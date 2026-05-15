import Services from '../../components/landing/Services.jsx'
import Footer from '../../components/layout/Footer.jsx'

/** /packages — SSG. Currently mirrors the Landing-page Services block 1:1
 *  (Video Production / Photography / Social Content / Brand Visuals). Pricing
 *  tiers will be added as a separate iteration. */
export const revalidate = false

export async function generateMetadata() {
  return {
    title: 'Packages & Services',
    description:
      'P2V Labs services — video production, product and food photography, social media content, and brand visual identity. Cinematic craft, data-driven strategy, built for brands in Ahmedabad and across India.',
    alternates: { canonical: '/packages' },
    openGraph: {
      title: 'Packages & Services — P2V Labs',
      url: 'https://www.p2vlabs.in/packages',
    },
  }
}

export default function PackagesPage() {
  return (
    <div className="pt-16">
      <Services />
      <Footer />
    </div>
  )
}
