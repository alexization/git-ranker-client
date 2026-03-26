"use client"

import { useCallback, useSyncExternalStore } from "react"

function getMediaQuerySnapshot(query: string): boolean {
    if (typeof window === "undefined") {
        return false
    }

    return window.matchMedia(query).matches
}

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback((onStoreChange: () => void) => {
        if (typeof window === "undefined") {
            return () => {}
        }

        const media = window.matchMedia(query)
        const listener = () => onStoreChange()

        media.addEventListener("change", listener)
        return () => media.removeEventListener("change", listener)
    }, [query])

    const getSnapshot = useCallback(() => getMediaQuerySnapshot(query), [query])

    return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

// Convenience hook for mobile detection
export function useIsMobile(): boolean {
    return useMediaQuery("(max-width: 640px)")
}
