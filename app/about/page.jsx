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
    <div className="pt-16 bg-white">
      {/* The globe now sits behind the Founded By column rather than in a
          section of its own. It still carries no reach copy: areaServed in
          the entity graph is Ahmedabad, Gujarat and India, and a world globe
          captioned as reach would quietly contradict the schema the AEO work
          leans on. As a backdrop it makes no claim at all. */}
      <AboutSection withGlobe />
    </div>
  )
}
