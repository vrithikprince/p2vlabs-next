import AboutSection from '../../components/landing/AboutSection.jsx'
import { buildPageMetadata } from '../../lib/seo.js'

/** /about - SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'About P2V Labs',
    description:
      'Meet the team behind P2V Labs - Vrithik Prince and Payal Chetwani. A content and search visibility studio in Ahmedabad combining production craft with the technical work that gets it found.',
    path: '/about',
  })
}

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
    </div>
  )
}
