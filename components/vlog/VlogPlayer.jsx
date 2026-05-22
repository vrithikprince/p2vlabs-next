'use client'
import { useState } from 'react'
import Image from 'next/image'
import { youtubeEmbed, youtubeThumbnail } from '../../lib/youtube.js'
import Icon from '../ui/Icon.jsx'

/**
 * Custom YouTube player for /vlog/[slug]. Click-to-play pattern:
 *   - Initial render shows the thumbnail (custom or YouTube default)
 *     with a large play button overlay. No YouTube JS / iframe loaded.
 *   - On click, swaps to the youtube-nocookie embed iframe with
 *     autoplay=1.
 *
 * Why: avoids loading YouTube's ~600 KB player + setting tracking
 * cookies until the user actually engages. Better Core Web Vitals and
 * privacy.
 */
export default function VlogPlayer({ youtubeId, title, thumbnailUrl, thumbnailAlt }) {
  const [playing, setPlaying] = useState(false)
  const thumb = thumbnailUrl || youtubeThumbnail(youtubeId, 'maxres')

  return (
    <div
      className="relative w-full overflow-hidden border border-bone/10 bg-pitch"
      style={{ aspectRatio: '16/9' }}
    >
      {playing ? (
        <iframe
          src={youtubeEmbed(youtubeId, { autoplay: true })}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play ${title}`}
          className="group absolute inset-0 w-full h-full block cursor-pointer"
        >
          {thumb && (
            <Image
              src={thumb}
              alt={thumbnailAlt || title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              priority
            />
          )}
          <div className="absolute inset-0 bg-ink/15 group-hover:bg-amber/5 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber/85 backdrop-blur flex items-center justify-center group-hover:scale-110 group-hover:bg-amber transition-all shadow-2xl">
              <Icon n="play" s={32} c="#F5F0E8" style={{ marginLeft: 4 }} />
            </div>
          </div>
        </button>
      )}
    </div>
  )
}
