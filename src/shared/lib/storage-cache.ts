/**
 * Storage Cache Utility
 *
 * Caches localStorage/sessionStorage reads in memory to reduce expensive I/O.
 * Storage APIs are synchronous and can be slow, especially when called frequently.
 *
 * @see https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast
 */

// Module-level cache for localStorage
const localStorageCache = new Map<string, string | null>()

// Module-level cache for sessionStorage
const sessionStorageCache = new Map<string, string | null>()

// Cookie cache with parsed results
let cookieCache: Record<string, string> | null = null

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
 * Get item from sessionStorage with caching
 */
export function getSessionStorage(key: string): string | null {
  if (typeof window === 'undefined') return null

  if (!sessionStorageCache.has(key)) {
    sessionStorageCache.set(key, sessionStorage.getItem(key))
  }
  return sessionStorageCache.get(key) ?? null
}

/**
 * Set item in sessionStorage and update cache
 */
export function setSessionStorage(key: string, value: string): void {
  if (typeof window === 'undefined') return

  sessionStorage.setItem(key, value)
  sessionStorageCache.set(key, value)
}

/**
 * Remove item from sessionStorage and cache
 */
export function removeSessionStorage(key: string): void {
  if (typeof window === 'undefined') return

  sessionStorage.removeItem(key)
  sessionStorageCache.delete(key)
}

/**
 * Get cookie value with caching
 * Parses all cookies once and caches the result
 */
export function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').filter(Boolean).map(c => {
        const [key, ...rest] = c.split('=')
        return [key, rest.join('=')]
      })
    )
  }
  return cookieCache[name]
}

/**
 * Invalidate cookie cache
 * Call this when cookies are modified
 */
export function invalidateCookieCache(): void {
  cookieCache = null
}

/**
 * Invalidate localStorage cache for a specific key
 */
export function invalidateLocalStorageCache(key?: string): void {
  if (key) {
    localStorageCache.delete(key)
  } else {
    localStorageCache.clear()
  }
}

/**
 * Invalidate sessionStorage cache for a specific key
 */
export function invalidateSessionStorageCache(key?: string): void {
  if (key) {
    sessionStorageCache.delete(key)
  } else {
    sessionStorageCache.clear()
  }
}

// Listen for storage events from other tabs
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key) {
      localStorageCache.delete(e.key)
      sessionStorageCache.delete(e.key)
    } else {
      // Storage was cleared
      localStorageCache.clear()
      sessionStorageCache.clear()
    }
  })

  // Invalidate cache when tab becomes visible (in case another tab modified storage)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      localStorageCache.clear()
      sessionStorageCache.clear()
      cookieCache = null
    }
  })
}
