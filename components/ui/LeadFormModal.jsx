'use client'
import { useEffect } from 'react'
import LeadForm from './LeadForm.jsx'

/**
 * Modal wrapper for LeadForm. Triggered by PostCTA on /blog/[slug] +
 * /vlog/[slug]. Locks body scroll while open and closes on ESC.
 */
export default function LeadFormModal({ open, onClose, source, defaultServices }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal/85 flex items-start md:items-center justify-center p-3 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-cream w-full max-w-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 md:px-10 py-5 border-b border-charcoal/10">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal/45">
              Tell us about your project
            </p>
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal mt-1">
              Send a brief
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-charcoal/5 transition-colors shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-6 md:px-10 py-7 md:py-9">
          <LeadForm
            source={source}
            defaultServices={defaultServices}
            onSuccess={() => setTimeout(onClose, 4000)}
          />
        </div>
      </div>
    </div>
  )
}
