/**
 * PricingIllustration — header mark for /packages.
 *
 * Four ascending tiers anchored to a common baseline. Reads as
 * "options at scale" — the floor is the same for all, scope varies up.
 * Third tier is filled brand red (the focal anchor; would correspond to
 * the "you choose here" buyer moment). Hairline weight (1.2px) and
 * single-red accent match the existing illustration language used in
 * the Services panel + ProofBar cards.
 *
 * Sized via viewBox; intrinsic width set on the <svg> so it stays
 * predictable inside the header's flex column without forcing layout.
 */
export default function PricingIllustration() {
  const stroke = 'rgba(26,26,26,0.38)'
  const baseline = 'rgba(26,26,26,0.22)'
  const red = '#c0392b'

  return (
    <svg
      width="200"
      height="150"
      viewBox="0 0 200 150"
      fill="none"
      aria-hidden="true"
    >
      {/* Common baseline — the "floor" all tiers share. */}
      <line x1="0" y1="138" x2="200" y2="138" stroke={baseline} strokeWidth="1" />

      {/* Tier 1 — smallest scope */}
      <rect x="18"  y="100" width="32" height="38"  stroke={stroke} strokeWidth="1.2" />

      {/* Tier 2 */}
      <rect x="62"  y="72"  width="32" height="66"  stroke={stroke} strokeWidth="1.2" />

      {/* Tier 3 — focal, brand red */}
      <rect x="106" y="42"  width="32" height="96"  fill={red} />

      {/* Tier 4 — largest scope */}
      <rect x="150" y="14"  width="32" height="124" stroke={stroke} strokeWidth="1.2" />

      {/* Dashed ascending guideline — the implicit progression connecting
          the tops of each tier. Subtle enough to read as ornament, not
          a chart axis. */}
      <polyline
        points="34,100 78,72 122,42 166,14"
        fill="none"
        stroke="rgba(26,26,26,0.18)"
        strokeWidth="0.8"
        strokeDasharray="2 3"
      />

      {/* Small dots at each tier top — punctuates the progression. */}
      <circle cx="34"  cy="100" r="1.5" fill={stroke} />
      <circle cx="78"  cy="72"  r="1.5" fill={stroke} />
      <circle cx="122" cy="42"  r="2"   fill={red} />
      <circle cx="166" cy="14"  r="1.5" fill={stroke} />
    </svg>
  )
}
