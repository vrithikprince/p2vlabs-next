/**
 * Decoration shared by /services and /services/[slug].
 *
 * The service marks are technical drawings, so the page under them is
 * drafted like one: a hairline field, registration crosses where a printer
 * would put them, and accent colour arriving as light rather than as a
 * fill. Keeping the pieces in one file is what stops the hub and the detail
 * pages drifting into two systems that merely resemble each other.
 *
 * `Wash` is deliberately the same technique already used by the hero and
 * the proof bar - a blurred radial at low alpha - rather than a new
 * gradient vocabulary invented for these pages.
 *
 * All of it is presentational: aria-hidden, no text, no tab stops, and
 * nothing here touches the JSON-LD.
 */

/** Hairline drafting grid, faded out by a mask so it reads as paper. */
export function GridField({ dark = false, band = false, tight = false, className = '' }) {
  return (
    <div
      className={[
        'pointer-events-none absolute inset-0 svc-field',
        dark && 'svc-field-dark',
        band && 'svc-field-band',
        tight && 'svc-field-tight',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  )
}

/**
 * One soft colour cloud. `rgb` is the "R G B" triple from ACCENT.
 *
 * Sizes are clamped rather than fixed because these sit behind text: a
 * 520px cloud that looks like ambient light on a desktop becomes a hard
 * coloured disc behind a headline at 380px wide.
 */
export function Wash({ rgb, alpha = 0.16, size = 'clamp(280px,32vw,520px)', blur = 46, className = '', style = {} }) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgb(${rgb} / ${alpha}), rgb(${rgb} / 0) 70%)`,
        filter: `blur(${blur}px)`,
        ...style,
      }}
    />
  )
}

/**
 * Registration crosses at the corners of a section - the marks a printer
 * aligns plates against. They cost four hairlines each and are the
 * cheapest single thing that makes a layout read as drafted rather than
 * dropped in.
 */
export function RegMarks({ dark = false, className = '' }) {
  const tone = dark ? 'bg-white/25' : 'bg-amp-navy/20'
  const spots = ['left-3 top-3', 'right-3 top-3', 'left-3 bottom-3', 'right-3 bottom-3']
  return (
    <div className={`pointer-events-none absolute inset-0 hidden md:block ${className}`} aria-hidden="true">
      {spots.map((pos) => (
        <span key={pos} className={`absolute ${pos} w-3 h-3`}>
          <span className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 ${tone}`} />
          <span className={`absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 ${tone}`} />
        </span>
      ))}
    </div>
  )
}

/**
 * The dark ground used for the two moments the page should land on: the
 * price on a detail page, and the closing call on the hub.
 *
 * Navy into ink rather than ink into black - a gradient between two greys
 * is invisible, and the navy end is the one accent the system already
 * treats as structural. Grain sits on top because a wash this large bands
 * visibly on an 8-bit display.
 */
export function DarkGround({ rgb, children, className = '' }) {
  return (
    <section className={`relative overflow-hidden svc-grain ${className}`}>
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: 'linear-gradient(140deg, #001a4f 0%, #0a1226 52%, #16191f 100%)' }}
      />
      <GridField dark band />
      <Wash rgb={rgb} alpha={0.3} blur={60} size="clamp(300px,38vw,620px)" style={{ top: '-14%', right: '-6%' }} />
      <Wash rgb="105 128 255" alpha={0.22} blur={60} size="clamp(260px,30vw,480px)" style={{ bottom: '-22%', left: '2%' }} />
      <RegMarks dark />
      <div className="relative">{children}</div>
    </section>
  )
}
