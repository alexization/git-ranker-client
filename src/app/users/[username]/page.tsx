import type { Metadata } from "next"
import { getUser } from "@/features/user/api/user-service"
import { UserProfileClient } from "./user-profile-client"

interface Props {
    params: Promise<{ username: string }>
}

interface PageProps {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params
    const decodedUsername = decodeURIComponent(username)

    try {
        const user = await getUser(username)

        const title = `${user.username} - ${user.tier} 티어 | ${user.totalScore.toLocaleString()}점`
        const description = `${user.username}님의 개발자 전투력: ${user.tier} 티어, 총 ${user.totalScore.toLocaleString()}점, 상위 ${user.percentile.toFixed(2)}%. GitHub 활동 기반 개발자 랭킹을 확인하세요.`

        return {
            title,
            description,
            openGraph: {
                type: "profile",
                locale: "ko_KR",
                url: `https://www.git-ranker.com/users/${username}`,
                title: `${user.username} | Git Ranker`,
                description,
                siteName: "Git Ranker",
                images: [
                    {
                        url: user.profileImage,
                        width: 400,
                        height: 400,
                        alt: `${user.username}'s GitHub profile`,
                    },
                ],
            },
            twitter: {
                card: "summary",
                title: `${user.username} - ${user.tier} 티어 | Git Ranker`,
                description,
                images: [user.profileImage],
            },
            alternates: {
                canonical: `https://www.git-ranker.com/users/${username}`,
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
    return <UserProfileClient username={username} />
}
