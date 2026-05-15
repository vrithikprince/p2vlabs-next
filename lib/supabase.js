import { createClient } from '@supabase/supabase-js'

/**
 * Server-side Supabase client. Used by Server Components and Route Handlers
 * (e.g. /reel page fetching reel_items at build / revalidation time).
 *
 * `NEXT_PUBLIC_*` env vars are inlined into the bundle at build time; they
 * are read here on the server too. The anon key is public-safe by design.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

/** Public storage URL builder — works on both server and client. */
export const SB_PUBLIC = (path) => {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${base}/storage/v1/object/public/${path}`
}
