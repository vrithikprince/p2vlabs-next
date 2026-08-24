/**
 * Shared minimal page header for non-landing routes (Packages, Journal,
 * Films, etc.). Replaces per-page hero blocks that grew large two-column
 * layouts with their own H1 + lede paragraph + hairline.
 *
 * Design rules:
 *   - Kicker uses the amp eyebrow idiom (13px semibold caps + dot marker),
 *     same as the homepage hero/FAQ, so every inner page opens in the
 *     system's voice rather than the old tiny-tracked-caps one.
 *   - Title is modest - clamp(2rem, 4.5vw, 3rem). Hero-scale typography
 *     (60-80px) is reserved for the landing page. Editorial section
 *     headers stay around 32-48px so the page content gets the weight.
 *   - Plex, not Playfair: the amp system is all sans, and the family is set
 *     on the section rather than the h1 alone - the base stylesheet falls
 *     back to Inter, so a title-only font-plex left the kicker and tagline
 *     in a different face from the title they belong to.
 *     The accent line still sits on its own line via <br> for the two-line
 *     rhythm, but stays black - colour is rationed to the eyebrow dot.
 *   - No side-paragraph - long framing copy belongs further down,
 *     contextually next to whatever it's framing.
 *   - One hairline at the foot of the header anchors the block visually.
 */
export default function PageHeader({ kicker, title, italic, tagline, children }) {
  return (
    <section className="font-plex px-5 md:px-10 lg:px-20 pt-12 lg:pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-violet" />
              {kicker}
            </p>
            <h1
              className="font-plex font-semibold text-black leading-[1.08] tracking-[-0.01em]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
            >
              {title}
              {italic && (
                <>
                  <br />
                  <em className="not-italic text-black">{italic}</em>
                </>
              )}
            </h1>
            {tagline && (
              <p className="mt-5 text-amp-body text-sm lg:text-base max-w-xl leading-relaxed">
                {tagline}
              </p>
            )}
          </div>
          {/* Illustration slot - hidden below lg so the mobile header stays
              clean. Page passes its own SVG via children. */}
          {children && (
            <div className="hidden lg:flex lg:col-span-4 justify-end items-end">
              {children}
            </div>
          )}
        </div>
        <div className="h-px bg-amp-hairline mt-10 lg:mt-12" />
      </div>
    </section>
  )
}
