'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { saveLead } from '../../app/actions/saveLead.js'
import { DEFAULT_COUNTRY, filterCountries } from '../../lib/countryCodes.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * LeadCapture - the mid-scroll ask.
 *
 * Deliberately shorter than the /contact LeadForm: name + phone are the only
 * required fields, because this fires while someone is still browsing and
 * every extra field is a reason to bail. Phone (not email) is the required
 * channel - it is what the founders actually follow up on over WhatsApp.
 *
 * The character is a camera rather than a generic mascot: this is a content
 * studio, so the one animated thing on the page may as well be the tool the
 * business is built around. Its lens tracks whichever field has focus, the
 * shutter blinks on an idle loop, and it fires with a flash on success.
 *
 * NOTE: phone-only submissions require db/2026-08-21_leads_phone_only.sql to
 * have been applied - the original leads table had `email text not null`.
 * saveLead validates the same rule server-side before the insert.
 */

/* Where the pupil sits for each field, in SVG units from lens centre. */
const GAZE = {
  name:    { x: -7, y:  6 },
  phone:   { x:  7, y:  6 },
  message: { x:  0, y:  9 },
  none:    { x:  0, y:  0 },
}

export default function LeadCapture() {
  const sectionRef = useRef(null)
  const pupilRef   = useRef(null)
  const irisRef    = useRef(null)
  const shutterRef = useRef(null)
  const flashRef   = useRef(null)
  const bodyRef    = useRef(null)

  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [focused, setFocused] = useState('none')
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [done,  setDone]  = useState(false)
  const [error, setError] = useState(null)

  /* Country dial code - India by default, since that is where essentially all
     inbound currently comes from. Stored separately from the national number
     and only joined at submit time. */
  const [country,   setCountry]   = useState(DEFAULT_COUNTRY)
  const [dialOpen,  setDialOpen]  = useState(false)
  const [dialQuery, setDialQuery] = useState('')
  const dialWrapRef   = useRef(null)
  const dialSearchRef = useRef(null)

  /* What actually gets sent and validated. The server sees one string and
     counts its digits, so the client counts the same string - not just the
     national part - or the two could disagree at the boundaries. */
  const fullPhone     = `${country.dial} ${phone}`.trim()
  const phoneDigits   = fullPhone.replace(/\D/g, '')
  const nationalDigits = phone.replace(/\D/g, '')
  const nameValid     = name.trim().length > 0
  /* National minimum on top of the server's rule: with a dial code always
     present, the server's 7-digit floor would accept a 4-digit number for a
     3-digit dial code. Stricter on the client is the safe direction - it can
     only reject things the server would also have been unhappy about. */
  const phoneValid    = nationalDigits.length >= 6 &&
                        phoneDigits.length >= 7 && phoneDigits.length <= 15
  const canSubmit     = nameValid && phoneValid && !submitting

  const countryResults = filterCountries(dialQuery)

  /* Close the picker on outside click or Escape. */
  useEffect(() => {
    if (!dialOpen) return
    const onDown = (e) => {
      if (dialWrapRef.current && !dialWrapRef.current.contains(e.target)) setDialOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setDialOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [dialOpen])

  /* Focus the search box when the picker opens, so it is type-to-search
     without an extra click. */
  useEffect(() => {
    if (dialOpen) dialSearchRef.current?.focus()
    else setDialQuery('')
  }, [dialOpen])

  /* ── entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.lc-rise', {
        opacity: 0, y: 26, duration: 0.7, ease: 'power3.out', stagger: 0.09,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', once: true },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  /* ── idle shutter blink ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const shutter = shutterRef.current
    if (!shutter) return

    const blink = () => {
      gsap.timeline()
        .to(shutter, { scaleY: 1, duration: 0.09, ease: 'power2.in' })
        .to(shutter, { scaleY: 0, duration: 0.16, ease: 'power2.out' }, '+=0.04')
    }
    /* Uneven interval - a perfectly periodic blink reads as a loading spinner
       rather than something alive. */
    let t
    const schedule = () => {
      t = setTimeout(() => { blink(); schedule() }, 2600 + Math.random() * 2600)
    }
    schedule()
    return () => clearTimeout(t)
  }, [])

  /* ── lens tracks the focused field ── */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const g = GAZE[focused] || GAZE.none
    gsap.to(pupilRef.current, { x: g.x, y: g.y, duration: 0.45, ease: 'power3.out' })
    gsap.to(irisRef.current,  { x: g.x * 0.45, y: g.y * 0.45, duration: 0.5, ease: 'power3.out' })
    /* focus pull - the lens tightens while a field is active */
    gsap.to(irisRef.current, {
      scale: focused === 'none' ? 1 : 0.9,
      transformOrigin: 'center',
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [focused])

  /* ── shutter fires on success ── */
  const fireShutter = () => {
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.timeline()
      .to(shutterRef.current, { scaleY: 1, duration: 0.07, ease: 'power2.in' })
      .to(flashRef.current,   { opacity: 0.85, duration: 0.06 }, '<')
      .to(bodyRef.current,    { y: -8, duration: 0.12, ease: 'power2.out' }, '<')
      .to(flashRef.current,   { opacity: 0, duration: 0.5, ease: 'power2.out' })
      .to(shutterRef.current, { scaleY: 0, duration: 0.22, ease: 'power2.out' }, '<')
      .to(bodyRef.current,    { y: 0, duration: 0.5, ease: 'elastic.out(1,0.5)' }, '<')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, phone: true })
    if (!nameValid || !phoneValid) return

    setError(null)
    setSubmitting(true)
    const result = await saveLead({
      name,
      /* dial code included so the number is dialable straight out of the
         table - the founders call these back, and a bare national number
         with no country is guesswork once there is any non-IN traffic. */
      phone: fullPhone,
      message,
      source: 'homepage-lead-capture',
    })
    setSubmitting(false)

    if (result?.ok) {
      setDone(true)
      fireShutter()
    } else {
      setError(result?.error || 'Something went wrong. Please try again.')
    }
  }

  const fieldCls = (invalid) =>
    `w-full rounded-md border px-4 py-3 text-[15px] bg-white text-black
     placeholder-amp-caption/70 transition-colors focus:outline-none
     ${invalid ? 'border-[#b3261e] focus:border-[#b3261e]' : 'border-amp-hairline focus:border-black'}`

  return (
    <section
      ref={sectionRef}
      id="lead-capture"
      className="relative overflow-hidden bg-white font-plex py-16 lg:py-24 px-5 md:px-10 lg:px-20"
    >
      {/* same ambient wash as the hero, so this reads as a bookend to it */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute"
          style={{
            top: '-10%', left: '4%',
            width: 'clamp(280px,30vw,520px)', height: 'clamp(280px,30vw,520px)',
            background: 'radial-gradient(circle, rgba(105,128,255,0.16), rgba(105,128,255,0) 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: '-14%', right: '6%',
            width: 'clamp(260px,28vw,460px)', height: 'clamp(260px,28vw,460px)',
            background: 'radial-gradient(circle, rgba(162,115,255,0.15), rgba(162,115,255,0) 70%)',
            filter: 'blur(48px)',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

        {/* ── left: character + pitch ── */}
        <div className="lg:col-span-5">
          <div className="lc-rise w-[190px] md:w-[220px] mx-auto lg:mx-0 mb-8">
            <svg viewBox="0 0 220 190" className="w-full h-auto" role="img" aria-label="Illustration of a camera">
              <g ref={bodyRef}>
                {/* flash burst - sits behind the body, revealed on success */}
                <circle ref={flashRef} cx="110" cy="92" r="86" fill="#6980ff" opacity="0" />

                {/* top plate + viewfinder bump */}
                <rect x="78" y="20" width="46" height="16" rx="5" fill="#ffffff" stroke="#1a1f23" strokeWidth="3" />
                {/* shutter release */}
                <rect x="150" y="24" width="18" height="10" rx="5" fill="#a273ff" stroke="#1a1f23" strokeWidth="3" />

                {/* body */}
                <rect x="18" y="34" width="184" height="130" rx="22" fill="#ffffff" stroke="#1a1f23" strokeWidth="3.5" />

                {/* lens barrel */}
                <circle cx="110" cy="99" r="50" fill="#f2f4f8" stroke="#1a1f23" strokeWidth="3.5" />
                <circle cx="110" cy="99" r="39" fill="#ffffff" stroke="#d5d9e0" strokeWidth="2" />

                {/* iris + pupil - these track the focused field */}
                <g ref={irisRef} style={{ transformOrigin: '110px 99px' }}>
                  <circle cx="110" cy="99" r="27" fill="#6980ff" />
                  <g ref={pupilRef}>
                    <circle cx="110" cy="99" r="14" fill="#1a1f23" />
                    {/* catchlight - sells it as glass rather than a flat dot */}
                    <circle cx="102" cy="91" r="4.5" fill="#ffffff" opacity="0.9" />
                  </g>
                </g>

                {/* shutter blade - scaleY 0 at rest, 1 = closed. Origin is the
                    lens centre so it closes like a real leaf shutter. */}
                <circle
                  ref={shutterRef}
                  cx="110" cy="99" r="39"
                  fill="#1a1f23"
                  style={{ transformOrigin: '110px 99px', transform: 'scaleY(0)' }}
                />

                {/* status lamp */}
                <circle cx="46" cy="58" r="6" fill={done ? '#a273ff' : '#d5d9e0'} />
              </g>
            </svg>
          </div>

          <p className="lc-rise flex items-center justify-center lg:justify-start gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
            Start a project
          </p>
          <h2 className="lc-rise font-plex font-semibold text-black leading-[1.08] tracking-[-0.01em] text-center lg:text-left"
              style={{ fontSize: 'clamp(2rem,4.5vw,3rem)' }}>
            Tell us what you&rsquo;re
            <br />
            <em className="not-italic text-amp-violet">building.</em>
          </h2>
          <p className="lc-rise mt-5 text-amp-body leading-relaxed max-w-md text-center lg:text-left mx-auto lg:mx-0">
            Two fields is all we need to get started. We&rsquo;ll call or WhatsApp
            you back the same day, usually within a couple of hours.
          </p>
        </div>

        {/* ── right: the form ── */}
        <div className="lg:col-span-7">
          <div className="lc-rise rounded-[16px] border border-amp-hairline bg-white/70 backdrop-blur-md p-6 md:p-9 shadow-[0_18px_50px_-20px_rgba(26,31,35,0.18)]">
            {done ? (
              <div className="py-8 text-center" role="status" aria-live="polite">
                <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-4">
                  Got it
                </p>
                <p className="font-plex font-semibold text-black text-3xl md:text-4xl tracking-[-0.01em] mb-4">
                  Thanks{name.trim() ? `, ${name.trim().split(' ')[0]}` : ''}.
                </p>
                <p className="text-amp-body leading-relaxed max-w-sm mx-auto">
                  We&rsquo;ve got your number and we&rsquo;ll be in touch today.
                  If it&rsquo;s urgent, WhatsApp is the fastest way to reach us.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="lc-name" className="block text-[13px] font-semibold text-black mb-2">
                      Your name <span className="text-amp-violet">*</span>
                    </label>
                    <input
                      id="lc-name"
                      type="text"
                      value={name}
                      maxLength={120}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocused('name')}
                      onBlur={() => { setFocused('none'); setTouched((t) => ({ ...t, name: true })) }}
                      placeholder="Vrithik Prince"
                      aria-required="true"
                      aria-invalid={touched.name && !nameValid ? 'true' : 'false'}
                      className={fieldCls(touched.name && !nameValid)}
                    />
                    {touched.name && !nameValid && (
                      <p className="mt-1.5 text-[12.5px] text-[#b3261e]">Please tell us your name.</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lc-phone" className="block text-[13px] font-semibold text-black mb-2">
                      Phone <span className="text-amp-violet">*</span>
                    </label>
                    {/* Segmented control: the dial-code button and the number
                        input share one bordered box so they read as a single
                        field, not two controls that happen to be adjacent. */}
                    <div
                      ref={dialWrapRef}
                      className={`relative flex items-stretch rounded-md border bg-white transition-colors ${
                        touched.phone && !phoneValid
                          ? 'border-[#b3261e]'
                          : focused === 'phone' || dialOpen ? 'border-black' : 'border-amp-hairline'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setDialOpen((o) => !o)}
                        aria-haspopup="listbox"
                        aria-expanded={dialOpen}
                        aria-label={`Country code: ${country.name} ${country.dial}`}
                        className="flex items-center gap-1.5 pl-3.5 pr-2.5 text-[15px] text-black hover:bg-amp-surface rounded-l-md transition-colors"
                      >
                        <span className="font-semibold">{country.iso}</span>
                        <span className="text-amp-caption">{country.dial}</span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                             className={`text-amp-caption transition-transform ${dialOpen ? 'rotate-180' : ''}`}
                             aria-hidden="true">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                      <span className="w-px my-2 bg-amp-hairline" aria-hidden="true" />
                      <input
                        id="lc-phone"
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        maxLength={24}
                        onChange={(e) => setPhone(e.target.value)}
                        onFocus={() => setFocused('phone')}
                        onBlur={() => { setFocused('none'); setTouched((t) => ({ ...t, phone: true })) }}
                        placeholder="7048824616"
                        aria-required="true"
                        aria-invalid={touched.phone && !phoneValid ? 'true' : 'false'}
                        className="flex-1 min-w-0 rounded-r-md px-3 py-3 text-[15px] bg-transparent text-black placeholder-amp-caption/70 focus:outline-none"
                      />

                      {dialOpen && (
                        <div
                          className="absolute z-30 top-[calc(100%+6px)] left-0 w-[300px] max-w-[calc(100vw-3rem)] rounded-[16px] border border-amp-hairline bg-white shadow-[0_18px_50px_-16px_rgba(26,31,35,0.28)] overflow-hidden"
                          role="listbox"
                          aria-label="Select country code"
                        >
                          <div className="p-2.5 border-b border-amp-hairline">
                            <input
                              ref={dialSearchRef}
                              type="text"
                              value={dialQuery}
                              onChange={(e) => setDialQuery(e.target.value)}
                              placeholder="Search country or code"
                              aria-label="Search country or code"
                              className="w-full rounded-md border border-amp-hairline px-3 py-2 text-[14px] text-black placeholder-amp-caption/70 focus:outline-none focus:border-black transition-colors"
                            />
                          </div>
                          <ul className="max-h-56 overflow-y-auto py-1">
                            {countryResults.length === 0 && (
                              <li className="px-3.5 py-3 text-[13.5px] text-amp-caption">No match.</li>
                            )}
                            {countryResults.map((c) => {
                              const active = c.iso === country.iso
                              return (
                                <li key={c.iso}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => { setCountry(c); setDialOpen(false) }}
                                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-[14px] transition-colors ${
                                      active ? 'bg-amp-surface text-black font-semibold' : 'text-amp-body hover:bg-amp-surface'
                                    }`}
                                  >
                                    <span className="w-7 shrink-0 font-semibold text-black">{c.iso}</span>
                                    <span className="flex-1 truncate">{c.name}</span>
                                    <span className="text-amp-caption tabular-nums">{c.dial}</span>
                                  </button>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    {touched.phone && !phoneValid && (
                      <p className="mt-1.5 text-[12.5px] text-[#b3261e]">
                        {phoneDigits.length === 0
                          ? 'We need a number to call you back.'
                          : 'That doesn’t look like a valid number.'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="lc-message" className="block text-[13px] font-semibold text-black mb-2">
                    What do you want to discuss?{' '}
                    <span className="font-normal text-amp-caption">(optional)</span>
                  </label>
                  <textarea
                    id="lc-message"
                    rows={4}
                    value={message}
                    maxLength={4000}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('none')}
                    placeholder="A brand film, a menu shoot, monthly reels, getting found on Google - whatever's on your mind."
                    className="w-full rounded-md border border-amp-hairline bg-white px-4 py-3 text-[15px] text-black placeholder-amp-caption/70 leading-relaxed resize-y transition-colors focus:outline-none focus:border-black"
                  />
                </div>

                {error && (
                  <p className="text-[13.5px] text-[#b3261e]" role="alert">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center h-14 px-7 rounded-full bg-amp-ink-pill text-white text-base font-semibold hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending…' : 'Send my details'}
                  </button>
                  <p className="text-[12.5px] text-amp-caption leading-relaxed">
                    No spam, no mailing list. Just a call back about your project.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
