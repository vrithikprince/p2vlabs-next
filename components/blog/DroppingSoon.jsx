import Link from 'next/link'
import Icon from '../ui/Icon.jsx'

/**
 * Empty-state shown on /blog and /vlog when no posts are published yet.
 * On the amp design system (see tailwind.config.js's `amp-*` tokens):
 * white ground, IBM Plex headings, near-monochrome copy. Navy is this
 * section's single accent - the eyebrow dot, the "what's coming"
 * numerals, and the link hover all use it, nothing else is coloured.
 */
export default function DroppingSoon({ kind = 'blog' }) {
  const isBlog = kind === 'blog'
  const label  = isBlog ? 'Writing' : 'Filmmaking'

  return (
    <section className="font-plex bg-white py-24 md:py-32 px-5 md:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        <div className="lg:col-span-7">
          <p className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-amp-navy" />
            {isBlog ? 'The P2V Journal' : 'The P2V Reel Diary'}
          </p>
          {/* tracking-[-0.01em] is the system's large-heading tracking;
              tracking-tight (-0.025em) was tighter than the hero itself. */}
          <h1 className="font-plex font-semibold text-[clamp(2.6rem,7vw,5rem)] leading-[1.05] tracking-[-0.01em] text-black mb-6">
            <span className="block">Dropping</span>
            {/* The second line used to carry the brand red. Amp headings
                stay monochrome - emphasis comes from the line break. */}
            <em className="not-italic text-black block">Soon.</em>
          </h1>
          <p className="text-amp-body text-lg leading-relaxed max-w-xl">
            {isBlog
              ? 'Long-form essays, production notes, and behind-the-frame breakdowns from the studio. The first pieces go live shortly.'
              : 'Behind-the-scenes films, founder commentary, and director cuts from recent shoots. The first episodes go live shortly.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            {/* Primary CTA - near-black pill, the amp convention for the
                one action a section actually wants. h-14 is the system's
                primary-pill height (hero, PostCTA, LeadCapture); this one
                was still h-12 from before the migration. */}
            <a href="https://wa.me/917048824616"
              className="inline-flex items-center gap-2 h-14 px-6 rounded-full bg-amp-ink-pill text-white text-[15px] font-semibold hover:bg-black transition-colors">
              <span>Get notified</span>
              <Icon n="aur" s={15} c="currentColor" />
            </a>
            <Link
              href="/reel"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-amp-body hover:text-amp-navy transition-colors"
            >
              <span>While you wait - see the reel</span>
              <Icon n="arrow" s={14} c="currentColor" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-[16px] border border-amp-hairline bg-amp-surface p-7 md:p-9">
            <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-amp-caption mb-5">
              What's coming
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 pb-4 border-b border-amp-hairline">
                <span className="font-plex text-base font-semibold text-amp-navy leading-none pt-0.5">01</span>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {isBlog ? 'Production notes' : 'Director cuts'}
                  </p>
                  <p className="text-xs text-amp-body leading-relaxed mt-1">
                    {isBlog
                      ? 'How specific shoots came together - lens choices, light setups, editing decisions.'
                      : 'Selected long-form films released here first, then on YouTube.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 pb-4 border-b border-amp-hairline">
                <span className="font-plex text-base font-semibold text-amp-navy leading-none pt-0.5">02</span>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {isBlog ? 'Founder essays' : 'Behind-the-scenes'}
                  </p>
                  <p className="text-xs text-amp-body leading-relaxed mt-1">
                    {isBlog
                      ? 'Vrithik and Payal on craft, the business of content, and why we built the studio.'
                      : 'Set diaries, gear walkthroughs, and unedited on-location footage from active projects.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-plex text-base font-semibold text-amp-navy leading-none pt-0.5">03</span>
                <div>
                  <p className="text-sm font-semibold text-black">{label} guides</p>
                  <p className="text-xs text-amp-body leading-relaxed mt-1">
                    Practical breakdowns for brands and creators preparing their own visual content.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </section>
  )
}
