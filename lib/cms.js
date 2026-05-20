import { createServerClient } from './supabase.js'

/**
 * Server-side fetch helpers for blog + vlog content.
 *
 * Every helper here filters to `status = 'published'` — drafts must
 * never leak onto the public site. RLS is disabled on these tables
 * (matches the rest of the project), so the filter is the only thing
 * standing between drafts and the world. If you ever add a new
 * read path, make sure it includes the status filter.
 */

/* ── Blog ───────────────────────────────────────────────────────── */

export async function getPublishedBlogPosts() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, cover_image_alt, author, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[cms] getPublishedBlogPosts failed:', error.message)
    return []
  }
  return data || []
}

export async function getBlogPostBySlug(slug) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('[cms] getBlogPostBySlug failed:', error.message)
    return null
  }
  return data
}

export async function getPublishedBlogSlugs() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published')

  if (error) return []
  return (data || []).map((r) => r.slug)
}

/* ── Vlog ───────────────────────────────────────────────────────── */

export async function getPublishedVlogPosts() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('vlog_posts')
    .select('id, slug, title, description, thumbnail_url, thumbnail_alt, youtube_id, duration, author, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('[cms] getPublishedVlogPosts failed:', error.message)
    return []
  }
  return data || []
}

export async function getVlogPostBySlug(slug) {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('vlog_posts')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('[cms] getVlogPostBySlug failed:', error.message)
    return null
  }
  return data
}

export async function getPublishedVlogSlugs() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('vlog_posts')
    .select('slug')
    .eq('status', 'published')

  if (error) return []
  return (data || []).map((r) => r.slug)
}

/* ── Search ─────────────────────────────────────────────────────── */

/**
 * Cross-table search for the /search route. Matches `query` against
 * title + excerpt (blog) and title + description (vlog). Case-insensitive
 * (ilike). Always filters to published.
 *
 * Two queries per table (one on each column) merged client-side rather
 * than supabase.or(...) — the .or() filter interpolates user input into
 * a comma-separated string which is awkward to escape safely.
 *
 * Returns { blogs, vlogs } each capped at 20 results, newest-first.
 */
export async function searchPublishedContent(query) {
  const q = (query || '').trim()
  if (!q) return { blogs: [], vlogs: [] }

  /* Escape SQL ilike wildcards in user input — `%` and `_` are wildcards
     that would let `50%` match every row. Backslash escapes them. */
  const safe    = q.replace(/[\\%_]/g, '\\$&')
  const pattern = `%${safe}%`

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
     above excerpt hits — typical "title is stronger signal" pattern). */
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
}
