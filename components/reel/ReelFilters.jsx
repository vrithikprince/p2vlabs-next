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
        /* amp button convention, chip scale: the selected filter is the
           near-black pill, the rest are hairline outlines on the white
           ground. Inactive labels sit at caption grey, the system's colour
           for an inactive state, so the jump to the black pill reads.
           No accent colour here on purpose - the chip row sits directly
           above the work, and a coloured active state would compete with
           the imagery for the eye. */
        <button
          key={f}
          onClick={() => onChange(f)}
          className={`reel-filter-btn px-4 py-2 rounded-md text-[12px] tracking-[0.08em] uppercase font-semibold border transition-colors ${
            active === f
              ? 'bg-amp-ink-pill text-white border-amp-ink-pill hover:bg-black hover:border-black'
              : 'border-amp-hairline text-amp-caption hover:border-black/40 hover:text-black'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
