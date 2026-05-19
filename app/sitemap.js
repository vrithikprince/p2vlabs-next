import { getPublishedBlogPosts, getPublishedVlogPosts } from '../lib/cms.js'

const SITE = 'https://www.p2vlabs.in'

/**
 * Sitemap. Static routes first; then a dynamic chunk for every
 * published blog + vlog slug. `lastModified` on dynamic entries comes
 * from `published_at` so Google sees freshness for each post.
 *
 * Re-runs at the same cadence as the ISR pages (revalidate = 60 on
 * /blog and /vlog), so newly-published posts appear in the sitemap
 * within ~1 minute of going live.
 */
export const revalidate = 60

export default async function sitemap() {
  const now = new Date()

  const staticRoutes = [
    { url: `${SITE}`,          lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/reel`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/blog`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/vlog`,     lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/packages`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/contact`,  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]

  /* Fetch published posts in parallel. If Supabase is unreachable
     (e.g. local build with no env), the helpers return [] silently
     and the sitemap still ships with just the static routes. */
  const [blogPosts, vlogPosts] = await Promise.all([
    getPublishedBlogPosts(),
    getPublishedVlogPosts(),
  ])

  const blogRoutes = blogPosts.map((p) => ({
    url:             `${SITE}/blog/${p.slug}`,
    lastModified:    p.published_at ? new Date(p.published_at) : now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  const vlogRoutes = vlogPosts.map((p) => ({
    url:             `${SITE}/vlog/${p.slug}`,
    lastModified:    p.published_at ? new Date(p.published_at) : now,
    changeFrequency: 'monthly',
    priority:        0.7,
  }))

  return [...staticRoutes, ...blogRoutes, ...vlogRoutes]
}
