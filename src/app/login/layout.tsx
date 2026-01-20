import { Metadata } from "next"

export const metadata: Metadata = {
    title: "로그인",
    description: "GitHub 계정으로 Git Ranker에 로그인하고 당신의 개발 전투력을 측정하세요. 커밋, PR, 코드 리뷰 등 GitHub 활동을 분석하여 티어를 산정합니다.",
    keywords: ["GitHub 로그인", "개발자 로그인", "Git Ranker 로그인", "개발자 랭킹"],
    openGraph: {
        title: "Git Ranker 로그인",
        description: "GitHub 계정으로 로그인하고 개발 전투력을 측정하세요",
        type: "website",
    },
    robots: {
        index: false,
        follow: true,
    },
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
