import { MetadataRoute } from "next"
import type { ApiResponse, RankingListResponse, RankingUserInfo } from "@/shared/types/api"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.git-ranker.com"
const SEO_LOCALES = ["en", "ko"] as const

async function getRankingPage(page: number): Promise<RankingListResponse | null> {
    const response = await fetch(`${API_URL}/api/v1/ranking?page=${page}&size=20`, {
        next: { revalidate: 3600 },
        headers: {
            Accept: "application/json",
        },
    })

    if (!response.ok) {
        return null
    }

    const payload = await response.json() as ApiResponse<RankingListResponse>
    if (payload.result !== "SUCCESS" || !payload.data) {
        return null
    }

    return payload.data
}

async function getTopUsers(): Promise<RankingUserInfo[]> {
    try {
        // First, get the first page to understand total pages
        const firstPageData = await getRankingPage(0)
        if (!firstPageData) {
            return []
        }

        const totalPages = Math.min(firstPageData.pageInfo.totalPages || 1, 25) // Max 25 pages = 500 users

        // Fetch up to 500 users (25 pages x 20 users per page)
        const pages = Array.from({ length: totalPages }, (_, i) => i)
        const responses = await Promise.all(pages.map((page) => getRankingPage(page).catch(() => null)))

        const users: RankingUserInfo[] = []
        for (const response of responses) {
            if (response) {
                users.push(...response.rankings)
            }
        }

        // Deduplicate by username (just in case)
        const uniqueUsers = Array.from(
            new Map(users.map(user => [user.username, user])).values()
        )

        return uniqueUsers
    } catch {
        // Silent fail - return empty array on error
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const currentDate = new Date().toISOString()

    const staticRoutes: MetadataRoute.Sitemap = SEO_LOCALES.flatMap((locale) => [
        {
            url: `${BASE_URL}/${locale}`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${BASE_URL}/${locale}/ranking`,
            lastModified: currentDate,
            changeFrequency: "hourly" as const,
            priority: 0.9,
        },
    ])

    // Dynamic user pages
    const topUsers = await getTopUsers()

    // Assign priority based on ranking (top users get higher priority)
    const userRoutes: MetadataRoute.Sitemap = topUsers.flatMap((user, index) => {
        // Top 10: priority 0.9, Top 50: 0.85, Top 100: 0.8, rest: 0.7
        let priority = 0.7
        if (index < 10) priority = 0.9
        else if (index < 50) priority = 0.85
        else if (index < 100) priority = 0.8

        return SEO_LOCALES.map((locale) => ({
            url: `${BASE_URL}/${locale}/users/${encodeURIComponent(user.username)}`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority,
        }))
    })

    return [...staticRoutes, ...userRoutes]
}
