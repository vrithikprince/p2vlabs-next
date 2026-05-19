import { notFound } from 'next/navigation'
import BlogArticle from '../../../components/blog/BlogArticle.jsx'
import PostCTA from '../../../components/blog/PostCTA.jsx'
import Footer from '../../../components/layout/Footer.jsx'
import { getBlogPostBySlug, getPublishedBlogSlugs } from '../../../lib/cms.js'

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
  if (!post) return { title: 'Post not found' }

  const title       = post.meta_title       || post.title
  const description = post.meta_description || post.excerpt || `Read "${post.title}" on the P2V Labs journal.`
  const url         = `https://www.p2vlabs.in/blog/${post.slug}`

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.cover_image_url ? [{
        url:    post.cover_image_url,
        alt:    post.cover_image_alt || post.title,
        width:  1200,
        height: 630,
      }] : undefined,
    },
    twitter: {
      card:        post.cover_image_url ? 'summary_large_image' : 'summary',
      title,
      description,
      images:      post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  }
}

export default async function BlogPost({ params }) {
  const post = await getBlogPostBySlug(params.slug)
  if (!post) notFound()

  /* JSON-LD Article schema — gives Google the structured data needed
     for rich snippets (author + date + headline + cover image). */
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
        url:     'https://www.p2vlabs.in/og-image.jpg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `https://www.p2vlabs.in/blog/${post.slug}`,
    },
  }

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogArticle post={post} />
      <PostCTA kind="blog" slug={post.slug} title={post.title} />
      <Footer />
    </div>
  )
}
