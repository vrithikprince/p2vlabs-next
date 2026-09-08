import ContactSection from '../../components/landing/ContactSection.jsx'
import LeadForm from '../../components/ui/LeadForm.jsx'
import { buildPageMetadata } from '../../lib/seo.js'

/** /contact - SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return buildPageMetadata({
    title: 'Contact P2V Labs',
    description:
      'Get in touch with P2V Labs - a content and search visibility studio in Ahmedabad. Send a project brief, WhatsApp us, or drop an email. We reply within 24 hours.',
    path: '/contact',
  })
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />

      {/* Structured project-brief form - primary lead capture surface.
          Posts to public.leads (RLS allows anon INSERT only). */}
      {/* font-plex on the section: LeadForm below already sets it on its own
          root, so without it the eyebrow and lede above rendered in the base
          Inter while the form beneath them was Plex - one block, two faces.
          Rhythm is the system's py-16 lg:py-24, not the old py-20 md:py-24. */}
      <section className="font-plex py-16 lg:py-24 px-5 md:px-10 lg:px-20 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Violet dot - same eyebrow marker PageHeader gives the other
              inner pages, so /contact opens in their voice. The heading
              itself stays monochrome. */}
          <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
            Send a project brief
          </p>
          <h2 className="font-plex text-4xl md:text-5xl font-semibold text-black leading-tight tracking-[-0.01em] mb-5">
            The more you tell us,<br />
            <em className="not-italic text-black">the sharper our first reply.</em>
          </h2>
          <p className="text-amp-body leading-relaxed mb-12 max-w-xl">
            Two minutes of detail saves us a back-and-forth and gets you a real, considered
            response from one of the founders - usually within a working day.
          </p>

          <LeadForm source="contact-page" />
        </div>
      </section>

    </div>
  )
}
