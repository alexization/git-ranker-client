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
import { LocaleProvider } from "@/shared/providers/locale-provider";

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
        default: "Git Ranker | Developer Impact Score",
        template: "%s | Git Ranker"
    },
    description: "Measure developer impact with GitHub activity and tier rankings. See your real contribution score.",
    keywords: ["GitHub", "Developer Ranking", "Developer Impact", "GitHub Activity", "Tier Ranking"],
    authors: [{ name: "Git Ranker Team" }],
    openGraph: {
        type: "website",
        locale: "en_US",
        url: BASE_URL,
        title: "Git Ranker | Developer Impact Score",
        description: "Measure developer impact with GitHub activity and tier rankings.",
        siteName: "Git Ranker",
    },
    twitter: {
        card: "summary_large_image",
        title: "Git Ranker | Developer Impact Score",
        description: "Measure developer impact with GitHub activity and tier rankings.",
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
        canonical: BASE_URL,
        languages: {
            'en-US': BASE_URL,
            'ko-KR': BASE_URL,
            'x-default': BASE_URL,
        },
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
        <html lang="en" suppressHydrationWarning>
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
            <LocaleProvider>
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
