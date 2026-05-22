import Link from 'next/link'
import Image from 'next/image'
import { youtubeThumbnail } from '../../lib/youtube.js'
import Icon from '../ui/Icon.jsx'

/**
 * Card for a vlog post on /vlog. Thumbnail-forward; clicking goes to the
 * vlog detail page (NOT directly to YouTube) so we can show the embed
 * + description + JSON-LD on our own domain.
 */
export default function VlogCard({ post }) {
  const thumb = post.thumbnail_url || youtubeThumbnail(post.youtube_id, 'maxres')
  const date  = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <Link href={`/vlog/${post.slug}`} className="group block">
      <div
        className="relative w-full overflow-hidden border border-bone/10 group-hover:border-amber/30 transition-colors"
        style={{ aspectRatio: '16/9', backgroundColor: '#1a1a1a' }}
      >
        {thumb && (
          <Image
            src={thumb}
            alt={post.thumbnail_alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
        )}

        {/* Play indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber/85 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:bg-amber transition-all">
            <Icon n="play" s={22} c="#F5F0E8" style={{ marginLeft: 3 }} />
          </div>
        </div>

        {post.duration && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] tracking-[0.1em] bg-ink/80 text-bone px-2 py-1 tabular-nums">
              {post.duration}
            </span>
          </div>
        )}
      </div>

      <div className="pt-5">
        <p className="text-[10px] tracking-[0.3em] uppercase text-bone/40 mb-2">
          {date}
          {post.author && <span className="text-bone/30"> · {post.author}</span>}
        </p>
        <h2 className="font-display text-xl md:text-2xl font-bold text-bone leading-tight group-hover:text-amber transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-bone/55 text-sm leading-relaxed mt-2 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </Link>
  )
}
