'use client'
import { useEffect } from 'react'

/** Locks body scroll while a modal/lightbox is mounted. */
export default function useLockScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
}
