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
  { id: '50k-1l',    label: '₹50K – ₹1L' },
  { id: '1l-3l',     label: '₹1L – ₹3L' },
  { id: '3l-plus',   label: '₹3L+' },
  { id: 'discuss',   label: 'Open to discuss' },
]

const TIMELINES = [
  { id: 'asap',         label: 'ASAP' },
  { id: 'within-month', label: 'Within a month' },
  { id: '1-3-months',   label: '1–3 months' },
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
      <div className="text-center py-10 md:py-14">
        <p className="text-[10px] tracking-[0.4em] uppercase text-charcoal/40 mb-4">
          Brief received
        </p>
        <p className="font-display text-3xl md:text-4xl font-bold text-charcoal mb-5">
          Thanks{name ? `, ${name.split(' ')[0]}` : ''}.
        </p>
        <p className="text-charcoal/55 max-w-md mx-auto leading-relaxed">
          One of us will be in touch at <strong className="text-charcoal">{email}</strong> within 24 hours.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full border border-charcoal/15 px-3 py-3 text-sm bg-transparent focus:outline-none focus:border-charcoal transition-colors placeholder-charcoal/35'
  const chipCls = (active) =>
    `px-4 py-2 text-[10px] tracking-[0.15em] uppercase font-medium border transition-colors ${
      active
        ? 'bg-charcoal text-cream border-charcoal'
        : 'border-charcoal/18 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal'
    }`

  return (
    <form onSubmit={onSubmit} className="space-y-7">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input  type="text"  value={name}     onChange={(e) => setName(e.target.value)}     placeholder="Your name *"        required maxLength={120} className={inputCls} />
        <input  type="text"  value={business} onChange={(e) => setBusiness(e.target.value)} placeholder="Business / brand"             maxLength={200} className={inputCls} />
        <input  type="email" value={email}    onChange={(e) => setEmail(e.target.value)}    placeholder="Email *"            required maxLength={200} className={inputCls} />
        <input  type="tel"   value={phone}    onChange={(e) => setPhone(e.target.value)}    placeholder="Phone (optional)"             maxLength={40}  className={inputCls} />
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">What do you need?</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button key={s.id} type="button" onClick={() => toggleService(s.id)} className={chipCls(services.includes(s.id))}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">Budget range</p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <button key={b.id} type="button" onClick={() => setBudget(b.id)} className={chipCls(budget === b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">Timeline</p>
        <div className="flex flex-wrap gap-2">
          {TIMELINES.map((t) => (
            <button key={t.id} type="button" onClick={() => setTimeline(t.id)} className={chipCls(timeline === t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-charcoal/40 mb-3">Tell us about your project</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          maxLength={4000}
          placeholder="What are you shooting? What's the goal? Any references? The more we know, the better the first reply."
          className="w-full border border-charcoal/15 px-3 py-3 text-sm bg-transparent focus:outline-none focus:border-charcoal transition-colors placeholder-charcoal/35 leading-relaxed resize-y"
        />
      </div>

      {error && (
        <p className="text-p2v text-sm">{error}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <button
          type="submit"
          disabled={submitting || !name.trim() || !email.trim()}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-p2v text-cream text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Sending…' : 'Send Brief'}
          {!submitting && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          )}
        </button>
        <p className="text-[11px] text-charcoal/40 leading-relaxed">
          Or email <a href="mailto:hello@p2vlabs.in" className="text-charcoal underline underline-offset-2">hello@p2vlabs.in</a> directly.
        </p>
      </div>
    </form>
  )
}
