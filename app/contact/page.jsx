import ContactSection from '../../components/landing/ContactSection.jsx'
import Footer from '../../components/layout/Footer.jsx'

/** /contact — SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return {
    title: 'Contact P2V Labs',
    description:
      'Get in touch with P2V Labs — a visual content agency based in Ahmedabad serving brands across Gujarat and India. Email, WhatsApp, and project enquiries.',
    alternates: { canonical: '/contact' },
    openGraph: {
      title: 'Contact P2V Labs',
      url: 'https://www.p2vlabs.in/contact',
    },
  }
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />
      <Footer />
    </div>
  )
}
