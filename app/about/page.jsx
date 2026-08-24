import AboutSection from '../../components/landing/AboutSection.jsx'

/** /about - SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return {
    title: 'About P2V Labs',
    description:
      'Meet the team behind P2V Labs - Vrithik Prince and Payal Chetwani. A visual content agency combining data intelligence with cinematic storytelling.',
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
    </div>
  )
}
