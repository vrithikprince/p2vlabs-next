/**
 * PortalMockup — editorial-styled mockup of clients.p2vlabs.in.
 *
 * Mounted on /packages to justify the Plan C tier. Built with
 * the same vocabulary as the rest of the site:
 *   - 1px hairlines on charcoal/10–15
 *   - Two opacity tiers (charcoal/40 for labels, charcoal/70 for body)
 *   - Exactly one red accent — the deliverable awaiting approval, which
 *     is also the most "load-bearing" action in the real portal
 *
 * Floating notification on the left is hidden below lg: to keep mobile
 * uncluttered. Sample data is intentionally restaurant-shaped (Saffron
 * Kitchen, Diwali specials) so the mockup reads as "this is what your
 * portal would look like" to the primary persona — local restaurant
 * owners on monthly plans.
 */
export default function PortalMockup() {
  return (
    <div className="relative">
      {/* Window */}
      <div
        className="bg-white border border-charcoal/15"
        style={{ boxShadow: '0 12px 36px rgba(26,26,26,0.08)' }}
      >
        {/* Browser chrome — three dots + URL, no other UI */}
        <div className="flex items-center px-4 py-3 border-b border-charcoal/10 bg-cream">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-charcoal/15" />
          </div>
          <p className="flex-1 text-center text-[10px] tracking-[0.2em] uppercase text-charcoal/45">
            clients.p2vlabs.in
          </p>
          <span className="w-14" />
        </div>

        {/* Header — welcome row */}
        <div className="flex items-start justify-between px-6 md:px-8 py-6 border-b border-charcoal/10">
          <div>
            <p className="text-[9px] tracking-[0.3em] uppercase text-charcoal/40 mb-1.5">
              Welcome back
            </p>
            <p className="font-display text-xl text-charcoal leading-none">
              Saffron Kitchen
            </p>
          </div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 mt-1">
            Plan C · November
          </p>
        </div>

        {/* Stats — 3 columns with internal hairlines */}
        <div className="grid grid-cols-3 border-b border-charcoal/10">
          <div className="px-6 md:px-8 py-5 border-r border-charcoal/10">
            <p className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 mb-2.5">
              Active shoot
            </p>
            <p className="font-display text-2xl text-charcoal leading-none">01</p>
          </div>
          <div className="px-6 md:px-8 py-5 border-r border-charcoal/10">
            <p className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 mb-2.5">
              Delivered
            </p>
            <p className="font-display text-2xl text-charcoal leading-none">12</p>
          </div>
          <div className="px-6 md:px-8 py-5">
            <p className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 mb-2.5">
              Awaiting approval
            </p>
            <p className="font-display text-2xl text-p2v leading-none">03</p>
          </div>
        </div>

        {/* Deliverables list */}
        <div className="px-6 md:px-8 py-6">
          <p className="text-[9px] tracking-[0.3em] uppercase text-charcoal/40 mb-3">
            This month
          </p>
          <ul>
            <li className="flex items-center justify-between py-3 border-t border-charcoal/10">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal/35 flex-shrink-0 w-16">
                  Reel · 04
                </span>
                <span className="text-[13px] text-charcoal/75 truncate">
                  Diwali specials — table-top
                </span>
              </div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-p2v flex-shrink-0 ml-3">
                Review →
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-t border-charcoal/10">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal/35 flex-shrink-0 w-16">
                  Reel · 03
                </span>
                <span className="text-[13px] text-charcoal/75 truncate">
                  Behind the kitchen
                </span>
              </div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 flex-shrink-0 ml-3">
                Approved
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-t border-charcoal/10">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal/35 flex-shrink-0 w-16">
                  Stills · 08
                </span>
                <span className="text-[13px] text-charcoal/75 truncate">
                  Tasting menu — winter
                </span>
              </div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 flex-shrink-0 ml-3">
                Downloaded
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-y border-charcoal/10">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-[0.2em] uppercase text-charcoal/35 flex-shrink-0 w-16">
                  Reel · 02
                </span>
                <span className="text-[13px] text-charcoal/75 truncate">
                  Founder note — paneer story
                </span>
              </div>
              <span className="text-[9px] tracking-[0.25em] uppercase text-charcoal/40 flex-shrink-0 ml-3">
                Approved
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating notification — desktop only. Sits slightly to the left
          of the window with a hairline border so it reads as a separate
          surface, not a glassy chip. Mirrors the inspiration screenshot's
          "auto-sent" callout but treated editorially. */}
      <div
        className="hidden lg:block absolute -left-8 top-[44%] bg-cream border border-charcoal/15 px-5 py-3.5 max-w-[240px]"
        style={{ boxShadow: '0 8px 20px rgba(26,26,26,0.06)' }}
      >
        <p className="text-[8px] tracking-[0.35em] uppercase text-charcoal/45 mb-1.5">
          WhatsApp · approval received
        </p>
        <p className="text-[12px] text-charcoal/75 leading-snug">
          <em className="not-italic text-p2v">Reel 03</em> — Behind the kitchen
        </p>
      </div>
    </div>
  )
}
