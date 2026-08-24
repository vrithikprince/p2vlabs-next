/**
 * PortalMockup - mockup of clients.p2vlabs.in.
 *
 * Mounted on /packages to justify the Plan C tier. Built as a product
 * mock in the same vocabulary as the homepage capability-loop cards:
 *   - white card surface, 1px amp-hairline rules, amp-surface for the
 *     inner fills (browser chrome, stats band)
 *   - two text tiers - amp-caption for labels, amp-body for content
 *   - exactly one accent (amp-navy) - the deliverable awaiting approval,
 *     which is also the most "load-bearing" action in the real portal
 *
 * Floating notification on the left is hidden below lg: to keep mobile
 * uncluttered. Sample data is intentionally restaurant-shaped (Saffron
 * Kitchen, Diwali specials) so the mockup reads as "this is what your
 * portal would look like" to the primary persona - local restaurant
 * owners on monthly plans.
 */
export default function PortalMockup() {
  return (
    <div className="relative font-plex">
      {/* Window - overflow-hidden so the tinted chrome bar clips to the
          card's own rounded corners */}
      <div className="bg-white border border-amp-hairline rounded-[16px] overflow-hidden shadow-[0_16px_40px_-16px_rgba(26,26,26,0.18)]">
        {/* Browser chrome - three dots + URL, no other UI. Mono URL rather
            than a tracked-out caps label, so it reads as an address bar. */}
        <div className="flex items-center px-4 py-3 border-b border-amp-hairline bg-amp-surface">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amp-hairline-strong/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amp-hairline-strong/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-amp-hairline-strong/60" />
          </div>
          <p className="flex-1 text-center text-[10.5px] font-mono text-amp-caption">
            clients.p2vlabs.in
          </p>
          <span className="w-14" />
        </div>

        {/* Header - welcome row */}
        <div className="flex items-start justify-between px-6 md:px-8 py-6 border-b border-amp-hairline">
          <div>
            <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-1.5">
              Welcome back
            </p>
            <p className="text-xl font-semibold text-black leading-none tracking-[-0.01em]">
              Saffron Kitchen
            </p>
          </div>
          <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mt-1">
            Plan C · November
          </p>
        </div>

        {/* Stats - 3 columns with internal hairlines. Sits on amp-surface so
            the data strip separates the header from the deliverables list
            without needing a heavier rule. */}
        <div className="grid grid-cols-3 border-b border-amp-hairline bg-amp-surface">
          <div className="px-6 md:px-8 py-5 border-r border-amp-hairline">
            <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-2.5">
              Active shoot
            </p>
            <p className="text-2xl font-semibold text-black leading-none tracking-[-0.01em]">01</p>
          </div>
          <div className="px-6 md:px-8 py-5 border-r border-amp-hairline">
            <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-2.5">
              Delivered
            </p>
            <p className="text-2xl font-semibold text-black leading-none tracking-[-0.01em]">12</p>
          </div>
          <div className="px-6 md:px-8 py-5">
            {/* The one accented stat - navy dot marker as well as a navy
                numeral, since navy alone is too close to black to carry the
                "needs you" signal the old red carried on its own. */}
            <p className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amp-navy flex-shrink-0" />
              Awaiting approval
            </p>
            <p className="text-2xl font-semibold text-amp-navy leading-none tracking-[-0.01em]">03</p>
          </div>
        </div>

        {/* Deliverables list */}
        <div className="px-6 md:px-8 py-6">
          <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-3">
            This month
          </p>
          <ul>
            <li className="flex items-center justify-between py-3 border-t border-amp-hairline">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 w-16">
                  Reel · 04
                </span>
                <span className="text-[13px] text-amp-body truncate">
                  Diwali specials - table-top
                </span>
              </div>
              {/* Only pending row - navy + semibold, so it separates from the
                  settled statuses by weight as well as hue. */}
              <span className="text-[9px] font-semibold tracking-wide uppercase text-amp-navy flex-shrink-0 ml-3">
                Review →
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-t border-amp-hairline">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 w-16">
                  Reel · 03
                </span>
                <span className="text-[13px] text-amp-body truncate">
                  Behind the kitchen
                </span>
              </div>
              <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 ml-3">
                Approved
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-t border-amp-hairline">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 w-16">
                  Stills · 08
                </span>
                <span className="text-[13px] text-amp-body truncate">
                  Tasting menu - winter
                </span>
              </div>
              <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 ml-3">
                Downloaded
              </span>
            </li>
            <li className="flex items-center justify-between py-3 border-y border-amp-hairline">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 w-16">
                  Reel · 02
                </span>
                <span className="text-[13px] text-amp-body truncate">
                  Founder note - paneer story
                </span>
              </div>
              <span className="text-[9px] tracking-wide uppercase text-amp-caption flex-shrink-0 ml-3">
                Approved
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating notification - desktop only. Sits slightly to the left
          of the window; white-on-white separated only by a hairline and a
          soft shadow, which is how the amp system layers surfaces - so it
          reads as a card in front of the window, not a glassy chip.
          Mirrors the inspiration screenshot's "auto-sent" callout. */}
      <div className="hidden lg:block absolute -left-8 top-[44%] bg-white border border-amp-hairline rounded-[16px] px-5 py-3.5 max-w-[240px] shadow-[0_10px_30px_-8px_rgba(26,26,26,0.18)]">
        <p className="text-[10px] font-semibold tracking-wide uppercase text-amp-caption mb-1.5">
          WhatsApp · approval received
        </p>
        <p className="text-[12px] text-amp-body leading-snug">
          <em className="not-italic font-semibold text-amp-navy">Reel 03</em> - Behind the kitchen
        </p>
      </div>
    </div>
  )
}
