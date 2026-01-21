import { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://www.git-ranker.com"

interface RankingUser {
    username: string
    tier: string
    totalScore: number
    profileImage: string
}

async function getTopUsers(): Promise<RankingUser[]> {
    try {
        // 상위 100명의 사용자를 sitemap에 포함 (5페이지 x 20명)
        const pages = [0, 1, 2, 3, 4]
        const responses = await Promise.all(
            pages.map(page =>
                fetch(`${API_URL}/api/v1/ranking?page=${page}`, {
                    next: { revalidate: 3600 } // 1시간마다 갱신
                }).then(res => res.ok ? res.json() : null)
            )
        )

        const users: RankingUser[] = []
        for (const response of responses) {
            if (response?.rankings) {
                users.push(...response.rankings)
            }
        }
        return users
    } catch (error) {
        console.error("Failed to fetch users for sitemap:", error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const currentDate = new Date().toISOString()

    // 정적 라우트
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
        {
            url: `${BASE_URL}/login`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ]

    // 동적 사용자 페이지
    const topUsers = await getTopUsers()
    const userRoutes: MetadataRoute.Sitemap = topUsers.map(user => ({
        url: `${BASE_URL}/users/${encodeURIComponent(user.username)}`,
        lastModified: currentDate,
        changeFrequency: "daily",
        priority: 0.8,
    }))

    return [...staticRoutes, ...userRoutes]
}
