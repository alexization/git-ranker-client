/**
 * Storage Cache Utility
 *
 * Removes localStorage entries and keeps an in-memory cache invalidated when
 * other tabs modify storage or the tab regains visibility.
 *
 * @see https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast
 */

// Module-level cache for localStorage
const localStorageCache = new Map<string, string | null>()

/**
 * Remove item from localStorage and cache
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(key)
  localStorageCache.delete(key)
}

// Listen for storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key) {
      localStorageCache.delete(e.key)
    } else {
      // Storage was cleared
      localStorageCache.clear()
    }
  })

  // Invalidate cache when tab becomes visible (in case another tab modified storage)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      localStorageCache.clear()
    }
  })
}
