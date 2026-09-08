import { getPublishedBlogPosts, getPublishedVlogPosts } from '../lib/cms.js'
import { SERVICES } from '../lib/services.mjs'

const SITE = 'https://p2vlabs.in'

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

  /* Real edit dates, hand-maintained - NOT `now`.
     Every static route used to be stamped with the build timestamp, so a
     deploy that touched nothing claimed all seven pages had just changed.
     Google discounts auto-stamped freshness, and it costs you the signal on
     the page that genuinely did change. Update the date here when you
     meaningfully edit a page; leave it alone for a copy tweak. The index
     routes below still take `now`, because their content really does change
     whenever a post is published. */
  const EDITED = {
    home:     '2026-09-07',   // identity + entity graph rework
    reel:     '2026-08-24',
    packages: '2026-08-29',   // search & AI visibility section added
    about:    '2026-08-24',
    contact:  '2026-08-24',
    services: '2026-09-08',   // service cluster introduced
  }
  const d = (iso) => new Date(`${iso}T00:00:00Z`)

  const staticRoutes = [
    { url: `${SITE}`,          lastModified: d(EDITED.home),     changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE}/reel`,     lastModified: d(EDITED.reel),     changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE}/blog`,     lastModified: now,                changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/vlog`,     lastModified: now,                changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/packages`, lastModified: d(EDITED.packages), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/about`,    lastModified: d(EDITED.about),    changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/contact`,  lastModified: d(EDITED.contact),  changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/services`, lastModified: d(EDITED.services), changeFrequency: 'monthly', priority: 0.9 },
    /* One entry per service cluster, generated from lib/services.mjs so a new
       service is one edit there rather than a route AND a sitemap line. */
    ...SERVICES.map((svc) => ({
      url:             `${SITE}/services/${svc.slug}`,
      lastModified:    d(EDITED.services),
      changeFrequency: 'monthly',
      priority:        0.8,
    })),
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
