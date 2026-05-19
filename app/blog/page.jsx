import BlogCard from '../../components/blog/BlogCard.jsx'
import DroppingSoon from '../../components/blog/DroppingSoon.jsx'
import Footer from '../../components/layout/Footer.jsx'
import { getPublishedBlogPosts } from '../../lib/cms.js'

/**
 * /blog — index of published blog posts. ISR every 60s so freshly-
 * published posts appear on the public site within ~1 minute of the
 * founder hitting Publish in the CMS, without paying the server-render
 * cost on every request.
 */
export const revalidate = 60

export async function generateMetadata() {
  return {
    title: 'The Journal',
    description:
      'Essays, production notes, and behind-the-frame breakdowns from the P2V Labs studio in Ahmedabad.',
    alternates: { canonical: '/blog' },
    openGraph: {
      title: 'The Journal — P2V Labs',
      url:   'https://www.p2vlabs.in/blog',
      type:  'website',
    },
  }
}

export default async function BlogIndex() {
  const posts = await getPublishedBlogPosts()

  if (!posts.length) {
    return (
      <div className="pt-16">
        <DroppingSoon kind="blog" />
        <Footer />
      </div>
    )
  }

  return (
    <div className="pt-16">
      <section className="px-5 md:px-10 lg:px-20 pt-16 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-charcoal/45 mb-5">
            The P2V Journal
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-charcoal leading-tight">
              Writing on craft<br />
              <em className="not-italic text-p2v">+ commerce.</em>
            </h1>
            <p className="text-charcoal/55 leading-relaxed self-end text-lg">
              Long-form essays, production notes, and behind-the-frame breakdowns from the studio.
              Updated as we ship.
            </p>
          </div>
          <div className="h-px bg-charcoal/10" />
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
