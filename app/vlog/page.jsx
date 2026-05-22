import VlogCard from '../../components/vlog/VlogCard.jsx'
import DroppingSoon from '../../components/blog/DroppingSoon.jsx'
import Footer from '../../components/layout/Footer.jsx'
import { getPublishedVlogPosts } from '../../lib/cms.js'
import { breadcrumbsJsonLd } from '../../lib/seo.js'

const breadcrumbs = breadcrumbsJsonLd([
  { name: 'Home',  path: '/' },
  { name: 'Films', path: '/vlog' },
])

/** /vlog — index of published vlogs. ISR every 60s. */
export const revalidate = 60

export async function generateMetadata() {
  return {
    title: 'The Reel Diary',
    description:
      'Behind-the-scenes films, director cuts, and founder commentary from P2V Labs.',
    alternates: { canonical: '/vlog' },
    openGraph: {
      title: 'The Reel Diary — P2V Labs',
      url:   '/vlog',
      type:  'website',
    },
  }
}

export default async function VlogIndex() {
  const posts = await getPublishedVlogPosts()

  if (!posts.length) {
    return (
      <div className="pt-16">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
        />
        <DroppingSoon kind="vlog" />
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
      <section className="px-5 md:px-10 lg:px-20 pt-16 md:pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.4em] uppercase text-bone/45 mb-5">
            The P2V Reel Diary
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-bone leading-tight">
              Films from the<br />
              <em className="not-italic text-amber">studio floor.</em>
            </h1>
            <p className="text-bone/55 leading-relaxed self-end text-lg">
              Director cuts, behind-the-scenes diaries, and founder commentary —
              hosted on YouTube, indexed here.
            </p>
          </div>
          <div className="h-px bg-ink/10" />
        </div>
      </section>

      <section className="px-5 md:px-10 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {posts.map((post) => (
            <VlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
