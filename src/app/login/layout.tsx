import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in with GitHub and measure your developer impact from commits, PRs, and reviews.",
    keywords: ["GitHub Sign In", "Developer Login", "Git Ranker Login", "Developer Ranking"],
    openGraph: {
        title: "Git Ranker Sign In",
        description: "Sign in with GitHub and measure your developer impact",
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
