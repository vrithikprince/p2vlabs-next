'use client'
import { useEffect } from 'react'
import useLockScroll from '../ui/useLockScroll.js'
import Icon from '../ui/Icon.jsx'
import Tag from '../ui/Tag.jsx'

/**
 * Full-screen photo lightbox with prev/next navigation, ESC to close,
 * arrow-key navigation, and a side info panel. Keeps a plain <img> tag here
 * (rather than next/image) because the image needs free max-width/max-height
 * sizing within the overlay; next/image's optimization win is marginal in a
 * full-screen modal that the user has already actively opened.
 */
export default function PhotoLightbox({ items, index, onClose, onChange }) {
  useLockScroll()
  const item = items[index]

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && index > 0)                onChange(index - 1)
      if (e.key === 'ArrowRight' && index < items.length - 1) onChange(index + 1)
    }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 bg-ink/96 flex flex-col md:flex-row">
      <div
        className="flex-1 relative flex items-center justify-center p-4 md:p-10 min-h-[55vw] md:min-h-0"
        onClick={onClose}
      >
        {index > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(index - 1) }}
            className="absolute left-3 md:left-5 z-10 w-9 h-9 border border-bone/20 flex items-center justify-center text-bone hover:border-bone/50 hover:bg-ink/5 transition-colors"
            aria-label="Previous"
          >
            <Icon n="arrow" s={16} c="currentColor" style={{ transform: 'rotate(180deg)' }} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.id}
          src={item.imageUrl}
          alt={item.title}
          className="max-w-full object-contain"
          style={{ maxHeight: 'min(75vh, 600px)' }}
          onClick={(e) => e.stopPropagation()}
        />

        {index < items.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(index + 1) }}
            className="absolute right-3 md:right-5 z-10 w-9 h-9 border border-bone/20 flex items-center justify-center text-bone hover:border-bone/50 hover:bg-ink/5 transition-colors"
            aria-label="Next"
          >
            <Icon n="arrow" s={16} c="currentColor" />
          </button>
        )}

        <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.3em] uppercase text-bone/30">
          {index + 1} / {items.length}
        </p>
      </div>

      <div className="md:w-72 bg-ink flex flex-col p-6 overflow-y-auto border-t border-bone/20 md:border-t-0 md:border-l">
        <div className="flex items-center justify-between mb-6">
          <Tag red>{item.subcategory}</Tag>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-bone/40 hover:text-bone transition-colors"
            aria-label="Close"
          >
            <Icon n="x" s={16} />
          </button>
        </div>
        <h2 className="font-display text-xl font-bold text-bone leading-tight mb-1">{item.title}</h2>
        <p className="text-xs text-bone/45 mb-4">{item.client} · {item.date}</p>
        <p className="text-sm text-bone/60 leading-relaxed mb-5">{item.description}</p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {item.tags.map((t) => <Tag key={t}>{t}</Tag>)}
        </div>
      </div>
    </div>
  )
}
