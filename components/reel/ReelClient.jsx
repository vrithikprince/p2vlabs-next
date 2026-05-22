'use client'
import { useEffect, useState } from 'react'
import { gsap } from 'gsap'

import VideoModal from './VideoModal.jsx'
import PhotoLightbox from './PhotoLightbox.jsx'
import ReelFilters from './ReelFilters.jsx'
import ReelGrid from './ReelGrid.jsx'
import EmptyState from '../ui/EmptyState.jsx'
import Rule from '../ui/Rule.jsx'

/**
 * Client wrapper for the /reel page. Receives the initial (server-fetched)
 * video + photo arrays from the parent Server Component, then handles filter
 * state, modals, and lightbox entirely client-side.
 *
 *   <ReelClient videoItems={...} photoItems={...} />
 */
export default function ReelClient({ videoItems, photoItems }) {
  const [filter,        setFilter]        = useState('All')
  const [videoModal,    setVideoModal]    = useState(null)
  const [lbItems,       setLbItems]       = useState([])
  const [lbIndex,       setLbIndex]       = useState(0)
  const [lbOpen,        setLbOpen]        = useState(false)

  /* Header entrance animation */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reel-page-title', {
        yPercent: 105, duration: 0.9, ease: 'power4.out',
      })
      gsap.from('.reel-page-desc', {
        opacity: 0, y: 22, duration: 0.7, ease: 'power3.out', delay: 0.2,
      })
      gsap.from('.reel-filter-btn', {
        opacity: 0, y: 16, stagger: 0.06, duration: 0.5, ease: 'power3.out', delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  /* Re-animate cards on filter change */
  useEffect(() => {
    const cards = document.querySelectorAll('.reel-grid-card')
    if (!cards.length) return
    gsap.fromTo(
      cards,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, stagger: 0.07, duration: 0.55, ease: 'power3.out', overwrite: true }
    )
  }, [filter])

  /* Filter logic preserved from original */
  const filteredVideos = (() => {
    if (filter === 'Food & Restaurant' || filter === 'Photography') return []
    if (filter === 'All') return videoItems
    if (filter === 'Video') {
      return videoItems.filter((v) => v.subcategory !== 'Influencer Work' && v.subcategory !== 'Travel')
    }
    return videoItems.filter((v) => v.subcategory === filter || v.tags.includes(filter))
  })()

  const filteredPhotos = (() => {
    if (filter === 'Video' || filter === 'Influencer Work' || filter === 'Travel') return []
    if (filter === 'All')               return photoItems
    if (filter === 'Photography')       return photoItems.filter((p) => p.subcategory === 'Photography')
    if (filter === 'Food & Restaurant') return photoItems.filter((p) => p.subcategory === 'Food & Restaurant')
    return photoItems.filter((p) => p.subcategory === filter || p.tags.includes(filter))
  })()

  const isFood   = filter === 'Food & Restaurant'
  const hasVid   = filteredVideos.length > 0
  const hasPic   = filteredPhotos.length > 0
  const isEmpty  = !hasVid && !hasPic
  const showBoth = hasVid && hasPic

  const openLightbox = (items, item) => {
    const idx = items.findIndex((i) => i.id === item.id)
    setLbItems(items)
    setLbIndex(idx >= 0 ? idx : 0)
    setLbOpen(true)
  }

  return (
    <div className="pt-16 pb-24 md:pb-10">
      {videoModal && <VideoModal item={videoModal} onClose={() => setVideoModal(null)} />}
      {lbOpen && (
        <PhotoLightbox
          items={lbItems}
          index={lbIndex}
          onClose={() => setLbOpen(false)}
          onChange={setLbIndex}
        />
      )}

      <div className="px-5 md:px-10 lg:px-20 py-16 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.35em] uppercase text-bone/45 mb-5">Selected Work</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-bone leading-tight clip-wrap">
              <span className="reel-page-title block">The Reel</span>
            </h1>
            <p className="reel-page-desc text-bone/55 leading-relaxed self-end text-lg">
              A curated selection of work across video, photography, and social content —
              each piece built for a specific brand, platform, and purpose.
            </p>
          </div>

          <Rule className="mb-8" />

          <ReelFilters active={filter} onChange={setFilter} />
        </div>

        {isEmpty && <EmptyState label="No work in this category yet." />}

        <ReelGrid
          videos={filteredVideos}
          photos={filteredPhotos}
          isFood={isFood}
          showBoth={showBoth}
          onVideoClick={setVideoModal}
          onPhotoClick={openLightbox}
        />
      </div>
    </div>
  )
}
