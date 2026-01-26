import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const isDev = process.env.NODE_ENV === "development"

  // connect-src 구성
  // - Production: 'self' (같은 도메인 www.git-ranker.com)
  // - Development: 'self' + localhost:8080 (API 서버)
  const connectSrc = isDev
    ? "'self' http://localhost:8080"
    : "'self'"

  // Security Headers
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https://avatars.githubusercontent.com https://github.com",
    `connect-src ${connectSrc}`,
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ")

  // Content Security Policy
  response.headers.set("Content-Security-Policy", cspDirectives)

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY")

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff")

  // Enable XSS protection
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Control referrer information
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // HSTS - Force HTTPS (프로덕션에서만)
  if (!isDev) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    )
  }

  // Permissions Policy - Restrict browser features
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  )

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
