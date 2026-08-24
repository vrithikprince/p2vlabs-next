/**
 * Service marks for the Our Services cards.
 *
 * One shared drawing language, matching the camera in LeadCapture: 120x120
 * viewBox, ink (#1a1f23) outlines at a constant 3.2 stroke, white bodies,
 * #f2f4f8 for recessed panels, and exactly ONE accent colour per mark passed
 * in by the card so each illustration inherits its row's accent instead of
 * hard-coding a palette.
 *
 * Deliberately NOT a camera for Photography - LeadCapture already owns that
 * object on this page, and repeating it would read as a stock-icon set rather
 * than a drawn one. Photography gets a print stack instead.
 *
 * clipPath ids are namespaced per mark: two <clipPath id="clip"> on one page
 * silently resolve to whichever parsed last.
 */
const INK = '#1a1f23'
const SW = 3.2
const PANEL = '#f2f4f8'

function Frame({ children, className }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

/* Video Production - clapperboard, tilted mid-clap. */
export function VideoMark({ accent, className }) {
  return (
    <Frame className={className}>
      <defs>
        <clipPath id="sm-clap-bar">
          <rect x="12" y="22" width="96" height="21" rx="6" />
        </clipPath>
      </defs>
      {/* body */}
      <rect x="12" y="47" width="96" height="55" rx="9" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="22" y="60" width="42" height="6" rx="3" fill={PANEL} stroke={INK} strokeWidth="1.6" />
      <rect x="22" y="76" width="26" height="6" rx="3" fill={PANEL} stroke={INK} strokeWidth="1.6" />
      {/* hinged top bar, lifted a few degrees so it reads as mid-clap */}
      <g transform="rotate(-7 60 33)">
        <g clipPath="url(#sm-clap-bar)">
          <rect x="12" y="22" width="96" height="21" fill="#fff" />
          <path
            d="M26 20 L36 46 M48 20 L58 46 M70 20 L80 46 M92 20 L102 46"
            stroke={accent}
            strokeWidth="7"
          />
        </g>
        <rect x="12" y="22" width="96" height="21" rx="6" stroke={INK} strokeWidth={SW} />
      </g>
    </Frame>
  )
}

/* Photography - a stack of prints, the top one holding a small landscape. */
export function PhotographyMark({ accent, className }) {
  return (
    <Frame className={className}>
      <defs>
        <clipPath id="sm-print-top">
          <rect x="30" y="30" width="66" height="66" rx="7" />
        </clipPath>
      </defs>
      <rect x="20" y="28" width="62" height="62" rx="7" transform="rotate(-11 51 59)"
            fill={PANEL} stroke={INK} strokeWidth={SW} />
      <rect x="26" y="26" width="64" height="64" rx="7" transform="rotate(-4 58 58)"
            fill="#fff" stroke={INK} strokeWidth={SW} />
      <g>
        <rect x="30" y="30" width="66" height="66" rx="7" fill="#fff" stroke={INK} strokeWidth={SW} />
        <g clipPath="url(#sm-print-top)">
          {/* the photo itself: sun + ridge */}
          <circle cx="79" cy="48" r="7.5" fill={accent} />
          <path d="M30 84 L52 62 L68 78 L80 68 L96 84 Z" fill={PANEL} stroke={INK} strokeWidth="2.2" />
        </g>
        <rect x="30" y="30" width="66" height="66" rx="7" stroke={INK} strokeWidth={SW} />
      </g>
    </Frame>
  )
}

/* Social Content - a vertical reel on a phone, with an engagement tick. */
export function SocialMark({ accent, className }) {
  return (
    <Frame className={className}>
      <rect x="33" y="12" width="54" height="96" rx="11" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="40" y="24" width="40" height="62" rx="5" fill={PANEL} stroke={INK} strokeWidth="1.8" />
      {/* play */}
      <path d="M55 45 L69 55 L55 65 Z" fill={accent} />
      {/* the "it performed" beat - a rising bar pair under the frame */}
      <path d="M46 96 h12" stroke={INK} strokeWidth="3" />
      <path d="M64 96 h10" stroke={accent} strokeWidth="3" />
      {/* floating heart, offset so the card has a little asymmetry */}
      <path
        d="M94 34c0-4 3-7 6.5-7 2 0 3.7 1 4.6 2.5.9-1.5 2.6-2.5 4.6-2.5 3.5 0 6.3 3 6.3 7 0 7-11 13-11 13s-11-6-11-13z"
        fill="#fff" stroke={INK} strokeWidth="2.6" transform="translate(-8 0) scale(0.82) translate(14 6)"
      />
    </Frame>
  )
}

/* Brand Visuals - a small brand board: type specimen plus swatch chips. */
export function BrandMark({ accent, className }) {
  return (
    <Frame className={className}>
      <rect x="14" y="18" width="92" height="84" rx="9" fill="#fff" stroke={INK} strokeWidth={SW} />
      {/* type specimen */}
      <text
        x="30" y="62"
        fontFamily="'Segoe UI', Arial, Helvetica, sans-serif"
        fontSize="34" fontWeight="700" fill={INK}
      >
        Aa
      </text>
      <path d="M30 71 h40" stroke={PANEL} strokeWidth="4" />
      {/* Swatch chips - the accent has to be the only saturated one. The third
          chip was solid ink, which is fine against violet or periwinkle but
          vanishes into the accent on the navy rows (#001a4f vs #1a1f23 is the
          same dark at 12px), so it is a mid neutral instead. */}
      <rect x="30" y="80" width="15" height="12" rx="3.5" fill={accent} />
      <rect x="50" y="80" width="15" height="12" rx="3.5" fill={PANEL} stroke={INK} strokeWidth="1.8" />
      <rect x="70" y="80" width="15" height="12" rx="3.5" fill="#9fa5ad" />
      {/* corner registration mark */}
      <path d="M92 30 v10 M87 35 h10" stroke={INK} strokeWidth="2.4" />
    </Frame>
  )
}

/* GenAI - a small workflow graph, the middle node generating. */
export function GenAiMark({ accent, className }) {
  return (
    <Frame className={className}>
      {/* connections drawn first so the nodes sit on top of them */}
      <path d="M34 34 H62 a10 10 0 0 1 10 10 v12" stroke={INK} strokeWidth="2.6" />
      <path d="M34 86 H62 a10 10 0 0 0 10 -10 v-8" stroke={INK} strokeWidth="2.6" />
      <path d="M86 60 H98" stroke={accent} strokeWidth="2.6" />
      {/* input nodes */}
      <rect x="12" y="24" width="24" height="20" rx="6" fill="#fff" stroke={INK} strokeWidth={SW} />
      <rect x="12" y="76" width="24" height="20" rx="6" fill="#fff" stroke={INK} strokeWidth={SW} />
      {/* the generating node */}
      <rect x="58" y="44" width="30" height="32" rx="9" fill={accent} stroke={INK} strokeWidth={SW} />
      <path d="M73 52 l2.6 5.6 5.6 2.6 -5.6 2.6 -2.6 5.6 -2.6 -5.6 -5.6 -2.6 5.6 -2.6 Z" fill="#fff" />
      {/* output */}
      <circle cx="104" cy="60" r="7" fill="#fff" stroke={INK} strokeWidth={SW} />
    </Frame>
  )
}

export const SERVICE_MARKS = {
  video: VideoMark,
  photography: PhotographyMark,
  social: SocialMark,
  brand: BrandMark,
  genai: GenAiMark,
}
