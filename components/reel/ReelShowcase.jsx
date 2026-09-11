'use client'
import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-driven showcase for /reel: a three-column wall of work that starts
 * laid back in 3D and lifts upright as you scroll through it, with the
 * columns drifting at different rates once it is flat.
 *
 * Adapted from the 21st.dev "animated-gallery" block. Two things changed, and
 * both were deliberate:
 *
 *   Driven by GSAP, not motion/react. The original uses useScroll +
 *   useTransform to map scroll progress onto rotateX, scale and y. GSAP's
 *   ScrollTrigger with scrub does exactly that, and this project already
 *   loads GSAP on every page through the layout - the navbar, footer and
 *   loader all use it. Adding motion would have meant ~34kb gzip and a second
 *   scroll system running alongside ScrollTrigger for no new capability. The
 *   timeline positions below map 1:1 onto the original's transform ranges:
 *   rotateX over progress 0 -> 0.5, scale over 0.5 -> 0.9, column drift over
 *   0.5 -> 1.
 *
 *   Real work, not stock. The original fills with placeholder photography.
 *   This is a portfolio page, so it takes the actual reel items and every
 *   tile stays clickable - videos open the player, photos open the lightbox -
 *   which is also why the showcase sits inside ReelClient rather than in the
 *   server page: that is where the modal state lives.
 *
 * The tiles are decorative duplicates of work already listed in the grid
 * below, so they are not the page's indexable content - that is still the
 * server-rendered grid with its titles, clients and descriptions.
 */

/* Three columns, round-robin, so video and photo work interleave instead of
   the first column being all video. Capped at 12: past four rows a column is
   taller than the sticky viewport and the extra tiles never come into view. */
function toColumns(items, perCol = 4) {
  const cols = [[], [], []]
  items.slice(0, perCol * 3).forEach((item, i) => cols[i % 3].push(item))
  return cols
}

function Tile({ item, onOpen }) {
  const src = item.thumbnailUrl || item.imageUrl
  if (!src) return null
  const isVideo = item.category === 'video'
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block w-full aspect-video overflow-hidden rounded-md bg-amp-surface"
      aria-label={`${isVideo ? 'Play' : 'View'} ${item.title}${item.client ? ` for ${item.client}` : ''}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 33vw, (max-width: 1280px) 30vw, 380px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
      <span className="pointer-events-none absolute inset-0 bg-amp-ink-pill/0 group-hover:bg-amp-ink-pill/25 transition-colors duration-300" />
      {isVideo && (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/90">
            <svg width="11" height="13" viewBox="0 0 11 13" fill="none" aria-hidden="true">
              <path d="M10.5 6.5L0.75 12.13V0.87L10.5 6.5Z" fill="#1a1f23" />
            </svg>
          </span>
        </span>
      )}
    </button>
  )
}

export default function ReelShowcase({ videos = [], photos = [], onVideoClick, onPhotoClick }) {
  const scrollRef = useRef(null)
  const gridRef = useRef(null)

  /* Featured first, then the rest, so the strongest work lands in the rows
     that are actually on screen when the wall comes upright. */
  const items = useMemo(() => {
    const all = [...videos, ...photos]
    return [...all.filter((i) => i.featured), ...all.filter((i) => !i.featured)]
  }, [videos, photos])

  const cols = useMemo(() => toColumns(items), [items])

  useEffect(() => {
    const scroller = scrollRef.current
    const grid = gridRef.current
    if (!scroller || !grid) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      /* 'top bottom' -> 'bottom top' is the exact equivalent of framer's
         useScroll default offset, ["start end", "end start"]: progress 0 when
         the container's top meets the viewport bottom, 1 when its bottom
         meets the viewport top. Total travel is therefore container height
         plus one viewport - 450vh - and the reveal begins as the wall scrolls
         into view rather than waiting for it to pin. Getting this wrong is
         what made the first version snap: it ran the whole rotation across
         110vh instead of 225vh. */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scroller,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
        defaults: { ease: 'none' },
      })

      tl.fromTo(grid, { rotateX: 75 }, { rotateX: 0, duration: 0.5 }, 0)
      tl.fromTo(grid, { scale: 1.18 }, { scale: 1, duration: 0.4 }, 0.5)

      /* Middle column drifts against the outer two - the offset is what makes
         the wall read as depth rather than one flat plane sliding. */
      const drift = [
        ['-10%', '2%'],
        ['15%', '5%'],
        ['-10%', '2%'],
      ]
      gsap.utils.toArray('[data-col]').forEach((col) => {
        const [from, to] = drift[Number(col.dataset.col)] ?? drift[0]
        tl.fromTo(col, { yPercent: parseFloat(from) }, { yPercent: parseFloat(to), duration: 0.5 }, 0.5)
      })
    }, scroller)

    /* The header above this measures differently once webfonts land, which
       moves every start position. */
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 600)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(t)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [items.length])

  if (!items.length) return null

  return (
    <div ref={scrollRef} className="relative h-[350vh]">
      <div
        className="sticky top-0 h-svh min-h-[30rem] w-full overflow-hidden"
        style={{ perspective: '1000px', perspectiveOrigin: 'center top' }}
      >
        <div
          ref={gridRef}
          className="grid size-full grid-cols-3 gap-2"
          /* Origin stays centred. Pinning it to the top edge swung the lower
             rows toward the viewer and ballooned them off-screen at the start
             of the reveal; centred, the foreshortening is symmetric and the
             wall reads as receding rather than looming. */
          style={{ transformStyle: 'preserve-3d', transformOrigin: '50% 50%' }}
        >
          {cols.map((col, ci) => (
            <div
              key={ci}
              data-col={ci}
              /* -50% is the source value. At -18% the middle column barely
                 broke the grid line and the wall read as one flat plane; the
                 deep offset is most of what gives it depth. */
              className={`flex w-full flex-col gap-2 ${ci === 1 ? 'mt-[-50%]' : ''}`}
            >
              {col.map((item) => (
                <Tile
                  key={`${item.category}-${item.id}`}
                  item={item}
                  onOpen={() =>
                    item.category === 'video'
                      ? onVideoClick?.(item)
                      : onPhotoClick?.(photos, item)
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
