import BlogCard from '../../components/blog/BlogCard.jsx'
import VlogCard from '../../components/vlog/VlogCard.jsx'
import { searchPublishedContent } from '../../lib/cms.js'

/**
 * /search?q=… - server-rendered search across published blog + vlog
 * posts. Backs the SearchAction declared in WebSite JSON-LD on the
 * home page, so Google's eventual Sitelinks Searchbox has a real URL
 * to send queries to. Also useful as a direct site feature.
 *
 * `noindex` because search results pages shouldn't enter Google's
 * index (creates duplicate/thin content signals). `follow` so the
 * outbound links to the actual posts still pass authority.
 *
 * `dynamic = 'force-dynamic'` because the response depends entirely
 * on the query string - no caching, no ISR.
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
      {/* font-plex on every section here - BlogCard/VlogCard already set it
          on their own roots, so without it the search chrome (eyebrows,
          lede, empty state) rendered in the base Inter while the results
          under it were Plex. */}
      <section className="font-plex px-5 md:px-10 lg:px-20 pt-16 md:pt-20 pb-12">
        <div className="max-w-3xl mx-auto">

          {/* Navy is this page's single accent - it carries the eyebrow
              dots and the echoed query, nothing else. */}
          <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
            Search
          </p>
          <h1 className="font-plex text-4xl md:text-5xl font-semibold text-black leading-tight tracking-[-0.01em] mb-8">
            What are you<br />
            <em className="not-italic text-black">looking for?</em>
          </h1>

          {/* Plain HTML form, GET method - matches the SearchAction
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
              className="rounded-md border border-amp-hairline px-4 py-3 text-base bg-transparent focus:outline-none focus:border-black transition-colors placeholder-amp-caption/70"
            />
            {/* Near-black fill, never an accent colour - the amp system keeps
                its accents off calls to action. rounded-md rather than a full
                pill so it stays paired with the input beside it. */}
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-amp-ink-pill text-white text-sm font-semibold hover:bg-black transition-colors"
            >
              Search
            </button>
          </form>

          {!q && (
            <p className="text-amp-body leading-relaxed">
              Browse published essays from the journal and films from the reel diary.
              Search matches titles, excerpts, and descriptions.
            </p>
          )}

          {q && total === 0 && (
            <div className="rounded-[16px] border border-amp-hairline p-7 md:p-10 bg-amp-surface">
              <p className="font-plex text-2xl md:text-3xl font-semibold text-black leading-tight tracking-[-0.01em] mb-3">
                Nothing matches <em className="not-italic text-amp-navy">"{q}"</em>.
              </p>
              <p className="text-amp-body leading-relaxed">
                Try a different query, or browse{' '}
                <a href="/blog" className="text-black underline underline-offset-2">the Journal</a>
                {' '}or{' '}
                <a href="/vlog" className="text-black underline underline-offset-2">the Reel Diary</a>.
              </p>
            </div>
          )}

          {q && total > 0 && (
            <p className="text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption">
              {total} result{total !== 1 ? 's' : ''} for <em className="not-italic text-amp-navy">"{q}"</em>
            </p>
          )}
        </div>
      </section>

      {q && blogs.length > 0 && (
        <section className="font-plex px-5 md:px-10 lg:px-20 pb-16">
          <div className="max-w-7xl mx-auto">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
              Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {blogs.map((post) => <BlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

      {/* same pb as the Articles block above - these two are structurally
          identical, and either can be the last thing on the page, so the
          foot of /search shouldn't shift depending on which one matched. */}
      {q && vlogs.length > 0 && (
        <section className="font-plex px-5 md:px-10 lg:px-20 pb-16">
          <div className="max-w-7xl mx-auto">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
              Films
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {vlogs.map((post) => <VlogCard key={post.id} post={post} />)}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
