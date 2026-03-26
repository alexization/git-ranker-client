import { Metadata } from "next"
import { getRequestLocale } from "@/shared/i18n/server-locale"
import { publicBaseUrl } from "@/shared/lib/public-env"

const BASE_URL = publicBaseUrl

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const pageUrl = `${BASE_URL}/${locale}/login`

    return {
        title: isKo ? "로그인" : "Sign In",
        description: isKo
            ? "GitHub로 로그인하고 커밋, PR, 리뷰 기반 개발자 전투력을 확인하세요."
            : "Sign in with GitHub and measure your developer impact from commits, PRs, and reviews.",
        keywords: isKo
            ? ["GitHub 로그인", "개발자 로그인", "Git Ranker 로그인", "개발자 순위"]
            : ["GitHub Sign In", "Developer Login", "Git Ranker Login", "Developer Ranking"],
        openGraph: {
            title: isKo ? "Git Ranker 로그인" : "Git Ranker Sign In",
            description: isKo
                ? "GitHub로 로그인하고 개발자 전투력을 확인하세요."
                : "Sign in with GitHub and measure your developer impact",
            type: "website",
            locale: isKo ? "ko_KR" : "en_US",
            url: pageUrl,
        },
        alternates: {
            canonical: pageUrl,
            languages: {
                'en-US': `${BASE_URL}/en/login`,
                'ko-KR': `${BASE_URL}/ko/login`,
                'x-default': `${BASE_URL}/en/login`,
            },
        },
        robots: {
            index: false,
            follow: true,
        },
    }
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
