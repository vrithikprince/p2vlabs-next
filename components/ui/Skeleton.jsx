/* black/8 rather than the amp-surface tint - same value the homepage's
   capability-loop shimmer bars use, and amp-surface is too faint against
   white to read as a loading placeholder. Radius is a default only:
   className lands last, so callers can still override it. */
export default function Skeleton({ className = '', style }) {
  return <div className={`bg-black/8 rounded-md animate-pulse ${className}`} style={style} />
}
