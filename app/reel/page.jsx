import Link from 'next/link'
import { createServerClient, SB_PUBLIC } from '../../lib/supabase.js'
import { VIDEO_ITEMS, PHOTO_ITEMS } from '../../data/reelItems.js'
import ReelClient from '../../components/reel/ReelClient.jsx'
import Footer from '../../components/layout/Footer.jsx'

const WA_REEL = 'https://wa.me/917048824616?text=' + encodeURIComponent(
  'Hi P2V Labs, I just saw your reel. I’d like to discuss creating something similar for my brand — could you share the next steps?'
)

/**
 * /reel — Incremental Static Regeneration.
 *
 * The Vite app fetched reel items in a client effect with a silent fallback to
 * bundled VIDEO_ITEMS / PHOTO_ITEMS. We keep the same contract but resolve it
 * server-side at build time + every 60 minutes, so the HTML shipped to crawlers
 * already contains every title, client, description, and image URL.
 */
export const revalidate = 3600

export async function generateMetadata() {
  return {
    title: 'Our Work — The Reel',
    description:
      'Explore P2V Labs portfolio — cinematic brand reels, product photography, food photography, and corporate films created for businesses across Ahmedabad and Gujarat.',
    alternates: { canonical: '/reel' },
    openGraph: {
      title: 'The Reel — P2V Labs Portfolio',
      url: '/reel',
    },
  }
}

async function loadReelItems() {
  /* Fall back to bundled items if Supabase env vars are missing (e.g. local
     dev without .env.local). Same shape as the Vite app's silent fallback. */
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { videos: VIDEO_ITEMS, photos: PHOTO_ITEMS }
  }

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('reel_items')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error || !data?.length) {
      return { videos: VIDEO_ITEMS, photos: PHOTO_ITEMS }
    }

    const videos = data.filter((r) => r.category === 'video').map((r) => ({
      id: r.id, category: r.category, subcategory: r.subcategory,
      title: r.title, client: r.client, description: r.description,
      videoUrl:     SB_PUBLIC(`reel/${r.file_path}`),
      thumbnailUrl: r.thumbnail_path ? SB_PUBLIC(`reel/${r.thumbnail_path}`) : null,
      duration: r.duration, tags: r.tags || [],
      date: r.created_at?.slice(0, 4), featured: r.featured,
      orientation: r.orientation || 'landscape',
    }))
    const photos = data.filter((r) => r.category === 'photo').map((r) => ({
      id: r.id, category: r.category, subcategory: r.subcategory,
      title: r.title, client: r.client, description: r.description,
      imageUrl: SB_PUBLIC(`reel/${r.file_path}`),
      tags: r.tags || [], date: r.created_at?.slice(0, 4), featured: r.featured,
      aspectRatio: r.aspect_ratio || '3/2',
    }))

    return {
      videos: videos.length ? videos : VIDEO_ITEMS,
      photos: photos.length ? photos : PHOTO_ITEMS,
    }
  } catch {
    return { videos: VIDEO_ITEMS, photos: PHOTO_ITEMS }
  }
}

export default async function ReelPage() {
  const { videos, photos } = await loadReelItems()
  return (
    <>
      <ReelClient videoItems={videos} photoItems={photos} />

      {/* Closing CTA — highest-intent moment on the site is right after
          someone watches the portfolio. Charcoal section matches the
          /packages closing CTA so the page chrome reads as one system. */}
      <section className="py-16 lg:py-24 px-5 md:px-10 lg:px-20 bg-charcoal">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-cream/40 mb-6">
            Like what you see?
          </p>
          <h2
            className="font-display font-bold text-cream leading-tight mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            The next reel
            <br />
            <em className="not-italic text-p2v">could be yours.</em>
          </h2>
          <p className="text-cream/60 leading-relaxed text-[15px] max-w-xl mx-auto mb-10">
            Tell us about your brand, your dishes, your story — we'll shape a
            quote against what you actually need.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-8">
            <a
              href={WA_REEL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-between px-6 py-4 bg-p2v text-cream hover:bg-cream hover:text-charcoal transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">WhatsApp</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a
              href="mailto:hello@p2vlabs.in?subject=Project%20inquiry"
              className="flex-1 flex items-center justify-between px-6 py-4 border border-cream/25 text-cream hover:border-cream transition-colors"
            >
              <span className="text-xs tracking-[0.15em] uppercase font-medium">Email</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="1.5"
                   strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          </div>

          {/* Subordinate path for visitors who want to see prices before
              talking to a human. Lower-key styling on purpose. */}
          <Link
            href="/packages"
            className="text-cream/45 hover:text-cream text-[11px] tracking-[0.25em] uppercase inline-block transition-colors"
          >
            Or see packages →
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
