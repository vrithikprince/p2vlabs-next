/**
 * JournalIllustration — header mark for /blog (The P2V Journal).
 *
 * Open book in flat editorial style:
 *   - Two facing pages with a thin spine
 *   - Text-lines on both pages (left page fuller — "already written";
 *     right page partial — "still being written")
 *   - The shortest right-page line is brand red — reads as the active
 *     entry / current draft, and carries the one-red-accent rule shared
 *     across the site's illustration language.
 */
export default function JournalIllustration() {
  const stroke      = 'rgba(26,26,26,0.40)'
  const strokeMuted = 'rgba(26,26,26,0.22)'
  const red         = '#c0392b'

  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
    >
      {/* Book outline */}
      <rect x="20" y="40" width="160" height="90" stroke={stroke} strokeWidth="1.2" />

      {/* Spine */}
      <line x1="100" y1="40" x2="100" y2="130" stroke={strokeMuted} strokeWidth="1" />

      {/* Left page — text lines (fuller, finished) */}
      <g stroke={strokeMuted} strokeWidth="0.8">
        <line x1="30" y1="54"  x2="90" y2="54"  />
        <line x1="30" y1="64"  x2="82" y2="64"  />
        <line x1="30" y1="74"  x2="87" y2="74"  />
        <line x1="30" y1="84"  x2="78" y2="84"  />
        <line x1="30" y1="94"  x2="85" y2="94"  />
        <line x1="30" y1="104" x2="72" y2="104" />
        <line x1="30" y1="114" x2="80" y2="114" />
      </g>

      {/* Right page — text lines (partial, mid-write) */}
      <g stroke={strokeMuted} strokeWidth="0.8">
        <line x1="110" y1="54" x2="170" y2="54" />
        <line x1="110" y1="64" x2="165" y2="64" />
        <line x1="110" y1="74" x2="160" y2="74" />
      </g>

      {/* Active entry — the line currently being written */}
      <line x1="110" y1="84" x2="138" y2="84" stroke={red} strokeWidth="1.2" />
    </svg>
  )
}
