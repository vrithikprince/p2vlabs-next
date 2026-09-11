import AboutSection from '../../components/landing/AboutSection.jsx'
import WireframeDottedGlobe from '../../components/ui/WireframeDottedGlobe.jsx'
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
      <AboutSection />

      {/* Closing visual. Deliberately carries no reach copy: areaServed in the
          entity graph is Ahmedabad, Gujarat and India, and pairing a world
          globe with a claim about reach would quietly contradict the schema
          the AEO work leans on. The only text is the location, which is
          already the standing line in the hero and the footer. */}
      <section className="px-5 md:px-10 lg:px-20 pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto border-t border-amp-hairline pt-14 lg:pt-20">
          <div className="flex flex-col items-center">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
              Ahmedabad, India
            </p>
            <WireframeDottedGlobe tone="light" className="w-full max-w-[520px] aspect-square" />
          </div>
        </div>
      </section>
    </div>
  )
}
