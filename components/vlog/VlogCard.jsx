import Link from 'next/link'
import Image from 'next/image'
import { youtubeThumbnail } from '../../lib/youtube.js'
import Icon from '../ui/Icon.jsx'

/**
 * Card for a vlog post on /vlog. Thumbnail-forward; clicking goes to the
 * vlog detail page (NOT directly to YouTube) so we can show the embed
 * + description + JSON-LD on our own domain.
 *
 * Amp system: rounded-[16px] tile on a hairline border, monochrome type,
 * navy as the single accent (play badge + hover) - same accent the blog
 * cards and the vlog detail page use, so the two feeds read as one family.
 */
export default function VlogCard({ post }) {
  const thumb = post.thumbnail_url || youtubeThumbnail(post.youtube_id, 'maxres')
  const date  = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <Link href={`/vlog/${post.slug}`} className="group block font-plex">
      {/* Ground stays dark (amp-ink-pill) rather than the light amp-surface
          the blog/reel tiles use - a 16:9 YouTube frame letterboxes against
          it, and a pale bar top-and-bottom of a video reads as a bug. Set
          via the token class, same as VlogPlayer's frame; only the aspect
          ratio needs to be inline. */}
      <div
        className="relative w-full overflow-hidden rounded-[16px] border border-amp-hairline bg-amp-ink-pill group-hover:border-amp-navy/40 transition-colors"
        style={{ aspectRatio: '16/9' }}
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

        {/* Play indicator - the card's one chromatic moment, so it carries
            navy rather than the near-black used for buttons elsewhere. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amp-navy/85 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:bg-amp-navy transition-all">
            <Icon n="play" s={22} c="#FFFFFF" style={{ marginLeft: 3 }} />
          </div>
        </div>

        {post.duration && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-semibold tracking-[0.08em] bg-amp-ink-pill/80 text-white rounded-md px-1.5 py-0.5 tabular-nums">
              {post.duration}
            </span>
          </div>
        )}
      </div>

      <div className="pt-5">
        <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-amp-caption mb-2">
          {date}
          {post.author && <span className="text-amp-caption/70"> · {post.author}</span>}
        </p>
        <h2 className="font-plex text-xl md:text-2xl font-semibold text-black leading-tight tracking-[-0.01em] group-hover:text-amp-navy transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-amp-body text-sm leading-relaxed mt-2 line-clamp-2">
            {post.description}
          </p>
        )}
      </div>
    </Link>
  )
}
