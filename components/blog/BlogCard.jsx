import Link from 'next/link'
import Image from 'next/image'

/**
 * Editorial card for a blog post on /blog. Cover image (or muted
 * placeholder) on top, title + excerpt + date below.
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
      className="group block"
    >
      <div
        className="relative w-full overflow-hidden border border-bone/10 group-hover:border-amber/30 transition-colors"
        style={{ aspectRatio: '16/10', backgroundColor: '#E8E4DF' }}
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
            <span className="font-display text-bone/15 text-3xl">P2V</span>
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
        {post.excerpt && (
          <p className="text-bone/55 text-sm leading-relaxed mt-2 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
