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
