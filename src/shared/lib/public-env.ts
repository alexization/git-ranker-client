const publicEnv = {
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const

const getRequiredPublicEnv = (
  name: keyof typeof publicEnv
): string => {
  const value = publicEnv[name]

  if (!value) {
    throw new Error(
      `[env] ${name} is required. Set it in .env.local for local Next.js commands or .env for docker compose before starting git-ranker-client.`
    )
  }

  try {
    return new URL(value).origin
  } catch {
    throw new Error(`[env] ${name} must be a valid absolute URL.`)
  }
}

const buildAbsoluteUrl = (origin: string, pathname: string): string => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`
  return new URL(normalizedPath, `${origin}/`).toString()
}

export const publicBaseUrl = getRequiredPublicEnv("NEXT_PUBLIC_BASE_URL")
export const publicApiOrigin = getRequiredPublicEnv("NEXT_PUBLIC_API_URL")
export const publicApiBaseUrl = buildAbsoluteUrl(publicApiOrigin, "/api/v1")
export const githubOAuthStartUrl = buildAbsoluteUrl(publicApiOrigin, "/oauth2/authorization/github")

export const getPublicSiteUrl = (pathname: string): string => buildAbsoluteUrl(publicBaseUrl, pathname)
export const getPublicApiUrl = (pathname: string): string => buildAbsoluteUrl(publicApiOrigin, pathname)
export const getBadgeImageUrl = (nodeId: string): string =>
  buildAbsoluteUrl(publicApiOrigin, `/api/v1/badges/${encodeURIComponent(nodeId)}`)
