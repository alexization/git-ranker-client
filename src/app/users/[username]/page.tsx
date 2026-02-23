import type { Metadata } from "next"
import { getUser } from "@/features/user/api/user-service"
import { getRequestLocale } from "@/shared/i18n/server-locale"
import { UserProfileClient } from "./user-profile-client"

// ISR: revalidate every 1 hour
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
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const canonicalUrl = `${BASE_URL}/${locale}/users/${username}`

    try {
        const user = await getUser(username)

        const title = isKo
            ? `${user.username} - ${user.tier} 티어 | ${user.totalScore.toLocaleString()}점`
            : `${user.username} - ${user.tier} Tier | ${user.totalScore.toLocaleString()} points`
        const description = isKo
            ? `${user.username}님의 개발자 전투력: ${user.tier} 티어, ${user.totalScore.toLocaleString()}점, 상위 ${user.percentile.toFixed(2)}%. GitHub 활동 기반 순위를 확인하세요.`
            : `${user.username}'s developer impact: ${user.tier} tier, ${user.totalScore.toLocaleString()} points, top ${user.percentile.toFixed(2)}%. Check ranking based on GitHub activity.`

        // Use dynamic OG image route
        const ogImageUrl = `${BASE_URL}/users/${username}/opengraph-image`

        return {
            title,
            description,
            openGraph: {
                type: "profile",
                locale: isKo ? "ko_KR" : "en_US",
                url: canonicalUrl,
                title: `${user.username} | Git Ranker`,
                description,
                siteName: "Git Ranker",
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: `${user.username}'s Git Ranker profile - ${user.tier} tier`,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: isKo
                    ? `${user.username} - ${user.tier} 티어 | Git Ranker`
                    : `${user.username} - ${user.tier} Tier | Git Ranker`,
                description,
                images: [ogImageUrl],
            },
            alternates: {
                canonical: canonicalUrl,
                languages: {
                    'en-US': `${BASE_URL}/en/users/${username}`,
                    'ko-KR': `${BASE_URL}/ko/users/${username}`,
                    'x-default': `${BASE_URL}/en/users/${username}`,
                },
            },
            robots: {
                index: true,
                follow: true,
            },
        }
    } catch {
        return {
            title: isKo ? `${decodedUsername} 프로필` : decodedUsername,
            description: isKo
                ? `${decodedUsername}님의 GitHub 활동 기반 개발자 전투력을 확인하세요.`
                : `Check ${decodedUsername}'s developer impact based on GitHub activity.`,
            robots: {
                index: false,
                follow: true,
            },
        }
    }
}

export default async function UserDetailPage({ params }: PageProps) {
    const { username } = await params
    const locale = await getRequestLocale()
    const profileUrl = `${BASE_URL}/${locale}/users/${username}`

    let jsonLd = null
    try {
        const user = await getUser(username)
        jsonLd = {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
                "@type": "Person",
                name: user.username,
                url: profileUrl,
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
