'use client'
import { createContext, useContext } from 'react'

/**
 * Lets Hero (and any other entrance-animated section) know whether the loader
 * is still on-screen so it can delay its own GSAP entrance accordingly.
 *
 * Default `loaderActive: true` matches the Vite app's behavior on first paint.
 */
export const LoaderContext = createContext({ loaderActive: true })

export const useLoader = () => useContext(LoaderContext)
