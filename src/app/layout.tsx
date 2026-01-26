import type {Metadata, Viewport} from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { Toaster } from "@/shared/components/toaster";
import { Header } from "@/shared/components/layout/header";
import { WebVitalsReporter } from "@/shared/components/web-vitals-reporter";
import { cn } from "@/shared/lib/utils";

const pretendard = localFont({
    src: "../fonts/PretendardVariable.woff2",
    display: "swap",
    weight: "45 920",
    variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com"

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "Git Ranker | 개발자 전투력 측정",
        template: "%s | Git Ranker"
    },
    description: "GitHub 활동 기반 개발자 전투력 측정 및 티어 랭킹 서비스. 당신의 진짜 기여도를 확인하세요.",
    keywords: ["GitHub", "Ranking", "Developer", "Combat Power", "깃허브", "랭킹", "개발자", "전투력"],
    authors: [{ name: "Git Ranker Team" }],
    openGraph: {
        type: "website",
        locale: "ko_KR",
        url: BASE_URL,
        title: "Git Ranker | 개발자 전투력 측정",
        description: "GitHub 활동 기반 개발자 전투력 측정 및 티어 랭킹 서비스.",
        siteName: "Git Ranker",
    },
    twitter: {
        card: "summary_large_image",
        title: "Git Ranker | 개발자 전투력 측정",
        description: "GitHub 활동 기반 개발자 전투력 측정 및 티어 랭킹 서비스.",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
        <head>
            {/* Preconnect to external origins for faster resource loading */}
            <link rel="preconnect" href="https://avatars.githubusercontent.com" />
            <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </head>
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased flex flex-col",
                pretendard.variable,
                jetbrainsMono.variable
            )}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <QueryProvider>
                <AuthProvider>
                    <Header />
                    <div className="flex-1">
                        {children}
                    </div>
                    <Toaster />
                    <WebVitalsReporter />
                </AuthProvider>
            </QueryProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}