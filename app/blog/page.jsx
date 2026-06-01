import BlogCard from '../../components/blog/BlogCard.jsx'
import DroppingSoon from '../../components/blog/DroppingSoon.jsx'
import Footer from '../../components/layout/Footer.jsx'
import PageHeader from '../../components/layout/PageHeader.jsx'
import JournalIllustration from '../../components/illustrations/JournalIllustration.jsx'
import { getPublishedBlogPosts } from '../../lib/cms.js'
import { breadcrumbsJsonLd } from '../../lib/seo.js'

/* BreadcrumbList — even on the index page, gives Google the trail so
   the SERP can render "p2vlabs.in › Journal" instead of the raw URL. */
const breadcrumbs = breadcrumbsJsonLd([
  { name: 'Home',    path: '/' },
  { name: 'Journal', path: '/blog' },
])

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
      url:   '/blog',
      type:  'website',
    },
  }
}

export default async function BlogIndex() {
  const posts = await getPublishedBlogPosts()

  if (!posts.length) {
    return (
      <div className="pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <DroppingSoon kind="blog" />
        <Footer />
      </div>
    )
  }

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <PageHeader
        kicker="The P2V Journal"
        title="Writing on craft"
        italic="+ commerce."
      >
        <JournalIllustration />
      </PageHeader>

      <section className="px-5 md:px-10 lg:px-20 pt-4 pb-20">
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
