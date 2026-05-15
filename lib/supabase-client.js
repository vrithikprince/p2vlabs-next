'use client'
import { createClient } from '@supabase/supabase-js'

/** Browser-side Supabase singleton — for Client Components that need to hit
 *  Supabase from the user's browser. The public pages don't currently use this,
 *  but it's wired in case future client-only fetches need it. */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
