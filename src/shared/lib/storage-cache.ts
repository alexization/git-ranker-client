/**
 * Storage Cache Utility
 *
 * Caches localStorage reads in memory to reduce expensive I/O.
 * Storage APIs are synchronous and can be slow, especially when called frequently.
 *
 * @see https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast
 */

// Module-level cache for localStorage
const localStorageCache = new Map<string, string | null>()

/**
 * Get item from localStorage with caching
 * First call reads from storage, subsequent calls return cached value
 */
export function getLocalStorage(key: string): string | null {
  if (typeof window === 'undefined') return null

  if (!localStorageCache.has(key)) {
    localStorageCache.set(key, localStorage.getItem(key))
  }
  return localStorageCache.get(key) ?? null
}

/**
 * Set item in localStorage and update cache
 */
export function setLocalStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return

  localStorage.setItem(key, value)
  localStorageCache.set(key, value)
}

/**
 * Remove item from localStorage and cache
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(key)
  localStorageCache.delete(key)
}

/**
 * Invalidate localStorage cache for a specific key or all keys
 */
export function invalidateLocalStorageCache(key?: string): void {
  if (key) {
    localStorageCache.delete(key)
  } else {
    localStorageCache.clear()
  }
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
