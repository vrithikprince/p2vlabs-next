'use server'

import { createServerClient } from '../../lib/supabase.js'

/**
 * Server action — persists a new lead row to public.leads. Called from
 * the LeadForm client component. Returns { ok, error? } so the form can
 * render success/error inline.
 *
 * RLS allows anon INSERT only, so the operation succeeds even though
 * we're using the same anon key as the rest of the site. No service-
 * role key needed in the bundle / runtime env.
 */
export async function saveLead(input) {
  /* ── Validate ── */
  const name  = (input?.name  || '').trim()
  const email = (input?.email || '').trim()

  if (!name)                              return { ok: false, error: 'Name is required.' }
  if (!email)                             return { ok: false, error: 'Email is required.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }
  if (name.length  > 120) return { ok: false, error: 'Name is too long.' }
  if (email.length > 200) return { ok: false, error: 'Email is too long.' }

  const message = (input?.message || '').trim()
  if (message.length > 4000) {
    return { ok: false, error: 'Message is too long (max 4000 characters).' }
  }

  /* ── Build row ── */
  const row = {
    id:              Date.now(),
    name,
    business:        (input?.business || '').trim() || null,
    email,
    phone:           (input?.phone || '').trim() || null,
    service_interest: Array.isArray(input?.services) ? input.services.slice(0, 8) : [],
    budget_range:    input?.budget   || null,
    timeline:        input?.timeline || null,
    message:         message || null,
    source:          (input?.source || 'unknown').slice(0, 200),
  }

  /* ── Persist ── */
  try {
    const supabase = createServerClient()
    const { error } = await supabase.from('leads').insert(row)
    if (error) {
      console.error('[saveLead] supabase insert failed:', error.message)
      return {
        ok: false,
        error:
          'Sorry — something went wrong saving your message. Please email hello@p2vlabs.in directly.',
      }
    }
    return { ok: true }
  } catch (err) {
    console.error('[saveLead] threw:', err)
    return {
      ok: false,
      error:
        'Sorry — something went wrong saving your message. Please email hello@p2vlabs.in directly.',
    }
  }
}
