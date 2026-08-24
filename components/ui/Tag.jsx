/* `red` is the accented variant - kept as the prop name because callers
   across the reel pass it, but it now renders navy: the restrained accent
   the amp system uses for markers and hovers. */
export default function Tag({ children, red = false }) {
  return (
    <span
      className={`text-[11px] font-medium tracking-[0.04em] uppercase px-2 py-0.5 rounded-md border ${
        red ? 'text-amp-navy border-amp-navy/35' : 'text-amp-caption border-amp-hairline'
      }`}
    >
      {children}
    </span>
  )
}
