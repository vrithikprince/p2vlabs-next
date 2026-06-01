/**
 * FilmsIllustration — header mark for /vlog (The P2V Reel Diary).
 *
 * Side-profile cinema camera:
 *   - Top handle with two short connector posts
 *   - Boxy main body with hairline detail (dials / markings)
 *   - Lens housing protruding from the left — concentric circles
 *     with a brand-red core (the "eye")
 *   - Thin baseline under the body suggesting a tripod mount
 *
 * One red accent (lens center) — deliberately understated, reads as a
 * piece of gear photographed for a magazine spread, not an app icon.
 */
export default function FilmsIllustration() {
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
      {/* Top handle */}
      <rect x="68" y="22" width="62" height="6" stroke={stroke} strokeWidth="1.2" />
      <line x1="80"  y1="28" x2="80"  y2="40" stroke={stroke} strokeWidth="1.2" />
      <line x1="118" y1="28" x2="118" y2="40" stroke={stroke} strokeWidth="1.2" />

      {/* Main body */}
      <rect x="50" y="40" width="125" height="78" stroke={stroke} strokeWidth="1.2" />

      {/* Lens housing — protrudes from the left side of the body */}
      <circle cx="40" cy="79" r="22" stroke={stroke} strokeWidth="1.2" />
      <circle cx="40" cy="79" r="13" stroke={strokeMuted} strokeWidth="1" />
      <circle cx="40" cy="79" r="4"  fill={red} />

      {/* Body detail — implied dials / labels */}
      <g stroke={strokeMuted} strokeWidth="0.8">
        <line x1="95"  y1="55" x2="160" y2="55" />
        <line x1="95"  y1="68" x2="148" y2="68" />
        <line x1="95"  y1="81" x2="155" y2="81" />
      </g>

      {/* Two small dials on the right */}
      <circle cx="150" cy="100" r="3" stroke={strokeMuted} strokeWidth="1" />
      <circle cx="162" cy="100" r="3" stroke={strokeMuted} strokeWidth="1" />

      {/* Tripod mount hint */}
      <line x1="80" y1="120" x2="145" y2="120" stroke={strokeMuted} strokeWidth="1" />
    </svg>
  )
}
