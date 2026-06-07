'use client'
import { useState } from 'react'

/**
 * FAQ — frequently asked questions block for the homepage.
 *
 * Two jobs:
 *   1. Address common buyer hesitations (cost, turnaround, scope) before
 *      they hit ContactSection — shorter sales cycles.
 *   2. SEO. FAQPage JSON-LD on a landing page is one of the few schema
 *      types Google still renders as rich results for service businesses,
 *      and the long-tail Q&A text earns "near me / how much / how long"
 *      query matches that the rest of the marketing copy doesn't cover.
 *
 * "Show more" pattern: only the first INITIAL_VISIBLE FAQs render visibly
 * on first paint to keep the landing page lean. The rest are still in the
 * DOM (hidden via a class), so crawlers see all six questions in the HTML.
 * JSON-LD always includes the full set regardless of UI state — that's
 * what Google uses for the FAQ rich-result eligibility check.
 *
 * Accordion uses native <details>/<summary> so the per-question toggle is
 * zero-JS; the only client-state is the show-more flag.
 */

const FAQS = [
  {
    q: 'What does P2V stand for?',
    a: 'P2V stands for Pixels to Visuals — the journey every brand takes with us, from raw pixels captured on set to finished visuals that build recognition and drive results. The name reflects how we think about content: every frame has a purpose, every visual has a destination. P2V Labs is based in Ahmedabad and works with brands across Gujarat and India.',
  },
  {
    q: 'What does P2V Labs do?',
    a: 'P2V Labs is a visual content agency based in Ahmedabad. We produce brand films, food and product photography, social reels, and corporate video for businesses across Gujarat and India. Most of our work sits in restaurants, D2C brands, and founder-led businesses that need a steady supply of content that actually moves the needle on Instagram, Zomato, and YouTube.',
  },
  {
    q: 'Where are you based, and do you travel for shoots?',
    a: 'We’re based in Ahmedabad and work across Gujarat as our home turf. For brand films, founder narratives, and pan-India campaigns, we travel — Mumbai, Bangalore, Delhi, and destination shoots have all happened. Travel and accommodation are quoted separately so you only pay for what the shoot actually needs.',
  },
  {
    q: 'How much does a video or photography shoot cost?',
    a: 'Project pricing starts at ₹8,000 for a single brand reel or a half-day food photography session, ₹35,000 for a brand film, and ₹25,000 for monthly social content retainers. Final quotes scale with scope, deliverables, and shoot complexity — full breakdown lives on our packages page.',
  },
  {
    q: 'How long does a project take from brief to delivery?',
    a: 'Reels and photography projects deliver in 5–7 working days from the shoot date. Brand films take 2–3 weeks depending on script complexity and post-production. Monthly retainers run on a fixed cadence — one production day per cycle with deliverables rolling out across the month.',
  },
  {
    q: 'Do you work with restaurants and food brands?',
    a: 'Yes — food photography and restaurant social content is one of our core areas. We’ve worked with 150+ restaurants on Zomato- and Swiggy-optimised stills, brand reels, and monthly content calendars. Most of our retainer roster is food and beverage, so the workflow, lighting, and turnaround is built around that pace.',
  },
  {
    q: 'What’s included in a monthly content retainer?',
    a: 'A standard retainer covers 10–12 deliverables per month — a mix of stills and 2–3 reels — produced on a single shoot day with a working content calendar. Premium retainers add strategy, a higher reel volume, analytics, and a private client portal at clients.p2vlabs.in for approvals and asset downloads.',
  },
]

const INITIAL_VISIBLE = 3

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export default function FAQ() {
  const [showAll, setShowAll] = useState(false)
  const remaining = FAQS.length - INITIAL_VISIBLE

  return (
    <section id="faq" className="py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12 lg:mb-16">
          <div className="lg:col-span-4">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/45 mb-5">
              FAQ
            </p>
            <h2
              className="font-display font-bold text-charcoal leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2rem,4.5vw,3.25rem)' }}
            >
              The questions
              <br />
              <em className="not-italic text-p2v">we hear most.</em>
            </h2>
          </div>
          <div className="lg:col-span-8 flex items-end">
            <p className="text-charcoal/55 leading-relaxed text-[15px] md:text-base max-w-xl">
              Pricing, turnaround, scope, the things every brief eventually
              asks. If your question isn’t here, send it on WhatsApp and
              we’ll answer the same day.
            </p>
          </div>
        </div>

        <ul className="border-t border-charcoal/15">
          {FAQS.map(({ q, a }, i) => {
            /* Items past INITIAL_VISIBLE stay in the DOM (so crawlers see
               them) but are hidden via the `hidden` attribute until the
               user clicks "Show more". */
            const hidden = !showAll && i >= INITIAL_VISIBLE
            return (
              <li key={q} className={hidden ? 'hidden' : ''}>
                <details className="faq-item group border-b border-charcoal/15">
                  <summary className="flex items-start gap-5 md:gap-8 py-6 lg:py-7 cursor-pointer list-none select-none transition-colors hover:text-p2v">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-charcoal/35 font-medium pt-1.5 flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-display text-lg md:text-xl lg:text-2xl text-charcoal leading-snug flex-1 group-hover:text-p2v transition-colors">
                      {q}
                    </span>
                    <span
                      className="relative w-4 h-4 flex-shrink-0 mt-2.5 text-charcoal/45 group-hover:text-p2v transition-colors"
                      aria-hidden="true"
                    >
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-current" />
                      <span className="faq-vertical absolute left-1/2 top-0 -translate-x-1/2 w-px h-4 bg-current origin-center transition-transform duration-200" />
                    </span>
                  </summary>
                  <div className="pl-[3.25rem] md:pl-[4rem] pr-8 pb-7 lg:pb-8 -mt-1">
                    <p className="text-charcoal/65 leading-relaxed text-[14px] md:text-[15px] max-w-3xl">
                      {a}
                    </p>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>

        {/* Show-more control. Disappears once expanded — there's no
            "Show less" because the page already scrolls long; collapsing
            mid-page would make the user lose their scroll position. */}
        {!showAll && remaining > 0 && (
          <div className="mt-10 lg:mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-medium text-charcoal hover:text-p2v transition-colors group"
            >
              <span className="w-10 h-px bg-charcoal/40 group-hover:bg-p2v transition-colors" />
              <span>Show {remaining} more {remaining === 1 ? 'question' : 'questions'}</span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">↓</span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
