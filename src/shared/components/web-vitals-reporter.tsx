"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

type WebVitalsMetric = {
  id: string
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

// Thresholds based on web.dev recommendations
const THRESHOLDS: Record<string, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name]
  if (!threshold) return 'good'
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

function reportWebVitals(metric: WebVitalsMetric): void {
  const rating = getRating(metric.name, metric.value)

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    const colorMap = {
      'good': 'color: green',
      'needs-improvement': 'color: orange',
      'poor': 'color: red',
    }
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${rating})`,
      colorMap[rating]
    )
  }

  // In production, send to analytics service
  // This can be replaced with your preferred analytics provider
  // Examples: Google Analytics, Vercel Analytics, custom endpoint
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Example: Send to a custom endpoint
    const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
    if (analyticsEndpoint) {
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

      // Use sendBeacon for better reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(analyticsEndpoint, body)
      }
    }
  }
}

// Helper to check if web-vitals is available
async function initWebVitals() {
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

export function WebVitalsReporter() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize web-vitals monitoring
    initWebVitals()
  }, [])

  useEffect(() => {
    // Track page views on route change
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] Page view: ${pathname}`)
    }
  }, [pathname])

  // This component doesn't render anything
  return null
}
