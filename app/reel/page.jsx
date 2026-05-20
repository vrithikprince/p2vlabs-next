import { createServerClient, SB_PUBLIC } from '../../lib/supabase.js'
import { VIDEO_ITEMS, PHOTO_ITEMS } from '../../data/reelItems.js'
import ReelClient from '../../components/reel/ReelClient.jsx'

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
  return <ReelClient videoItems={videos} photoItems={photos} />
}
