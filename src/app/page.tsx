import type { Metadata } from "next"
import { HeroSection } from "@/features/home/components/hero-section"
import { GithubIcon } from "@/shared/components/icons/github-icon"

export const metadata: Metadata = {
    title: "Git Ranker | GitHub 활동 기반 개발자 전투력 측정",
    description: "GitHub 커밋, PR, 이슈, 코드 리뷰를 분석하여 개발자 전투력을 측정하고 티어를 부여합니다. Challenger부터 Iron까지 당신의 진짜 기여도를 확인하세요.",
    keywords: [
        "GitHub 랭킹",
        "개발자 전투력",
        "개발자 티어",
        "GitHub 활동 분석",
        "오픈소스 기여도",
        "Developer Ranking",
        "GitHub Stats",
        "코딩 능력 측정",
        "개발자 포트폴리오",
    ],
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: "https://www.git-ranker.com",
        title: "Git Ranker | GitHub 활동 기반 개발자 전투력 측정",
        description: "GitHub 커밋, PR, 이슈, 코드 리뷰를 분석하여 개발자 전투력을 측정하고 티어를 부여합니다.",
        siteName: "Git Ranker",
        images: [
            {
                url: "https://www.git-ranker.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "Git Ranker - 개발자 전투력 측정 서비스",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Git Ranker | 개발자 전투력 측정",
        description: "GitHub 활동 기반 개발자 전투력 측정 및 티어 랭킹 서비스",
        images: ["https://www.git-ranker.com/og-image.png"],
    },
    alternates: {
        canonical: "https://www.git-ranker.com",
    },
}

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://www.git-ranker.com/#website",
                url: "https://www.git-ranker.com",
                name: "Git Ranker",
                description: "GitHub 활동 기반 개발자 전투력 측정 서비스",
                inLanguage: "ko-KR",
            },
            {
                "@type": "Organization",
                "@id": "https://www.git-ranker.com/#organization",
                name: "Git Ranker",
                url: "https://www.git-ranker.com",
                logo: {
                    "@type": "ImageObject",
                    url: "https://www.git-ranker.com/logo.png",
                },
                sameAs: ["https://github.com/alexization"],
            },
            {
                "@type": "WebApplication",
                "@id": "https://www.git-ranker.com/#webapp",
                name: "Git Ranker",
                url: "https://www.git-ranker.com",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web Browser",
                description:
                    "GitHub 커밋, PR, 이슈, 코드 리뷰를 분석하여 개발자 전투력을 측정합니다.",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "KRW",
                },
                featureList: [
                    "GitHub 활동 분석",
                    "개발자 티어 시스템",
                    "글로벌 랭킹",
                    "프로필 배지 생성",
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
