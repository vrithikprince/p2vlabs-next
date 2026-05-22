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
      <div
        className="relative overflow-hidden border border-charcoal/8 group-hover:border-p2v/30 transition-all"
        style={{
          backgroundColor: '#E0DCDA',
          aspectRatio: item.orientation === 'portrait' ? '9/16' : '16/9',
        }}
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
            <div className="absolute inset-[10px] border border-charcoal/8 group-hover:border-p2v/12 transition-colors pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 border border-charcoal/12 flex items-center justify-center group-hover:border-p2v/35 transition-all">
                <Icon n="play" s={22} c="#1a1a1a" className="opacity-20 group-hover:opacity-45 transition-opacity"
                      style={{ marginLeft: '3px' }} />
              </div>
            </div>
          </>
        )}

        {item.duration && (
          <div className="absolute bottom-3 right-3">
            <span className="text-[9px] tracking-[0.1em] bg-charcoal/75 text-cream px-1.5 py-0.5 tabular-nums">
              {item.duration}
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <span className="text-[9px] tracking-[0.15em] uppercase bg-cream/82 text-charcoal/60 px-2 py-1">
            {item.subcategory}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="text-[9px] tracking-[0.15em] uppercase bg-charcoal/65 text-cream px-2 py-1">Video</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-charcoal/78 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 border border-cream/40 flex items-center justify-center">
            <Icon n="play" s={20} c="currentColor" style={{ marginLeft: '3px' }} />
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase text-cream/80">Watch Film</span>
        </div>
      </div>

      <div className="pt-4 pb-6 border-b border-charcoal/10">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold text-charcoal leading-tight">{item.title}</h3>
          <span className="text-[10px] text-charcoal/30 tracking-wider shrink-0 mt-0.5">{item.date}</span>
        </div>
        <p className="text-xs text-charcoal/45 mt-1">{item.client}</p>
        <p className="text-sm text-charcoal/55 leading-relaxed mt-3 line-clamp-2">{item.description}</p>
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
        className="relative overflow-hidden border border-charcoal/8 group-hover:border-p2v/30 transition-all w-full"
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
            <span className="text-[9px] tracking-[0.15em] uppercase bg-p2v text-cream px-2 py-1">Food</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 inset-x-0 p-4">
            <h3 className="font-display text-base font-bold text-cream leading-tight">{item.title}</h3>
            <p className="text-xs text-cream/65 mt-0.5">{item.client}</p>
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
      className="grid grid-cols-1 md:grid-cols-2 border-b border-charcoal/10 last:border-0 group cursor-pointer"
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
        <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/8 transition-colors" />
      </div>

      <div className={`flex flex-col justify-center px-8 py-14 md:px-12 md:py-20 ${even ? '' : 'md:order-1'}`}>
        <div className="mb-6"><Tag red>{item.subcategory}</Tag></div>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal leading-tight mb-3">
          {item.title}
        </h2>
        <p className="text-xs tracking-wider text-charcoal/40 uppercase mb-5">
          {item.client} · {item.date}
        </p>
        <p className="text-base text-charcoal/60 leading-relaxed mb-7">{item.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-charcoal/35 group-hover:text-p2v transition-colors">
          <Icon n="eye" s={14} c="currentColor" />
          <span>View Full Image</span>
        </div>
      </div>
    </div>
  )
}
