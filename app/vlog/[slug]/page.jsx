import Link from 'next/link'
import { notFound } from 'next/navigation'
import VlogPlayer from '../../../components/vlog/VlogPlayer.jsx'
import PostCTA from '../../../components/blog/PostCTA.jsx'
import {
  getVlogPostBySlug,
  getPublishedVlogSlugs,
} from '../../../lib/cms.js'
import {
  durationToIso,
  youtubeEmbed,
  youtubeThumbnail,
  youtubeWatch,
} from '../../../lib/youtube.js'
import { buildPostMetadata, canonicalUrl, SITE_URL, breadcrumbsJsonLd } from '../../../lib/seo.js'

/** /vlog/[slug] - individual vlog page. */
export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const slugs = await getPublishedVlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const post = await getVlogPostBySlug(params.slug)
  const base = buildPostMetadata({ kind: 'vlog', post })

  /* VideoObject pages benefit from og:video for richer share cards;
     buildPostMetadata doesn't add that (it's vlog-specific), so we
     spread the helper's output and tack videos onto openGraph. */
  if (post) {
    const videoEmbed = youtubeEmbed(post.youtube_id)
    if (videoEmbed) {
      base.openGraph = {
        ...base.openGraph,
        videos: [{ url: videoEmbed }],
      }
    }
  }
  return base
}

export default async function VlogPost({ params }) {
  const post = await getVlogPostBySlug(params.slug)
  if (!post) notFound()

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  const thumb = post.thumbnail_url || youtubeThumbnail(post.youtube_id, 'maxres')
  const isoDuration = durationToIso(post.duration)

  /* JSON-LD VideoObject - gives Google the structured data needed to
     surface this page in Video search results. */
  const jsonLd = {
    '@context':     'https://schema.org',
    '@type':        'VideoObject',
    name:           post.title,
    description:    post.description || post.meta_description || post.title,
    thumbnailUrl:   thumb ? [thumb] : undefined,
    uploadDate:     post.published_at || undefined,
    duration:       isoDuration || undefined,
    embedUrl:       youtubeEmbed(post.youtube_id) || undefined,
    contentUrl:     youtubeWatch(post.youtube_id) || undefined,
    publisher: {
      '@type': 'Organization',
      name:    'P2V Labs',
      logo:    { '@type': 'ImageObject', url: `${SITE_URL}/icon.png` },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   canonicalUrl(`/vlog/${post.slug}`),
    },
  }

  /* BreadcrumbList - SERP trail "p2vlabs.in › Films › <Vlog Title>". */
  const breadcrumbs = breadcrumbsJsonLd([
    { name: 'Home',     path: '/' },
    { name: 'Films',    path: '/vlog' },
    { name: post.title, path: `/vlog/${post.slug}` },
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

      <article className="font-plex bg-white pb-20">

        {/* Header - same column width as the player + description, so
            the whole page reads as a single editorial column. */}
        <header className="px-5 md:px-10 pt-12 md:pt-16 max-w-3xl mx-auto">
          <Link
            href="/vlog"
            className="text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption hover:text-amp-navy transition-colors"
          >
            ← The Reel Diary
          </Link>

          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-amp-caption mt-9 mb-4">
            {date}
            {post.author   && <span className="text-amp-caption/70"> · {post.author}</span>}
            {post.duration && <span className="text-amp-caption/70"> · {post.duration}</span>}
          </p>

          <h1 className="font-plex font-semibold text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] tracking-tight text-black">
            {post.title}
          </h1>
        </header>

        {/* Player */}
        <div className="mt-10 md:mt-12 px-5 md:px-10 max-w-3xl mx-auto">
          <VlogPlayer
            youtubeId={post.youtube_id}
            title={post.title}
            thumbnailUrl={post.thumbnail_url}
            thumbnailAlt={post.thumbnail_alt}
          />
        </div>

        {/* Description */}
        {post.description && (
          <div className="px-5 md:px-10 mt-12 md:mt-14 max-w-3xl mx-auto">
            {/* Eyebrow + dot, the homepage idiom; navy is this page's one
                accent, same as the player's play badge. */}
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
              About this film
            </p>
            <div className="text-amp-body leading-relaxed text-base md:text-lg whitespace-pre-wrap">
              {post.description}
            </div>
          </div>
        )}
      </article>

      <PostCTA kind="vlog" slug={post.slug} title={post.title} />
    </div>
  )
}
