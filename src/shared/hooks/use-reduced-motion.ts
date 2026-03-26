import { useMediaQuery } from './use-media-query'

/**
 * Hook to detect if the user prefers reduced motion.
 * Returns true if the user has enabled "Reduce motion" in their OS settings.
 *
 * This should be used to disable or simplify animations for accessibility.
 */
export function useReducedMotion(): boolean {
    return useMediaQuery('(prefers-reduced-motion: reduce)')
}
