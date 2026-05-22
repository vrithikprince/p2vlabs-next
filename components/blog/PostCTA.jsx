'use client'
import { useState } from 'react'
import LeadFormModal from '../ui/LeadFormModal.jsx'

/**
 * End-of-post conversion block. Mounted at the bottom of every
 * /blog/[slug] and /vlog/[slug] page. Three contact paths:
 *
 *   1. "Send a brief" → opens LeadFormModal (structured intake)
 *   2. "WhatsApp"     → wa.me with a pre-filled hint
 *   3. "Email"        → mailto: hello@p2vlabs.in
 *
 * `source` is stamped on the resulting Supabase lead row so we can
 * attribute conversions back to specific posts in analytics.
 */
export default function PostCTA({ kind = 'blog', slug, title }) {
  const [open, setOpen] = useState(false)
  const source = `${kind}:${slug || 'unknown'}`

  /* Pre-fill the WhatsApp message with the post title so the founder's
     phone shows what triggered the click. URL-encoded inline. */
  const waText = encodeURIComponent(
    `Hi P2V Labs — I just read "${title || 'your latest post'}" on p2vlabs.in. I'd love to chat about a project.`
  )
  const waUrl = `https://wa.me/917048824616?text=${waText}`

  return (
    <>
      <aside className="px-5 md:px-10 mt-16 md:mt-20 max-w-3xl mx-auto">
        <div className="border border-bone/12 p-7 md:p-10 bg-ink/[0.025]">

          <p className="text-[10px] tracking-[0.4em] uppercase text-bone/45 mb-4">
            {kind === 'vlog' ? 'Liked this film?' : 'Liked this read?'}
          </p>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-bone leading-tight mb-5">
            Got a project in mind?{' '}
            <em className="not-italic text-amber">We'd love to hear about it.</em>
          </h2>

          <p className="text-bone/60 leading-relaxed mb-7 max-w-lg">
            We take on a small number of projects every month. The faster you brief us,
            the better we can plan around your timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:flex-wrap">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-between gap-3 px-5 py-4 bg-bone text-ink hover:bg-amber transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Send a brief</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between gap-3 px-5 py-4 border border-bone/20 text-bone hover:border-bone/50 transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">WhatsApp us</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>

            <a
              href="mailto:hello@p2vlabs.in"
              className="inline-flex items-center justify-between gap-3 px-5 py-4 border border-bone/20 text-bone hover:border-bone/50 transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Email</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

        </div>
      </aside>

      <LeadFormModal open={open} onClose={() => setOpen(false)} source={source} />
    </>
  )
}
