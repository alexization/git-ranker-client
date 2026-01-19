import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "개발자 랭킹 | 글로벌 리더보드",
    description: "GitHub 활동 기반 개발자 전투력 글로벌 랭킹. Challenger, Master, Diamond부터 Iron까지 전 세계 개발자들의 순위를 확인하세요.",
    keywords: [
        "개발자 랭킹",
        "GitHub 랭킹",
        "글로벌 리더보드",
        "프로그래머 순위",
        "Developer Leaderboard",
        "GitHub Activity Ranking",
    ],
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "https://www.git-ranker.com/ranking",
        title: "개발자 랭킹 | Git Ranker 글로벌 리더보드",
        description: "GitHub 활동 기반 개발자 전투력 글로벌 랭킹. 전 세계 개발자들의 순위를 확인하세요.",
        siteName: "Git Ranker",
    },
    twitter: {
        card: "summary_large_image",
        title: "개발자 랭킹 | Git Ranker",
        description: "GitHub 활동 기반 개발자 전투력 글로벌 랭킹",
    },
    alternates: {
        canonical: "https://www.git-ranker.com/ranking",
    },
}

export default function RankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
