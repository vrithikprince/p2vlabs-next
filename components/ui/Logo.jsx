const SIZES = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl', xl: 'text-6xl' }

/* font-plex/semibold (600) - not the old Playfair serif/bold - and
   periwinkle for "Labs" instead of brand red, matching the same split
   the Footer's giant wordmark uses (white/periwinkle on dark; here,
   black/periwinkle on light) so the mark reads consistently wherever
   it shows up. */
export default function Logo({ size = 'md', light = false }) {
  const sz = SIZES[size] ?? SIZES.md
  const base = light ? 'text-white' : 'text-black'
  return (
    <span className={`font-plex font-semibold ${sz} tracking-tight ${base}`}>
      P2V <span className="text-amp-periwinkle">Labs</span>
    </span>
  )
}
