/**
 * Shared minimal page header for non-landing routes (Packages, Journal,
 * Films, etc.). Replaces per-page hero blocks that grew large two-column
 * layouts with their own H1 + lede paragraph + hairline.
 *
 * Design rules:
 *   - Kicker (tiny tracked caps) for the section name.
 *   - Title is modest — clamp(2rem, 4.5vw, 3rem). Hero-scale typography
 *     (60–80px) is reserved for the landing page. Editorial section
 *     headers stay around 32–48px so the page content gets the weight.
 *   - Italic accent in brand red sits on its own line via <br>, the same
 *     two-line rhythm used across the site (hero, Positioning block).
 *   - No side-paragraph — long framing copy belongs further down,
 *     contextually next to whatever it's framing.
 *   - One hairline at the foot of the header anchors the block visually.
 */
export default function PageHeader({ kicker, title, italic, tagline, children }) {
  return (
    <section className="px-5 md:px-10 lg:px-20 pt-12 lg:pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="text-[10px] tracking-[0.4em] uppercase text-charcoal/45 mb-5">
              {kicker}
            </p>
            <h1
              className="font-display font-bold text-charcoal leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}
            >
              {title}
              {italic && (
                <>
                  <br />
                  <em className="not-italic text-p2v">{italic}</em>
                </>
              )}
            </h1>
            {tagline && (
              <p className="mt-5 text-charcoal/50 italic text-sm lg:text-base max-w-xl leading-relaxed">
                {tagline}
              </p>
            )}
          </div>
          {/* Illustration slot — hidden below lg so the mobile header stays
              clean. Page passes its own SVG via children. */}
          {children && (
            <div className="hidden lg:flex lg:col-span-4 justify-end items-end">
              {children}
            </div>
          )}
        </div>
        <div className="h-px bg-charcoal/10 mt-10 lg:mt-12" />
      </div>
    </section>
  )
}
