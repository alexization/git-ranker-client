import type { Metadata } from "next"
import { getUser } from "@/features/user/api/user-service"
import { UserProfileClient } from "./user-profile-client"

// ISR: 1시간마다 페이지 재검증
export const revalidate = 3600

interface Props {
    params: Promise<{ username: string }>
}

interface PageProps {
    params: Promise<{ username: string }>
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params
    const decodedUsername = decodeURIComponent(username)

    try {
        const user = await getUser(username)

        const title = `${user.username} - ${user.tier} 티어 | ${user.totalScore.toLocaleString()}점`
        const description = `${user.username}님의 개발자 전투력: ${user.tier} 티어, 총 ${user.totalScore.toLocaleString()}점, 상위 ${user.percentile.toFixed(2)}%. GitHub 활동 기반 개발자 랭킹을 확인하세요.`

        // Use dynamic OG image route
        const ogImageUrl = `${BASE_URL}/users/${username}/opengraph-image`

        return {
            title,
            description,
            openGraph: {
                type: "profile",
                locale: "ko_KR",
                url: `${BASE_URL}/users/${username}`,
                title: `${user.username} | Git Ranker`,
                description,
                siteName: "Git Ranker",
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: `${user.username}의 Git Ranker 프로필 - ${user.tier} 티어`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${user.username} - ${user.tier} 티어 | Git Ranker`,
                description,
                images: [ogImageUrl],
            },
            alternates: {
                canonical: `${BASE_URL}/users/${username}`,
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    } catch {
        return {
            title: `${decodedUsername} | Git Ranker`,
            description: `${decodedUsername}님의 GitHub 활동 기반 개발자 전투력을 확인하세요.`,
            robots: {
                index: false,
                follow: true,
            },
        }
    }
}

export default async function UserDetailPage({ params }: PageProps) {
    const { username } = await params

    let jsonLd = null
    try {
        const user = await getUser(username)
        jsonLd = {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
                "@type": "Person",
                name: user.username,
                url: `${BASE_URL}/users/${username}`,
                image: user.profileImage,
                sameAs: [`https://github.com/${user.username}`],
            },
        }
    } catch {
        // no JSON-LD for users not found
    }

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <UserProfileClient username={username} />
        </>
    )
}
