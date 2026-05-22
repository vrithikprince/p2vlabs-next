import Footer from '../../components/layout/Footer.jsx'
import BlogCard from '../../components/blog/BlogCard.jsx'
import VlogCard from '../../components/vlog/VlogCard.jsx'
import { searchPublishedContent } from '../../lib/cms.js'

/**
 * /search?q=… — server-rendered search across published blog + vlog
 * posts. Backs the SearchAction declared in WebSite JSON-LD on the
 * home page, so Google's eventual Sitelinks Searchbox has a real URL
 * to send queries to. Also useful as a direct site feature.
 *
 * `noindex` because search results pages shouldn't enter Google's
 * index (creates duplicate/thin content signals). `follow` so the
 * outbound links to the actual posts still pass authority.
 *
 * `dynamic = 'force-dynamic'` because the response depends entirely
 * on the query string — no caching, no ISR.
 */
export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const q = (searchParams?.q || '').trim()
  return {
    title: q ? `Search: ${q}` : 'Search',
    description: q
      ? `Results matching "${q}" in the P2V Labs journal and films.`
      : 'Search published essays and films from the P2V Labs studio.',
    alternates: { canonical: '/search' },
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || '').trim()
  const { blogs, vlogs } = await searchPublishedContent(q)
  const total = blogs.length + vlogs.length

  return (
    <div className="pt-16">
      <section className="px-5 md:px-10 lg:px-20 pt-16 md:pt-20 pb-12">
        <div className="max-w-3xl mx-auto">

          <p className="text-[10px] tracking-[0.4em] uppercase text-charcoal/45 mb-5">
            Search
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal leading-tight mb-8">
            What are you<br />
            <em className="not-italic text-p2v">looking for?</em>
          </h1>

          {/* Plain HTML form, GET method — matches the SearchAction
              urlTemplate. No client JS needed; the form submission
              becomes /search?q=… which the server re-renders. */}
          <form method="GET" action="/search" className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 mb-12">
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Search the journal and films…"
              autoFocus={!q}
              maxLength={120}
              className="border border-charcoal/15 px-4 py-3 text-base bg-transparent focus:outline-none focus:border-charcoal transition-colors placeholder-charcoal/35"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-charcoal text-cream text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-p2v transition-colors"
            >
              Search
            </button>
          </form>

          {!q && (
            <p className="text-charcoal/55 leading-relaxed">
              Browse published essays from the journal and films from the reel diary.
              Search matches titles, excerpts, and descriptions.
            </p>
          )}

          {q && total === 0 && (
            <div className="border border-charcoal/12 p-7 md:p-10 bg-charcoal/[0.02]">
              <p className="font-display text-2xl md:text-3xl font-bold text-charcoal leading-tight mb-3">
                Nothing matches <em className="not-italic text-p2v">"{q}"</em>.
              </p>
              <p className="text-charcoal/55 leading-relaxed">
                Try a different query, or browse{' '}
                <a href="/blog" className="text-charcoal underline underline-offset-2">the Journal</a>
                {' '}or{' '}
                <a href="/vlog" className="text-charcoal underline underline-offset-2">the Reel Diary</a>.
              </p>
            </div>
          )}

          {q && total > 0 && (
            <p className="text-[10px] tracking-[0.3em] uppercase text-charcoal/50">
              {total} result{total !== 1 ? 's' : ''} for <em className="not-italic text-charcoal/75">"{q}"</em>
            </p>
          )}
        </div>
      </section>

      {q && blogs.length > 0 && (
        <section className="px-5 md:px-10 lg:px-20 pb-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/40 mb-7">
              Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {blogs.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      {q && vlogs.length > 0 && (
        <section className="px-5 md:px-10 lg:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <p className="text-[10px] tracking-[0.35em] uppercase text-charcoal/40 mb-7">
              Films
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {vlogs.map((post) => <VlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
