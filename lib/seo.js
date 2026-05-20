/**
 * SEO helpers — single source of truth for canonical hosts, URL hygiene,
 * and CMS-driven metadata.
 *
 * All public-page metadata in this project flows through here:
 *   - app/blog/[slug]/page.jsx → buildPostMetadata({ kind: 'blog',  post })
 *   - app/vlog/[slug]/page.jsx → buildPostMetadata({ kind: 'vlog',  post })
 *
 * For static pages (about / contact / packages / list pages), use
 * canonicalUrl() to keep the canonical hostname consistent with this
 * file, and let metadataBase in app/layout.jsx resolve relative URLs.
 *
 * Why a helper function and not a React hook:
 *   Next.js 14 App Router serializes <head> before any client component
 *   renders. Hooks (useEffect, useState) run too late to influence what
 *   crawlers receive. generateMetadata() runs server-side at build /
 *   revalidation time and is the right place to call buildPostMetadata.
 */

export const SITE_HOST = 'p2vlabs.in'
export const SITE_URL  = `https://${SITE_HOST}`
export const SITE_NAME = 'P2V Labs'
export const SITE_LOCALE = 'en_IN'

/**
 * Turn a path (or full URL) into a clean canonical URL.
 *
 *   canonicalUrl('/blog/my-post/')        → 'https://p2vlabs.in/blog/my-post'
 *   canonicalUrl('blog/my-post')          → 'https://p2vlabs.in/blog/my-post'
 *   canonicalUrl('/')                     → 'https://p2vlabs.in'
 *   canonicalUrl('http://www.p2vlabs.in/x') → 'https://p2vlabs.in/x'
 *
 * Always:
 *   - forces https
 *   - forces the canonical host (strips www)
 *   - strips trailing slashes (except root)
 */
export function canonicalUrl(input = '') {
  if (!input || input === '/') return SITE_URL

  let path = String(input)

  /* If a full URL was passed, keep only its path + search. */
  if (/^https?:\/\//i.test(path)) {
    try {
      const u = new URL(path)
      path = u.pathname + (u.search || '')
    } catch {
      /* fall through, treat as path */
    }
  }

  /* Normalise: ensure single leading slash, strip trailing slashes. */
  path = '/' + path.replace(/^\/+/, '').replace(/\/+$/, '')
  if (path === '/') return SITE_URL

  return `${SITE_URL}${path}`
}

/**
 * Convert a post's stored description / excerpt into a clean meta
 * description ≤ 160 chars (Google's truncation threshold). Strips HTML
 * tags and collapses whitespace, since blog excerpts may be plain text
 * but vlog descriptions can have line breaks from the CMS textarea.
 */
function cleanDescription(input, max = 160) {
  if (!input) return ''
  const flat = String(input)
    .replace(/<[^>]+>/g, ' ')         // strip any HTML
    .replace(/\s+/g, ' ')             // collapse whitespace
    .trim()
  if (flat.length <= max) return flat
  /* Cut at the last word boundary before `max`, append ellipsis. */
  const cut = flat.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '…'
}

/**
 * Pick the right image for a post's OG card.
 *   - blog: cover_image_url
 *   - vlog: thumbnail_url, falling back to the YouTube maxres thumbnail
 */
function postImage({ kind, post }) {
  if (kind === 'vlog') {
    if (post.thumbnail_url) return { url: post.thumbnail_url, alt: post.thumbnail_alt || post.title }
    if (post.youtube_id) {
      return {
        url: `https://i.ytimg.com/vi/${post.youtube_id}/maxresdefault.jpg`,
        alt: post.thumbnail_alt || post.title,
      }
    }
    return null
  }
  if (post.cover_image_url) {
    return { url: post.cover_image_url, alt: post.cover_image_alt || post.title }
  }
  return null
}

/**
 * Build a Next.js Metadata object for a CMS-backed post.
 *
 * Used by:
 *   app/blog/[slug]/page.jsx
 *   app/vlog/[slug]/page.jsx
 *
 * To use for a new CMS-backed route (case studies, project pages, etc):
 *
 *   export async function generateMetadata({ params }) {
 *     const post = await getPostBySlug(params.slug)
 *     return buildPostMetadata({ kind: 'case-study', post, basePath: '/work' })
 *   }
 *
 * The kind/basePath combo controls:
 *   - The canonical URL path (`${basePath}/${slug}`)
 *   - The OG type ('article' for blog/case-study/etc., 'video.other' for vlog)
 *   - The image selection (cover vs thumbnail)
 */
export function buildPostMetadata({ kind, post, basePath }) {
  if (!post) {
    return {
      title: 'Not found',
      robots: { index: false, follow: false },
    }
  }

  const resolvedBase = basePath || (kind === 'vlog' ? '/vlog' : '/blog')
  const path  = `${resolvedBase}/${post.slug}`
  const title = post.meta_title?.trim() || post.title

  const description = cleanDescription(
    post.meta_description ||
    post.excerpt ||
    post.description ||
    `Read on the P2V Labs ${kind === 'vlog' ? 'reel diary' : 'journal'}.`
  )

  const img = postImage({ kind, post })
  const isVideo = kind === 'vlog'

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: path,                /* relative — metadataBase prepends https://p2vlabs.in */
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: isVideo ? 'video.other' : 'article',
      images: img ? [{ url: img.url, alt: img.alt }] : undefined,
      publishedTime: post.published_at || undefined,
      modifiedTime:  post.updated_at   || post.published_at || undefined,
      authors:       post.author ? [post.author] : undefined,
    },
    twitter: {
      card: img ? (isVideo ? 'player' : 'summary_large_image') : 'summary',
      title,
      description,
      images: img ? [img.url] : undefined,
    },
  }
}

/**
 * Lightweight metadata builder for STATIC pages (about, contact, etc.)
 * where there's no CMS post. Same shape as buildPostMetadata for
 * consistency, so you can grep for one symbol across the codebase.
 */
export function buildPageMetadata({ title, description, path, image, type = 'website' }) {
  const desc = cleanDescription(description)
  const img  = image ? (typeof image === 'string' ? { url: image, alt: title } : image) : null

  return {
    title,
    description: desc,
    alternates: { canonical: path },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description: desc,
      url: path,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: img ? [{ url: img.url, alt: img.alt || title }] : undefined,
    },
    twitter: {
      card: img ? 'summary_large_image' : 'summary',
      title,
      description: desc,
      images: img ? [img.url] : undefined,
    },
  }
}
