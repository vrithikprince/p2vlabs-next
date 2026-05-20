import { notFound } from 'next/navigation'
import BlogArticle from '../../../components/blog/BlogArticle.jsx'
import PostCTA from '../../../components/blog/PostCTA.jsx'
import Footer from '../../../components/layout/Footer.jsx'
import { getBlogPostBySlug, getPublishedBlogSlugs } from '../../../lib/cms.js'
import { buildPostMetadata, canonicalUrl, SITE_URL, breadcrumbsJsonLd } from '../../../lib/seo.js'

/**
 * /blog/[slug] — individual blog post. ISR every 60s for newly-
 * published / edited posts; `generateStaticParams` prebuilds every
 * known published slug at build time.
 */
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug)
  return buildPostMetadata({ kind: 'blog', post })
}

export default async function BlogPost({ params }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()

  /* JSON-LD Article schema — gives Google the structured data needed
     for rich snippets (author + date + headline + cover image). All
     URLs go through canonicalUrl() so they match the <link rel=canonical>
     and the og:url emitted by buildPostMetadata above. */
  const jsonLd = {
    '@context':      'https://schema.org',
    '@type':         'Article',
    headline:        post.title,
    description:     post.meta_description || post.excerpt || undefined,
    image:           post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished:   post.published_at || undefined,
    dateModified:    post.updated_at   || post.published_at || undefined,
    author: post.author
      ? { '@type': 'Person', name: post.author }
      : { '@type': 'Organization', name: 'P2V Labs' },
    publisher: {
      '@type': 'Organization',
      name:    'P2V Labs',
      logo: {
        '@type': 'ImageObject',
        url:     `${SITE_URL}/og-image.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   canonicalUrl(`/blog/${post.slug}`),
    },
  }

  /* BreadcrumbList — gives Google the trail to render in SERPs
     ("p2vlabs.in › Journal › <Post Title>") instead of the raw URL. */
  const breadcrumbs = breadcrumbsJsonLd([
    { name: 'Home',     path: '/' },
    { name: 'Journal',  path: '/blog' },
    { name: post.title, path: `/blog/${post.slug}` },
  ])

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <BlogArticle post={post} />
      <PostCTA kind="blog" slug={post.slug} title={post.title} />
      <Footer />
    </div>
  )
}
