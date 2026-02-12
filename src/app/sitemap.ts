import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.git-ranker.com"

interface RankingUser {
    username: string
    tier: string
    totalScore: number
    profileImage: string
}

interface ApiResponse {
    rankings?: RankingUser[]
    pageInfo?: {
        totalPages: number
        totalElements: number
    }
}

async function getTopUsers(): Promise<RankingUser[]> {
    try {
        // First, get the first page to understand total pages
        const firstPageResponse = await fetch(`${API_URL}/api/v1/ranking?page=0&size=20`, {
            next: { revalidate: 3600 },
            headers: {
                'Accept': 'application/json',
            }
        })

        if (!firstPageResponse.ok) {
            return []
        }

        const firstPageData: ApiResponse = await firstPageResponse.json()
        const totalPages = Math.min(firstPageData.pageInfo?.totalPages || 1, 25) // Max 25 pages = 500 users

        // Fetch up to 500 users (25 pages x 20 users per page)
        const pages = Array.from({ length: totalPages }, (_, i) => i)
        const responses = await Promise.all(
            pages.map(page =>
                fetch(`${API_URL}/api/v1/ranking?page=${page}&size=20`, {
                    next: { revalidate: 3600 },
                    headers: {
                        'Accept': 'application/json',
                    }
                }).then(res => res.ok ? res.json() as Promise<ApiResponse> : null)
                  .catch(() => null)
            )
        )

        const users: RankingUser[] = []
        for (const response of responses) {
            if (response?.rankings) {
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

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/ranking`,
            lastModified: currentDate,
            changeFrequency: "hourly",
            priority: 0.9,
        },
    ]

    // Dynamic user pages
    const topUsers = await getTopUsers()

    // Assign priority based on ranking (top users get higher priority)
    const userRoutes: MetadataRoute.Sitemap = topUsers.map((user, index) => {
        // Top 10: priority 0.9, Top 50: 0.85, Top 100: 0.8, rest: 0.7
        let priority = 0.7
        if (index < 10) priority = 0.9
        else if (index < 50) priority = 0.85
        else if (index < 100) priority = 0.8

        return {
            url: `${BASE_URL}/users/${encodeURIComponent(user.username)}`,
            lastModified: currentDate,
            changeFrequency: "daily" as const,
            priority,
        }
    })

    return [...staticRoutes, ...userRoutes]
}
