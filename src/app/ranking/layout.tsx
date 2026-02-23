import type { Metadata } from "next"
import { getRequestLocale } from "@/shared/i18n/server-locale"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const pageUrl = `${BASE_URL}/${locale}/ranking`
    const title = isKo
        ? "전체 개발자 전투력 순위"
        : "Developer Ranking | Global Leaderboard"
    const description = isKo
        ? "GitHub 활동 기반 전체 개발자 순위입니다. Challenger부터 Iron까지 내 위치를 확인하세요."
        : "Global developer ranking based on GitHub activity. Check where you stand from Challenger to Iron."

    return {
        title,
        description,
        keywords: isKo
            ? [
                "개발자 순위",
                "GitHub 순위",
                "전체 순위",
                "프로그래머 순위",
                "개발자 리더보드",
                "GitHub 활동 순위",
            ]
            : [
                "Developer Ranking",
                "GitHub Ranking",
                "Global Leaderboard",
                "Programmer Ranking",
                "Developer Leaderboard",
                "GitHub Activity Ranking",
            ],
        openGraph: {
            type: "website",
            locale: isKo ? "ko_KR" : "en_US",
            url: pageUrl,
            title: isKo
                ? "전체 개발자 전투력 순위 | Git Ranker"
                : "Developer Ranking | Git Ranker Global Leaderboard",
            description,
            siteName: "Git Ranker",
        },
        twitter: {
            card: "summary_large_image",
            title: isKo ? "전체 개발자 전투력 순위 | Git Ranker" : "Developer Ranking | Git Ranker",
            description,
        },
        alternates: {
            canonical: pageUrl,
            languages: {
                'en-US': `${BASE_URL}/en/ranking`,
                'ko-KR': `${BASE_URL}/ko/ranking`,
                'x-default': `${BASE_URL}/en/ranking`,
            },
        },
    }
}

export default async function RankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const pageUrl = `${BASE_URL}/${locale}/ranking`
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: isKo
            ? "전체 개발자 전투력 순위 | Git Ranker"
            : "Developer Ranking | Git Ranker Global Leaderboard",
        description: isKo
            ? "GitHub 활동 기반 전체 개발자 순위입니다."
            : "Global developer ranking based on GitHub activity.",
        url: pageUrl,
        isPartOf: {
            "@type": "WebSite",
            "@id": `${BASE_URL}/${locale}/#website`,
            name: "Git Ranker",
            url: `${BASE_URL}/${locale}`,
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    )
}
