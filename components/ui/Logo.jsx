const SIZES = { sm: 'text-xl', md: 'text-2xl', lg: 'text-4xl', xl: 'text-6xl' }

export default function Logo({ size = 'md', light = false }) {
  const sz = SIZES[size] ?? SIZES.md
  const base = light ? 'text-bone' : 'text-bone'
  return (
    <span className={`font-display font-bold ${sz} tracking-tight ${base}`}>
      P2V <span className="text-amber">Labs</span>
    </span>
  )
}
