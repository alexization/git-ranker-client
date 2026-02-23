import type { Metadata } from "next"
import { HeroSection } from "@/features/home/components/hero-section"
import { GithubIcon } from "@/shared/components/icons/github-icon"

export const metadata: Metadata = {
    title: "Git Ranker | Developer Impact from GitHub Activity",
    description: "Analyze commits, PRs, issues, and reviews to measure your developer impact and tier.",
    keywords: [
        "GitHub Ranking",
        "Developer Impact",
        "Developer Tier",
        "GitHub Activity Analysis",
        "Open Source Contribution",
        "Developer Portfolio",
    ],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.git-ranker.com",
        title: "Git Ranker | Developer Impact from GitHub Activity",
        description: "Analyze commits, PRs, issues, and reviews to measure your developer impact and tier.",
        siteName: "Git Ranker",
        images: [
            {
                url: "https://www.git-ranker.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "Git Ranker - Developer impact analytics service",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Git Ranker | Developer Impact Score",
        description: "GitHub activity based developer impact and tier ranking service",
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
                description: "GitHub activity based developer impact analytics service",
                inLanguage: "en-US",
            },
            {
                "@type": "Organization",
                "@id": "https://www.git-ranker.com/#organization",
                name: "Git Ranker",
                url: "https://www.git-ranker.com",
                logo: {
                    "@type": "ImageObject",
                    url: "https://www.git-ranker.com/og-image.png",
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
                    "Analyze commits, PRs, issues, and code reviews to measure developer impact.",
                offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                },
                featureList: [
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
