import Link from 'next/link'
import Icon from '../ui/Icon.jsx'

/**
 * Editorial empty-state shown on /blog and /vlog when no posts are
 * published yet. Matches the brand language (Loewe / A24 editorial),
 * not a generic "coming soon" badge.
 */
export default function DroppingSoon({ kind = 'blog' }) {
  const isBlog = kind === 'blog'
  const label  = isBlog ? 'Writing' : 'Filmmaking'

  return (
    <section className="py-24 md:py-32 px-5 md:px-10 lg:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

        <div className="lg:col-span-7">
          <p className="text-[10px] tracking-[0.4em] uppercase text-bone/45 mb-7">
            {isBlog ? 'The P2V Journal' : 'The P2V Reel Diary'}
          </p>
          <h1 className="font-display font-bold text-[clamp(2.6rem,7vw,5rem)] leading-[1.05] tracking-tight text-bone mb-6">
            <span className="block">Dropping</span>
            <em className="not-italic text-amber block">Soon.</em>
          </h1>
          <p className="text-bone/55 text-lg leading-relaxed max-w-xl">
            {isBlog
              ? 'Long-form essays, production notes, and behind-the-frame breakdowns from the studio. The first pieces go live shortly.'
              : 'Behind-the-scenes films, founder commentary, and director cuts from recent shoots. The first episodes go live shortly.'}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="https://wa.me/917048824616"
              className="inline-flex items-center justify-between gap-3 px-5 py-3 bg-bone text-ink text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-amber transition-colors">
              <span>Get notified</span>
              <Icon n="aur" s={15} c="currentColor" />
            </a>
            <Link
              href="/reel"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-bone/55 hover:text-amber transition-colors"
            >
              <span>While you wait — see the reel</span>
              <Icon n="arrow" s={14} c="currentColor" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-bone/12 p-7 md:p-9 bg-ink/[0.02]">
            <p className="text-[9px] tracking-[0.4em] uppercase text-bone/35 mb-5">
              What's coming
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 pb-4 border-b border-bone/10">
                <span className="font-display text-base font-bold text-amber/40 leading-none pt-0.5">01</span>
                <div>
                  <p className="text-sm font-semibold text-bone">
                    {isBlog ? 'Production notes' : 'Director cuts'}
                  </p>
                  <p className="text-xs text-bone/50 leading-relaxed mt-1">
                    {isBlog
                      ? 'How specific shoots came together — lens choices, light setups, editing decisions.'
                      : 'Selected long-form films released here first, then on YouTube.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 pb-4 border-b border-bone/10">
                <span className="font-display text-base font-bold text-amber/40 leading-none pt-0.5">02</span>
                <div>
                  <p className="text-sm font-semibold text-bone">
                    {isBlog ? 'Founder essays' : 'Behind-the-scenes'}
                  </p>
                  <p className="text-xs text-bone/50 leading-relaxed mt-1">
                    {isBlog
                      ? 'Vrithik, Payal, and Palash on craft, the business of content, and why we built the studio.'
                      : 'Set diaries, gear walkthroughs, and unedited on-location footage from active projects.'}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display text-base font-bold text-amber/40 leading-none pt-0.5">03</span>
                <div>
                  <p className="text-sm font-semibold text-bone">{label} guides</p>
                  <p className="text-xs text-bone/50 leading-relaxed mt-1">
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
