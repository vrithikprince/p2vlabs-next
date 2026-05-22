'use client'

export const FILTERS = [
  'All',
  'Video',
  'Photography',
  'Food & Restaurant',
  'Influencer Work',
  'Travel',
]

export default function ReelFilters({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`reel-filter-btn px-4 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium border transition-colors ${
            active === f
              ? 'bg-bone text-ink border-bone'
              : 'border-bone/18 text-bone/55 hover:border-bone/40 hover:text-bone'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
