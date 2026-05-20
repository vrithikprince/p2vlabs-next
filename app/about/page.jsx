import AboutSection from '../../components/landing/AboutSection.jsx'
import Footer from '../../components/layout/Footer.jsx'

/** /about — SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return {
    title: 'About P2V Labs',
    description:
      'Meet the team behind P2V Labs — Vrithik Prince, Payal Chetwani, and Palash Karamchandani. A visual content agency combining data intelligence with cinematic storytelling.',
    alternates: { canonical: '/about' },
    openGraph: {
      title: 'About P2V Labs',
      url: '/about',
    },
  }
}

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
      <Footer />
    </div>
  )
}
