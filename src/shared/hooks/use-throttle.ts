import { useCallback, useRef } from 'react'

/**
 * Returns a throttled version of the callback that only fires at most once per `delay` ms.
 * Uses requestAnimationFrame for smooth animation-related throttling.
 *
 * @param callback - The function to throttle
 * @param delay - Minimum time between calls in ms (default: 16ms = ~60fps)
 */
export function useThrottledCallback<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 16
): T {
    const lastCallRef = useRef<number>(0)
    const rafRef = useRef<number | null>(null)

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = performance.now()

            if (now - lastCallRef.current >= delay) {
                lastCallRef.current = now
                callback(...args)
            } else if (!rafRef.current) {
                // Schedule for next animation frame if we're throttling
                rafRef.current = requestAnimationFrame(() => {
                    lastCallRef.current = performance.now()
                    rafRef.current = null
                    callback(...args)
                })
            }
        }) as T,
        [callback, delay]
    )
}

/**
 * Caches the result of getBoundingClientRect to avoid layout thrashing.
 * Invalidates cache on resize events.
 */
export function useCachedRect() {
    const rectRef = useRef<DOMRect | null>(null)
    const elementRef = useRef<HTMLElement | null>(null)
    const frameRef = useRef<number | null>(null)

    const getRect = useCallback((element: HTMLElement): DOMRect => {
        // If same element and we have a cached rect, return it
        if (element === elementRef.current && rectRef.current) {
            return rectRef.current
        }

        // Cache the new element reference
        elementRef.current = element

        // Schedule a rect update on next frame (batches multiple calls)
        if (!frameRef.current) {
            frameRef.current = requestAnimationFrame(() => {
                if (elementRef.current) {
                    rectRef.current = elementRef.current.getBoundingClientRect()
                }
                frameRef.current = null
            })
        }

        // For the current call, get the rect synchronously if not cached
        if (!rectRef.current) {
            rectRef.current = element.getBoundingClientRect()
        }

        return rectRef.current
    }, [])

    const invalidateCache = useCallback(() => {
        rectRef.current = null
    }, [])

    return { getRect, invalidateCache }
}
