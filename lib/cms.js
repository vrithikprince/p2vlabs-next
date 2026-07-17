import { createServerClient } from './supabase.js'

/**
 * Server-side fetch helpers for blog + vlog content.
 *
 * Every helper here filters to `status = 'published'` - drafts must
 * never leak onto the public site. RLS is disabled on these tables
 * (matches the rest of the project), so the filter is the only thing
 * standing between drafts and the world. If you ever add a new
 * read path, make sure it includes the status filter.
 *
 * Every read goes through safeRead(): build-time Supabase reads on Vercel
 * are flaky (parallel prerender fan-out can make individual fetches reject
 * or error), and a single failure used to crash the whole production build
 * ("Export encountered errors on /blog, /vlog, /sitemap.xml"). safeRead
 * retries a few times, then falls back to empty/null so the build always
 * succeeds; ISR (revalidate = 60) backfills the real content within a
 * minute, and dynamicParams:true renders any un-prebuilt post on demand.
 */

async function safeRead(run, fallback, label, tries = 3) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const { data, error } = await run()
      if (!error) return data ?? fallback
      if (attempt === tries) {
        console.error(`[cms] ${label} errored:`, error.message)
        return fallback
      }
    } catch (e) {
      if (attempt === tries) {
        console.error(`[cms] ${label} threw:`, e?.message || e)
        return fallback
      }
    }
    /* brief backoff before the next attempt */
    await new Promise((r) => setTimeout(r, 200 * attempt))
  }
  return fallback
}

/* ── Blog ───────────────────────────────────────────────────────── */

export async function getPublishedBlogPosts() {
  return safeRead(
    () =>
      createServerClient()
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image_url, cover_image_alt, author, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false }),
    [],
    'getPublishedBlogPosts',
  )
}

export async function getBlogPostBySlug(slug) {
  return safeRead(
    () =>
      createServerClient()
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('slug', slug)
        .maybeSingle(),
    null,
    'getBlogPostBySlug',
  )
}

export async function getPublishedBlogSlugs() {
  const rows = await safeRead(
    () => createServerClient().from('blog_posts').select('slug').eq('status', 'published'),
    [],
    'getPublishedBlogSlugs',
  )
  return (rows || []).map((r) => r.slug).filter(Boolean)
}

/* ── Vlog ───────────────────────────────────────────────────────── */

export async function getPublishedVlogPosts() {
  return safeRead(
    () =>
      createServerClient()
        .from('vlog_posts')
        .select('id, slug, title, description, thumbnail_url, thumbnail_alt, youtube_id, duration, author, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false }),
    [],
    'getPublishedVlogPosts',
  )
}

export async function getVlogPostBySlug(slug) {
  return safeRead(
    () =>
      createServerClient()
        .from('vlog_posts')
        .select('*')
        .eq('status', 'published')
        .eq('slug', slug)
        .maybeSingle(),
    null,
    'getVlogPostBySlug',
  )
}

export async function getPublishedVlogSlugs() {
  const rows = await safeRead(
    () => createServerClient().from('vlog_posts').select('slug').eq('status', 'published'),
    [],
    'getPublishedVlogSlugs',
  )
  return (rows || []).map((r) => r.slug).filter(Boolean)
}

/* ── Search ─────────────────────────────────────────────────────── */

/**
 * Cross-table search for the /search route. Matches `query` against
 * title + excerpt (blog) and title + description (vlog). Case-insensitive
 * (ilike). Always filters to published.
 *
 * Two queries per table (one on each column) merged client-side rather
 * than supabase.or(...) - the .or() filter interpolates user input into
 * a comma-separated string which is awkward to escape safely.
 *
 * Returns { blogs, vlogs } each capped at 20 results, newest-first.
 */
export async function searchPublishedContent(query) {
  const q = (query || '').trim()
  if (!q) return { blogs: [], vlogs: [] }

  /* Escape SQL ilike wildcards in user input - `%` and `_` are wildcards
     that would let `50%` match every row. Backslash escapes them. */
  const safe    = q.replace(/[\\%_]/g, '\\$&')
  const pattern = `%${safe}%`

  try {
    const supabase = createServerClient()

    const [blogTitle, blogExcerpt, vlogTitle, vlogDescription] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image_url, cover_image_alt, author, published_at')
        .eq('status', 'published')
        .ilike('title', pattern)
        .order('published_at', { ascending: false })
        .limit(20),
      supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image_url, cover_image_alt, author, published_at')
        .eq('status', 'published')
        .ilike('excerpt', pattern)
        .order('published_at', { ascending: false })
        .limit(20),
      supabase
        .from('vlog_posts')
        .select('id, slug, title, description, thumbnail_url, thumbnail_alt, youtube_id, duration, author, published_at')
        .eq('status', 'published')
        .ilike('title', pattern)
        .order('published_at', { ascending: false })
        .limit(20),
      supabase
        .from('vlog_posts')
        .select('id, slug, title, description, thumbnail_url, thumbnail_alt, youtube_id, duration, author, published_at')
        .eq('status', 'published')
        .ilike('description', pattern)
        .order('published_at', { ascending: false })
        .limit(20),
    ])

    /* Merge by id, preserving the first occurrence (so title hits rank
       above excerpt hits - typical "title is stronger signal" pattern). */
    const dedupe = (rows) => {
      const seen = new Set()
      return rows.filter((r) => {
        if (!r || seen.has(r.id)) return false
        seen.add(r.id)
        return true
      })
    }

    return {
      blogs: dedupe([...(blogTitle.data || []), ...(blogExcerpt.data    || [])]).slice(0, 20),
      vlogs: dedupe([...(vlogTitle.data || []), ...(vlogDescription.data || [])]).slice(0, 20),
    }
  } catch (e) {
    console.error('[cms] searchPublishedContent threw:', e?.message || e)
    return { blogs: [], vlogs: [] }
  }
}
