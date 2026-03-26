import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {
  LOCALE_STORAGE_KEY,
  getLocaleFromPathname,
  localizePathname,
  normalizeLocale,
  stripLocaleFromPathname,
} from "@/shared/i18n/config"
import { publicApiOrigin } from "@/shared/lib/public-env"

const PUBLIC_FILE = /\.[^/]+$/
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

function joinCspSources(...sources: string[]): string {
  return Array.from(new Set(sources.filter(Boolean))).join(" ")
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  const analyticsHosts = [
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
  ]

  const cspDirectives = [
    "default-src 'self'",
    `script-src ${joinCspSources("'self'", "'unsafe-inline'", "'unsafe-eval'", "https://www.googletagmanager.com")}`,
    `style-src ${joinCspSources("'self'", "'unsafe-inline'")}`,
    `font-src ${joinCspSources("'self'")}`,
    `img-src ${joinCspSources(
      "'self'",
      "data:",
      "blob:",
      publicApiOrigin,
      "https://avatars.githubusercontent.com",
      "https://github.com",
      "https://www.google-analytics.com"
    )}`,
    `connect-src ${joinCspSources("'self'", publicApiOrigin, ...analyticsHosts)}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")

  response.headers.set("Content-Security-Policy", cspDirectives)
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )

  return response
}

function shouldBypassLocaleRouting(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true
  if (pathname.startsWith("/api")) return true
  if (pathname.startsWith("/oauth2")) return true
  if (pathname.startsWith("/login/oauth2")) return true
  if (pathname === "/favicon.ico") return true
  if (pathname === "/robots.txt") return true
  if (pathname === "/sitemap.xml") return true
  if (pathname === "/manifest.webmanifest") return true
  if (PUBLIC_FILE.test(pathname)) return true
  return false
}

function resolveRequestLocale(request: NextRequest) {
  const localeFromCookie = request.cookies.get(LOCALE_STORAGE_KEY)?.value
  if (localeFromCookie) {
    return normalizeLocale(localeFromCookie)
  }

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      const refererPathname = new URL(referer).pathname
      const localeFromRefererPath = getLocaleFromPathname(refererPathname)
      if (localeFromRefererPath) {
        return localeFromRefererPath
      }
    } catch {
      // ignore invalid referer
    }
  }

  const localeFromHeader = request.headers.get("accept-language")
  return normalizeLocale(localeFromHeader)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (shouldBypassLocaleRouting(pathname)) {
    return applySecurityHeaders(NextResponse.next())
  }

  const pathLocale = getLocaleFromPathname(pathname)

  if (pathLocale) {
    const strippedPath = stripLocaleFromPathname(pathname)

    // locale prefix가 붙은 백엔드 경로는 원본 경로로 돌려서
    // nginx location(/api, /oauth2, /login/oauth2) 매칭을 보장한다.
    if (
      strippedPath.startsWith("/api") ||
      strippedPath.startsWith("/oauth2") ||
      strippedPath.startsWith("/login/oauth2")
    ) {
      const backendPathUrl = request.nextUrl.clone()
      backendPathUrl.pathname = strippedPath
      const response = NextResponse.redirect(backendPathUrl, 307)
      response.cookies.set(LOCALE_STORAGE_KEY, pathLocale, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
      })
      return applySecurityHeaders(response)
    }

    const rewriteUrl = request.nextUrl.clone()
    rewriteUrl.pathname = strippedPath

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-locale", pathLocale)

    const response = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: requestHeaders,
      },
    })
    response.cookies.set(LOCALE_STORAGE_KEY, pathLocale, {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    })

    return applySecurityHeaders(response)
  }

  const locale = resolveRequestLocale(request)
  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = localizePathname(pathname, locale)

  const response = NextResponse.redirect(redirectUrl, 307)
  response.cookies.set(LOCALE_STORAGE_KEY, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  })

  return applySecurityHeaders(response)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
