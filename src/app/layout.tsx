import type {Metadata, Viewport} from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { AuthProvider } from "@/shared/providers/auth-provider";
import { Toaster } from "@/shared/components/toaster";
import { Header } from "@/shared/components/layout/header";
import { WebVitalsReporter } from "@/shared/components/web-vitals-reporter";
import { cn } from "@/shared/lib/utils";
import { LocaleProvider } from "@/shared/providers/locale-provider";
import { getRequestLocale } from "@/shared/i18n/server-locale";

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

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRequestLocale()
    const isKo = locale === "ko"
    const localizedHomeUrl = `${BASE_URL}/${locale}`
    const title = isKo ? "Git Ranker | 개발자 전투력 점수" : "Git Ranker | Developer Impact Score"
    const description = isKo
        ? "GitHub 활동과 티어 순위를 기반으로 개발자 전투력을 측정합니다."
        : "Measure developer impact with GitHub activity and tier rankings. See your real contribution score."

    return {
        metadataBase: new URL(BASE_URL),
        title: {
            default: title,
            template: "%s | Git Ranker"
        },
        description,
        keywords: isKo
            ? ["GitHub", "개발자 순위", "개발자 전투력", "GitHub 활동", "티어 순위"]
            : ["GitHub", "Developer Ranking", "Developer Impact", "GitHub Activity", "Tier Ranking"],
        authors: [{ name: "Git Ranker Team" }],
        openGraph: {
            type: "website",
            locale: isKo ? "ko_KR" : "en_US",
            url: localizedHomeUrl,
            title,
            description,
            siteName: "Git Ranker",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        alternates: {
            canonical: localizedHomeUrl,
            languages: {
                'en-US': `${BASE_URL}/en`,
                'ko-KR': `${BASE_URL}/ko`,
                'x-default': `${BASE_URL}/en`,
            },
        },
    }
}

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
    width: "device-width",
    initialScale: 1,
};

export default async function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getRequestLocale()

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            {/* Preconnect to external origins for faster resource loading */}
            <link rel="preconnect" href="https://avatars.githubusercontent.com" />
            <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-QKZNEY525E"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-QKZNEY525E');
                `}
            </Script>
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
            <LocaleProvider initialLocale={locale}>
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
            </LocaleProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
