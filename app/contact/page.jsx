import ContactSection from '../../components/landing/ContactSection.jsx'
import LeadForm from '../../components/ui/LeadForm.jsx'
import Footer from '../../components/layout/Footer.jsx'

/** /contact — SSG. Only rebuilds on deploy. */
export const revalidate = false

export async function generateMetadata() {
  return {
    title: 'Contact P2V Labs',
    description:
      'Get in touch with P2V Labs — a visual content agency based in Ahmedabad. Send a project brief, WhatsApp us, or drop an email. We reply within 24 hours.',
    alternates: { canonical: '/contact' },
    openGraph: {
      title: 'Contact P2V Labs',
      url:   '/contact',
    },
  }
}

export default function ContactPage() {
  return (
    <div className="pt-16">
      <ContactSection />

      {/* Structured project-brief form — primary lead capture surface.
          Posts to public.leads (RLS allows anon INSERT only). */}
      <section className="py-20 md:py-24 px-5 md:px-10 lg:px-20 bg-ink">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-bone/45 mb-5">
            Send a project brief
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-bone leading-tight mb-5">
            The more you tell us,<br />
            <em className="not-italic text-amber">the sharper our first reply.</em>
          </h2>
          <p className="text-bone/55 leading-relaxed mb-12 max-w-xl">
            Two minutes of detail saves us a back-and-forth and gets you a real, considered
            response from one of the founders — usually within a working day.
          </p>

          <LeadForm source="contact-page" />
        </div>
      </section>

      <Footer />
    </div>
  )
}
