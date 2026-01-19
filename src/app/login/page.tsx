"use client"

import { motion } from "framer-motion"
import { Github, Zap, Trophy, GitCommit } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/card"
import { cn } from "@/shared/lib/utils"
import { LiveTicker, TickerUpdate } from "@/shared/components/ui/live-ticker"

// [Data] Action 필드 제거 (User + Tier)
const MOCK_LIVE_UPDATES: TickerUpdate[] = [
    { user: "new_challenger", tier: "CHALLENGER" },
    { user: "frontend_master", tier: "DIAMOND" },
    { user: "backend_pro", tier: "PLATINUM" },
    { user: "opensource_L", tier: "GOLD" },
    { user: "junior_dev", tier: "SILVER" },
    { user: "fullstack_JS", tier: "EMERALD" },
];

export default function LoginPage() {
    const handleGithubLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`
    }

    const containerVariants = {
        hidden: {opacity: 0, scale: 0.95},
        visible: {
            opacity: 1, scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0}
    }

    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse"/>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000"/>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                <Card className="border-white/20 bg-white/70 dark:bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-[2rem]">
                    <CardHeader className="text-center space-y-2 pb-6 pt-10">
                        <motion.div variants={itemVariants} className="mx-auto mb-4">
                            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 ring-1 ring-black/5 dark:ring-white/10 shadow-inner">
                                <Trophy className="w-10 h-10 text-primary fill-primary/20" />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                Check Your Tier
                            </CardTitle>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <CardDescription className="text-base font-medium leading-relaxed">
                                내 깃허브 활동은 상위 몇 %일까요?<br/>
                                <span className="text-primary font-bold">10초</span>만에 분석 결과를 확인하세요.
                            </CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="space-y-6 px-0 pb-2">
                        {/* LiveTicker: 유저와 티어만 깔끔하게 노출 */}
                        <motion.div variants={itemVariants} className="relative w-full">
                            <div className="opacity-90 hover:opacity-100 transition-opacity">
                                <LiveTicker updates={MOCK_LIVE_UPDATES} />
                            </div>
                        </motion.div>

                        <div className="px-8 space-y-3">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-colors">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                    <GitCommit className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">활동 정밀 분석</span>
                                    <span className="text-xs text-muted-foreground">커밋, PR, 리뷰 등 기여도 기반 산정</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-colors">
                                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-foreground">실시간 랭킹</span>
                                    <span className="text-xs text-muted-foreground">전체 개발자 중 나의 전투력 순위</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pb-10 px-8 pt-4">
                        <motion.div variants={itemVariants} className="w-full">
                            <Button
                                className={cn(
                                    "w-full h-14 text-[15px] font-bold rounded-xl shadow-xl transition-all active:scale-[0.98] relative overflow-hidden group",
                                    "bg-[#24292F] hover:bg-[#24292F]/90 text-white",
                                    "dark:bg-white dark:text-[#24292F] dark:hover:bg-gray-100"
                                )}
                                onClick={handleGithubLogin}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                                <Github className="mr-2 h-5 w-5 fill-current" />
                                내 티어 확인하기 (GitHub)
                            </Button>
                        </motion.div>

                        <motion.div variants={itemVariants} className="text-center">
                            <p className="text-[10px] text-muted-foreground/60">
                                로그인 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                            </p>
                        </motion.div>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}