'use client'
import Image from 'next/image'
import Icon from '../ui/Icon.jsx'
import Tag from '../ui/Tag.jsx'
import { categoryBg } from '../../data/reelItems.js'

/**
 * Three card variants for the Reel grid, picked by the `variant` prop.
 *   <ReelCard variant="video"   item={...} onClick={...} />
 *   <ReelCard variant="masonry" item={...} onClick={...} />
 *   <ReelCard variant="cinematic" item={...} index={i} onClick={...} />
 */
export default function ReelCard({ variant, ...rest }) {
  if (variant === 'video')     return <VideoCard {...rest} />
  if (variant === 'masonry')   return <MasonryCard {...rest} />
  if (variant === 'cinematic') return <FoodCinematicItem {...rest} />
  return null
}

/* ── Video Card ── */
function VideoCard({ item, onClick }) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      {/* bg-amp-surface is the cool tile ground the thumbnail loads over -
          the old warm greige read as the cream canvas showing through.
          Kept as the token rather than its hex so it tracks the palette. */}
      <div
        className="relative overflow-hidden rounded-[16px] border border-amp-hairline bg-amp-surface group-hover:border-amp-navy/30 transition-all"
        style={{ aspectRatio: item.orientation === 'portrait' ? '9/16' : '16/9' }}
      >
        {item.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-[10px] rounded-[8px] border border-amp-hairline group-hover:border-amp-navy/15 transition-colors pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border border-amp-hairline flex items-center justify-center group-hover:border-amp-navy/30 transition-all">
                <Icon n="play" s={22} c="#000000" className="opacity-20 group-hover:opacity-45 transition-opacity"
                      style={{ marginLeft: '3px' }} />
              </div>
            </div>
          </>
        )}

        {item.duration && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[10px] font-semibold tracking-[0.08em] bg-amp-ink-pill/80 text-white rounded-md px-1.5 py-0.5 tabular-nums">
              {item.duration}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-semibold tracking-[0.08em] uppercase bg-white/85 text-amp-caption rounded-md px-2 py-1">
            {item.subcategory}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-semibold tracking-[0.08em] uppercase bg-amp-ink-pill/70 text-white rounded-md px-2 py-1">Video</span>
        </div>

        {/* Hover overlay - text-white on the container, because the play
            glyph draws in currentColor and would otherwise inherit the
            body's black straight onto the ink ground. */}
        <div className="absolute inset-0 bg-amp-ink-pill/80 text-white flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center">
            <Icon n="play" s={20} c="currentColor" style={{ marginLeft: '3px' }} />
          </div>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/80">Watch Film</span>
        </div>
      </div>

      <div className="pt-4 pb-6 border-b border-amp-hairline">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-plex text-lg font-semibold text-black leading-tight">{item.title}</h3>
          <span className="text-[11px] text-amp-caption tracking-wider shrink-0 mt-0.5">{item.date}</span>
        </div>
        <p className="text-xs text-amp-caption mt-1">{item.client}</p>
        <p className="text-sm text-amp-body leading-relaxed mt-3 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {item.tags.map((t) => <Tag key={t} red>{t}</Tag>)}
        </div>
      </div>
    </div>
  )
}

/* ── Masonry Photo Card ── */
function MasonryCard({ item, onClick }) {
  const isFood = item.subcategory === 'Food & Restaurant'
  const aspectStyle = { aspectRatio: item.aspectRatio }

  return (
    <div className="group cursor-pointer mb-5 break-inside-avoid" onClick={onClick}>
      <div
        className="relative overflow-hidden rounded-[16px] border border-amp-hairline group-hover:border-amp-navy/30 transition-all w-full"
        style={{ ...aspectStyle, backgroundColor: categoryBg[item.subcategory] || '#E8E4DF' }}
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {isFood && (
          <div className="absolute top-3 left-3">
            {/* category marker - navy, the reel section's single accent */}
            <span className="text-[10px] font-semibold tracking-[0.08em] uppercase bg-amp-navy text-white rounded-md px-2 py-1">Food</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-amp-ink-pill/75 via-amp-ink-pill/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 inset-x-0 p-4">
            <h3 className="font-plex text-base font-semibold text-white leading-tight">{item.title}</h3>
            <p className="text-xs text-white/65 mt-0.5">{item.client}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Food Cinematic Item ── */
function FoodCinematicItem({ item, index, onClick }) {
  const even = index % 2 === 0
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 border-b border-amp-hairline last:border-0 group cursor-pointer"
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden ${even ? '' : 'md:order-2'}`}
        style={{ minHeight: '360px' }}
      >
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-amp-ink-pill/0 group-hover:bg-amp-ink-pill/8 transition-colors" />
      </div>

      <div className={`flex flex-col justify-center px-8 py-14 md:px-12 md:py-20 ${even ? '' : 'md:order-1'}`}>
        <div className="mb-6"><Tag red>{item.subcategory}</Tag></div>
        <h2 className="font-plex text-3xl md:text-4xl font-semibold text-black leading-tight tracking-[-0.01em] mb-3">
          {item.title}
        </h2>
        <p className="text-[12px] font-semibold tracking-[0.08em] text-amp-caption uppercase mb-5">
          {item.client} · {item.date}
        </p>
        <p className="text-base text-amp-body leading-relaxed mb-7">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
        {/* hover cue picks up navy, the same accent the grid's cards
            outline to - the old brand red was the only colour here */}
        <div className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.08em] uppercase text-amp-caption group-hover:text-amp-navy transition-colors">
          <Icon n="eye" s={14} c="currentColor" />
          <span>View Full Image</span>
        </div>
      </div>
    </div>
  )
}
