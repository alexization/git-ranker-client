import type { Metadata } from "next"
import { HeroSection } from "@/features/home/components/hero-section"
import { GithubIcon } from "@/shared/components/icons/github-icon"
import { getRequestLocale } from "@/shared/i18n/server-locale"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const pageUrl = `${BASE_URL}/${locale}`
    const title = isKo
        ? "GitHub 활동 기반 개발자 전투력"
        : "Developer Impact from GitHub Activity"
    const description = isKo
        ? "커밋, PR, 이슈, 리뷰를 분석해 개발자 전투력과 티어를 확인하세요."
        : "Analyze commits, PRs, issues, and reviews to measure your developer impact and tier."

    return {
        title,
        description,
        keywords: isKo
            ? [
                "GitHub 순위",
                "개발자 전투력",
                "개발자 티어",
                "GitHub 활동 분석",
                "오픈소스 기여",
                "개발자 포트폴리오",
            ]
            : [
                "GitHub Ranking",
                "Developer Impact",
                "Developer Tier",
                "GitHub Activity Analysis",
                "Open Source Contribution",
                "Developer Portfolio",
            ],
        openGraph: {
            type: "website",
            locale: isKo ? "ko_KR" : "en_US",
            url: pageUrl,
            title,
            description,
            siteName: "Git Ranker",
            images: [
                {
                    url: `${BASE_URL}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: isKo
                        ? "Git Ranker - 개발자 전투력 분석 서비스"
                        : "Git Ranker - Developer impact analytics service",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: isKo ? "Git Ranker | 개발자 전투력 점수" : "Git Ranker | Developer Impact Score",
            description: isKo
                ? "GitHub 활동 기반 개발자 전투력 및 티어 순위 서비스"
                : "GitHub activity based developer impact and tier ranking service",
            images: [`${BASE_URL}/og-image.png`],
        },
        alternates: {
            canonical: pageUrl,
            languages: {
                'en-US': `${BASE_URL}/en`,
                'ko-KR': `${BASE_URL}/ko`,
                'x-default': `${BASE_URL}/en`,
            },
        },
    }
}

export default async function Home() {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const pageUrl = `${BASE_URL}/${locale}`
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${pageUrl}/#website`,
                url: pageUrl,
                name: "Git Ranker",
                description: isKo
                    ? "GitHub 활동 기반 개발자 전투력 분석 서비스"
                    : "GitHub activity based developer impact analytics service",
                inLanguage: isKo ? "ko-KR" : "en-US",
            },
            {
                "@type": "Organization",
                "@id": "https://www.git-ranker.com/#organization",
                name: "Git Ranker",
                url: BASE_URL,
                logo: {
                    "@type": "ImageObject",
                    url: `${BASE_URL}/og-image.png`,
                },
                sameAs: ["https://github.com/alexization"],
            },
            {
                "@type": "WebApplication",
                "@id": `${pageUrl}/#webapp`,
                name: "Git Ranker",
                url: pageUrl,
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web Browser",
                description: isKo
                    ? "커밋, PR, 이슈, 코드 리뷰를 분석해 개발자 전투력을 측정합니다."
                    : "Analyze commits, PRs, issues, and code reviews to measure developer impact.",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                featureList: isKo
                    ? [
                        "GitHub 활동 분석",
                        "개발자 티어 시스템",
                        "전체 개발자 순위",
                        "프로필 배지 생성",
                    ]
                    : [
                        "GitHub activity analysis",
                        "Developer tier system",
                        "Global ranking",
                        "Profile badge generation",
                    ],
            },
        ],
    }

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="flex-1">
                <HeroSection />
            </main>

            <footer className="py-8 border-t bg-background/50 backdrop-blur-sm">
                <div className="container flex flex-col items-center justify-center gap-3">
                    <p className="text-sm text-muted-foreground text-center">
                        &copy; 2026 Git Ranker. All rights reserved.
                    </p>
                    <a
                        href="https://github.com/alexization"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-foreground/80 hover:text-primary transition-colors"
                    >
                        <GithubIcon className="h-4 w-4" />
                        <span>alexization</span>
                    </a>
                </div>
            </footer>
        </div>
    )
}
