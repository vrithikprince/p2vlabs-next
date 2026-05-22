'use client'
import ReelCard from './ReelCard.jsx'

/**
 * Renders the appropriate grid given filtered videos + photos.
 *
 *  - Pure photos in "Food & Restaurant" → cinematic alternating layout
 *  - Other photos → masonry columns
 *  - Videos → 3-col grid with portrait orientation taking 1 col, landscape 2
 */
export default function ReelGrid({
  videos = [],
  photos = [],
  isFood,
  showBoth,
  onVideoClick,
  onPhotoClick,
}) {
  return (
    <>
      {videos.length > 0 && (
        <div className={photos.length ? 'mb-20' : ''}>
          {showBoth && (
            <div className="flex items-center gap-5 mb-10">
              <p className="text-[10px] tracking-[0.35em] uppercase text-bone/40 shrink-0">Video Work</p>
              <div className="flex-1 border-t border-bone/10" />
              <span className="text-[10px] text-bone/28 shrink-0">
                {videos.length} film{videos.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10" style={{ gridAutoFlow: 'dense' }}>
            {videos.map((item) => (
              <div
                key={item.id}
                className={`reel-grid-card ${item.orientation === 'portrait' ? 'md:col-span-1' : 'md:col-span-2'}`}
              >
                <ReelCard variant="video" item={item} onClick={() => onVideoClick(item)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div>
          {showBoth && (
            <div className="flex items-center gap-5 mb-10">
              <p className="text-[10px] tracking-[0.35em] uppercase text-bone/40 shrink-0">Photography</p>
              <div className="flex-1 border-t border-bone/10" />
              <span className="text-[10px] text-bone/28 shrink-0">
                {photos.length} image{photos.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}

          {isFood ? (
            <div className="border-t border-bone/10">
              {photos.map((item, i) => (
                <ReelCard
                  key={item.id}
                  variant="cinematic"
                  item={item}
                  index={i}
                  onClick={() => onPhotoClick(photos, item)}
                />
              ))}
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-5">
              {photos.map((item) => (
                <div key={item.id} className="reel-grid-card">
                  <ReelCard
                    variant="masonry"
                    item={item}
                    onClick={() => onPhotoClick(photos, item)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
