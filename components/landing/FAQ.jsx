'use client'
import { useState } from 'react'
import {
  MONTHLY_PLANS, SEARCH_PACKAGES, PROJECT_PACKAGES,
  inr, minPriceOf, planByCategory,
} from '../../lib/pricing.mjs'

/**
 * FAQ - frequently asked questions block for the homepage.
 *
 * Two jobs:
 *   1. Address common buyer hesitations (cost, turnaround, scope) before
 *      they hit ContactSection - shorter sales cycles.
 *   2. SEO. FAQPage JSON-LD on a landing page is one of the few schema
 *      types Google still renders as rich results for service businesses,
 *      and the long-tail Q&A text earns "near me / how much / how long"
 *      query matches that the rest of the marketing copy doesn't cover.
 *
 * "Show more" pattern: only the first INITIAL_VISIBLE FAQs render visibly
 * on first paint to keep the landing page lean. The rest are still in the
 * DOM (hidden via a class), so crawlers see every question in the HTML.
 * JSON-LD always includes the full set regardless of UI state - that's
 * what Google uses for the FAQ rich-result eligibility check. The same
 * control toggles back to "Show fewer questions" once expanded, so there's
 * always a way to collapse back to the compact view.
 *
 * Accordion uses native <details>/<summary> so the per-question toggle is
 * zero-JS; the only client-state is the show-more flag.
 */

const FAQS = [
  {
    q: 'What does P2V stand for?',
    a: 'P2V stands for Pixels to Visuals - the journey every brand takes with us, from raw pixels captured on set to finished visuals that build recognition and drive results. The name reflects how we think about content: every frame has a purpose, every visual has a destination. P2V Labs is based in Ahmedabad and works with brands across Gujarat and India.',
  },
  {
    q: 'What does P2V Labs do?',
    a: 'P2V Labs is a visual content agency based in Ahmedabad. We produce brand films, food and product photography, social reels, and corporate video for businesses across Gujarat and India. Most of our work sits in restaurants, D2C brands, and founder-led businesses that need a steady supply of content that actually moves the needle on Instagram, Zomato, and YouTube.',
  },
  {
    q: 'Where are you based, and do you travel for shoots?',
    a: 'We’re based in Ahmedabad and work across Gujarat as our home turf. For brand films, founder narratives, and pan-India campaigns, we travel - Mumbai, Bangalore, Delhi, and destination shoots have all happened. Travel and accommodation are quoted separately so you only pay for what the shoot actually needs.',
  },
  {
    q: 'How much does a video or photography shoot cost?',
    a: `Project pricing starts at ${inr(minPriceOf(PROJECT_PACKAGES))} for a single brand reel or a half-day food photography session, ${inr(PROJECT_PACKAGES[2].price)} for a brand film, and ${inr(minPriceOf(MONTHLY_PLANS))} a month for our entry-tier content plan (Plan A). Final quotes scale with scope, deliverables, and shoot complexity - full breakdown lives on our packages page.`,
  },
  {
    q: 'How long does a project take from brief to delivery?',
    a: 'Reels and photography projects deliver in 5-7 working days from the shoot date. Brand films take 2-3 weeks depending on script complexity and post-production. Monthly plans run on a fixed cadence - one production day per cycle with deliverables rolling out across the month.',
  },
  {
    q: 'Do you work with restaurants and food brands?',
    a: 'Yes - food photography and restaurant social content is one of our core areas, and we’ve worked with 150+ restaurants on Zomato- and Swiggy-optimised stills, brand reels, and monthly content calendars. It isn’t all we do: the same production and search work runs for retail, automotive, D2C product brands, and founder-led personal brands.',
  },
  {
    q: 'What’s included in a monthly content plan?',
    a: `Plans run a three-tier ladder. Plan A (${inr(planByCategory('Plan A').price)}/mo) covers 9 photos + 3 reels a month plus daily community management. Plan B (${inr(planByCategory('Plan B').price)}/mo) adds Google Business Profile management, marketplace profile optimisation, and review responses. Plan C (${inr(planByCategory('Plan C').price)}/mo) layers strategy, content calendar, analytics, 4+ reels, priority turnaround, and a private client portal at clients.p2vlabs.in for approvals and asset downloads.`,
  },
  /* Added with the search/build offering. "How much does a website cost in
     Ahmedabad" and "how do I get my business into ChatGPT answers" are the
     exact queries this studio wants to be the answer to, and until the
     packages page carried those services there was nothing to answer with. */
  {
    q: 'How much does a website with SEO cost?',
    a: `A website build with technical SEO and AEO starts at ${inr(SEARCH_PACKAGES[0].price)}. That covers service pages mapped to real search demand, schema and entity markup so AI answer engines can cite you, Google Business Profile setup, and analytics handover. Ongoing search and AI visibility work runs from ${inr(SEARCH_PACKAGES[1].price)} a month.`,
  },
  {
    q: 'Can you get my business recommended by ChatGPT and AI search?',
    a: 'That is what answer engine optimisation (AEO) is, and it is a large part of what we do. It means structuring your site so language models can parse what you offer, publishing content that actually answers the questions people ask, and building the citations and entity signals those systems draw on. We built p2vlabs.in on the same approach - our own enquiries now include people who found us because an AI recommended us.',
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
    <section id="faq" className="bg-white py-16 lg:py-24 px-5 md:px-10 lg:px-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-12 lg:mb-16">
          <div className="lg:col-span-4">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-black" />
              FAQ
            </p>
            <h2
              className="font-plex font-semibold text-black leading-[1.08] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(2rem,4.5vw,3.25rem)' }}
            >
              The questions
              <br />
              <em className="not-italic text-black">we hear most.</em>
            </h2>
          </div>
          <div className="lg:col-span-8 flex items-end">
            <p className="text-amp-body leading-relaxed text-[15px] md:text-base max-w-xl">
              Pricing, turnaround, scope, and increasingly SEO, AEO, and
              GenAI workflows - the things every brief eventually asks once
              the shoot itself stops being the hard part. We've answered
              these enough times to know exactly where a project usually
              gets stuck, so what's below are the real answers, not the
              sales-page version. If your question still isn’t here, send
              it on WhatsApp and we’ll answer the same day.
            </p>
          </div>
        </div>

        <ul className="border-t border-amp-hairline">
          {FAQS.map(({ q, a }, i) => {
            /* Items past INITIAL_VISIBLE stay in the DOM (so crawlers see
               them) but are hidden via the `hidden` attribute until the
               user clicks "Show more". */
            const hidden = !showAll && i >= INITIAL_VISIBLE
            return (
              <li key={q} className={hidden ? 'hidden' : ''}>
                <details className="faq-item group border-b border-amp-hairline">
                  <summary className="flex items-start gap-5 md:gap-8 py-6 lg:py-7 cursor-pointer list-none select-none transition-colors hover:text-amp-navy">
                    <span className="text-[10px] tracking-[0.3em] uppercase text-amp-caption font-medium pt-1.5 flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-plex font-semibold text-lg md:text-xl lg:text-2xl text-black leading-snug flex-1 group-hover:text-amp-navy transition-colors">
                      {q}
                    </span>
                    <span
                      className="relative w-4 h-4 flex-shrink-0 mt-2.5 text-amp-caption group-hover:text-amp-navy transition-colors"
                      aria-hidden="true"
                    >
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-current" />
                      <span className="faq-vertical absolute left-1/2 top-0 -translate-x-1/2 w-px h-4 bg-current origin-center transition-transform duration-200" />
                    </span>
                  </summary>
                  <div className="pl-[3.25rem] md:pl-[4rem] pr-8 pb-7 lg:pb-8 -mt-1">
                    <p className="text-amp-body leading-relaxed text-[14px] md:text-[15px] max-w-3xl">
                      {a}
                    </p>
                  </div>
                </details>
              </li>
            )
          })}
        </ul>

        {/* Show more / show less toggle - same control flips between the
            two states rather than disappearing once expanded, so there's
            always a way back to the compact 3-question view. */}
        {remaining > 0 && (
          <div className="mt-10 lg:mt-12 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase font-medium text-black hover:text-amp-navy transition-colors group"
            >
              <span className="w-10 h-px bg-black/40 group-hover:bg-amp-navy transition-colors" />
              <span>
                {showAll ? 'Show fewer questions' : `Show ${remaining} more ${remaining === 1 ? 'question' : 'questions'}`}
              </span>
              <span
                aria-hidden="true"
                className={`transition-transform group-hover:translate-y-0.5 ${showAll ? 'rotate-180' : ''}`}
              >
                ↓
              </span>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
