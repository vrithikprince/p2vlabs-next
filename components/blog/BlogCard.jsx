import Link from 'next/link'
import Image from 'next/image'

/**
 * Card for a blog post on /blog. Cover image (or muted placeholder) on
 * top, title + excerpt + date below. Amp system: rounded-[16px] tile on
 * a hairline border, monochrome type, navy as the only hover accent.
 */
export default function BlogCard({ post }) {
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : ''

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block font-plex"
    >
      {/* Placeholder tint is amp-surface (#f2f4f8), inline because the
          aspect-ratio next to it has to be inline anyway. */}
      <div
        className="relative w-full overflow-hidden rounded-[16px] border border-amp-hairline group-hover:border-amp-navy/40 transition-colors"
        style={{ aspectRatio: '16/10', backgroundColor: '#f2f4f8' }}
      >
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-plex font-semibold text-black/15 text-3xl">P2V</span>
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
        {post.excerpt && (
          <p className="text-amp-body text-sm leading-relaxed mt-2 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
