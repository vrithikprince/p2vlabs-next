'use client'
import { useState } from 'react'
import { saveLead } from '../../app/actions/saveLead.js'

const SERVICES = [
  { id: 'video',       label: 'Video Production' },
  { id: 'photography', label: 'Photography' },
  { id: 'social',      label: 'Social Content' },
  { id: 'brand',       label: 'Brand Visuals' },
]

const BUDGETS = [
  { id: 'under-50k', label: 'Under ₹50K' },
  { id: '50k-1l',    label: '₹50K - ₹1L' },
  { id: '1l-3l',     label: '₹1L - ₹3L' },
  { id: '3l-plus',   label: '₹3L+' },
  { id: 'discuss',   label: 'Open to discuss' },
]

const TIMELINES = [
  { id: 'asap',         label: 'ASAP' },
  { id: 'within-month', label: 'Within a month' },
  { id: '1-3-months',   label: '1-3 months' },
  { id: 'flexible',     label: 'Flexible' },
]

/**
 * Lead capture form. Renders inline (on /contact) or inside a modal
 * (PostCTA on blog/vlog detail pages). Pre-fill services via the
 * `defaultServices` prop; track origin via the `source` string so we
 * can attribute leads in the database.
 */
export default function LeadForm({ source = 'unknown', defaultServices = [], onSuccess }) {
  const [name,       setName]       = useState('')
  const [business,   setBusiness]   = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [services,   setServices]   = useState(defaultServices)
  const [budget,     setBudget]     = useState('')
  const [timeline,   setTimeline]   = useState('')
  const [message,    setMessage]    = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [error,      setError]      = useState(null)

  const toggleService = (id) =>
    setServices((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const result = await saveLead({
      name, business, email, phone, services, budget, timeline, message, source,
    })

    setSubmitting(false)
    if (result?.ok) {
      setDone(true)
      onSuccess?.()
    } else {
      setError(result?.error || 'Something went wrong.')
    }
  }

  if (done) {
    return (
      <div className="font-plex text-center py-10 md:py-14">
        <p className="flex items-center justify-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
          Brief received
        </p>
        <p className="text-3xl md:text-4xl font-semibold tracking-[-0.01em] text-black mb-5">
          Thanks{name ? `, ${name.split(' ')[0]}` : ''}.
        </p>
        <p className="text-amp-body max-w-md mx-auto leading-relaxed">
          One of us will be in touch at <strong className="text-black font-semibold">{email}</strong> within 24 hours.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-md border border-amp-hairline px-3.5 py-3 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder-amp-caption/70'
  /* Selectable chips: active reads as the near-black pill used for every
     primary action in the amp system, inactive as a plain hairline
     outline - so "chosen" is a fill, never a colour. */
  const chipCls = (active) =>
    `px-4 py-2 rounded-md text-[13px] font-medium border transition-colors ${
      active
        ? 'bg-amp-ink-pill text-white border-amp-ink-pill'
        : 'border-amp-hairline text-amp-body hover:border-black/40 hover:text-black'
    }`
  const groupLabelCls = 'text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-3'

  return (
    <form onSubmit={onSubmit} className="font-plex space-y-7">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input  type="text"  value={name}     onChange={(e) => setName(e.target.value)}     placeholder="Your name *"        required maxLength={120} className={inputCls} />
        <input  type="text"  value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business / brand"             maxLength={200} className={inputCls} />
        <input  type="email" value={email}    onChange={(e) => setEmail(e.target.value)}    placeholder="Email *"            required maxLength={200} className={inputCls} />
        <input  type="tel"   value={phone}    onChange={(e) => setPhone(e.target.value)}    placeholder="Phone (optional)"             maxLength={40}  className={inputCls} />
      </div>

      <div>
        <p className={groupLabelCls}>What do you need?</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={chipCls(services.includes(s.id))}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelCls}>Budget range</p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button key={b.id} type="button" onClick={() => setBudget(b.id)} className={chipCls(budget === b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelCls}>Timeline</p>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <button key={t.id} type="button" onClick={() => setTimeline(t.id)} className={chipCls(timeline === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={groupLabelCls}>Tell us about your project</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={4000}
          placeholder="What are you shooting? What's the goal? Any references? The more we know, the better the first reply."
          className="w-full rounded-md border border-amp-hairline px-3.5 py-3 text-sm bg-transparent focus:outline-none focus:border-black transition-colors placeholder-amp-caption/70 leading-relaxed resize-y"
        />
      </div>

      {/* Validation/save failure stays semantically red - error is not a
          brand accent, so it never picks up one of the amp accent hues. */}
      {error && (
        <p className="text-[#b3261e] text-sm">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !email.trim()}
          className="inline-flex items-center justify-center gap-3 h-14 px-7 rounded-full bg-amp-ink-pill text-white text-base font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending…' : 'Send Brief'}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          )}
        </button>
        <p className="text-[12px] text-amp-caption leading-relaxed">
          Or email <a href="mailto:hello@p2vlabs.in" className="text-black underline underline-offset-2">hello@p2vlabs.in</a> directly.
        </p>
      </div>
    </form>
  )
}
