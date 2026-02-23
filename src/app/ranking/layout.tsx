import type { Metadata } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"

export const metadata: Metadata = {
    title: "Developer Ranking | Global Leaderboard",
    description: "Global developer ranking based on GitHub activity. Check where you stand from Challenger to Iron.",
    keywords: [
        "Developer Ranking",
        "GitHub Ranking",
        "Global Leaderboard",
        "Programmer Ranking",
        "Developer Leaderboard",
        "GitHub Activity Ranking",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: `${BASE_URL}/ranking`,
        title: "Developer Ranking | Git Ranker Global Leaderboard",
        description: "Global developer ranking based on GitHub activity.",
        siteName: "Git Ranker",
    },
    twitter: {
        card: "summary_large_image",
        title: "Developer Ranking | Git Ranker",
        description: "Global developer ranking based on GitHub activity",
    },
    alternates: {
        canonical: `${BASE_URL}/ranking`,
    },
}

export default function RankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Developer Ranking | Git Ranker Global Leaderboard",
        description: "Global developer ranking based on GitHub activity.",
        url: `${BASE_URL}/ranking`,
        isPartOf: {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            name: "Git Ranker",
            url: BASE_URL,
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
