type WebVitalsMetric = {
  id: string
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'back-forward-cache' | 'prerender'
}

// Thresholds based on web.dev recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },     // Largest Contentful Paint
  FID: { good: 100, poor: 300 },        // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint
  INP: { good: 200, poor: 500 },        // Interaction to Next Paint
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte
}

function getRating(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const threshold = THRESHOLDS[name]
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

export function reportWebVitals(metric: WebVitalsMetric): void {
  const rating = getRating(metric.name, metric.value)

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const colorMap = {
      'good': '\x1b[32m',      // Green
      'needs-improvement': '\x1b[33m',  // Yellow
      'poor': '\x1b[31m',       // Red
    }
    const reset = '\x1b[0m'
    console.log(
      `${colorMap[rating]}[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${rating})${reset}`
    )
  }

  // In production, send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics endpoint
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: window.location.pathname,
    })

    // Use sendBeacon for better reliability during page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body)
    } else {
      // Fallback to fetch
      fetch('/api/analytics/vitals', {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Silently fail - analytics should not affect user experience
      })
    }
  }
}

// Initialize Web Vitals reporting
// NOTE: Requires 'web-vitals' package to be installed: npm install web-vitals
export async function initWebVitals(): Promise<void> {
  try {
    // Use a variable to prevent static analysis
    const moduleName = 'web-vitals'
    const webVitals = await import(/* webpackIgnore: true */ moduleName)
    const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = webVitals
    onCLS(reportWebVitals)
    onFCP(reportWebVitals)
    onFID(reportWebVitals)
    onINP(reportWebVitals)
    onLCP(reportWebVitals)
    onTTFB(reportWebVitals)
  } catch {
    // web-vitals not installed, skip monitoring
    // To enable, run: npm install web-vitals
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals] Package not installed. Run: npm install web-vitals')
    }
  }
}

// Simple page view tracking
export function trackPageView(url: string): void {
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      event: 'page_view',
      url,
      timestamp: Date.now(),
      referrer: document.referrer || null,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', body)
    }
  }
}

// Track user interactions (button clicks, etc.)
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void {
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      event: eventName,
      properties: properties || {},
      timestamp: Date.now(),
      url: window.location.pathname,
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/events', body)
    }
  }

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] Event: ${eventName}`, properties)
  }
}
