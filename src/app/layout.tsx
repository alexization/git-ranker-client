import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/shared/providers/query-provider";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { Toaster } from "@/shared/components/toaster";
import { Header } from "@/shared/components/layout/header";
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

// [FIX] favicon.ico 명시적 지정
export const metadata: Metadata = {
    title: "Git Ranker",
    description: "GitHub 활동 기반 개발자 전투력 측정 서비스",
    icons: {
        icon: "/favicon.ico", // public/favicon.ico를 참조합니다.
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
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
                <Header />
                <div className="flex-1">
                    {children}
                </div>
                <Toaster />
            </QueryProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}