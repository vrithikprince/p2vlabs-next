import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * On-demand revalidation webhook.
 *
 *   GET /api/revalidate?secret=YOUR_SECRET&path=/reel
 *   GET /api/revalidate?secret=YOUR_SECRET&tag=reel-items
 *
 * Wire this URL into Supabase Database Webhooks (or hit it from a CI job) so
 * the `reel_items` ISR cache refreshes the moment new work is approved,
 * instead of waiting up to 60 minutes for the next revalidate window.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  const path   = searchParams.get('path')
  const tag    = searchParams.get('tag')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 401 })
  }

  if (path) revalidatePath(path)
  if (tag)  revalidateTag(tag)

  if (!path && !tag) {
    return NextResponse.json({ ok: false, error: 'Provide ?path=… or ?tag=…' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, revalidated: { path, tag }, now: Date.now() })
}

export async function POST(req) {
  return GET(req)
}
