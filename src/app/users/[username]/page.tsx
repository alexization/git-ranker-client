"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useUser, useRefreshUser } from "@/features/user/api/user-service"
import { ActivityGrid } from "@/features/user/components/activity-grid"
import { StatsChart } from "@/features/user/components/stats-chart"
import { BadgeGenerator } from "@/features/user/components/badge-generator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/shared/components/card"
import { RefreshCcw, Github, Share2, Trophy, SearchX, ArrowLeft, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { useEffect, useState } from "react"

export default function UserDetailPage() {
    const router = useRouter()
    const params = useParams()
    // [FIX] URL 인코딩된 문자열(한글 등)을 디코딩하여 사람이 읽을 수 있게 변환
    const rawUsername = params.username as string
    const username = decodeURIComponent(rawUsername)

    const { data: user, isLoading, isError } = useUser(rawUsername)
    const refreshMutation = useRefreshUser()

    const [displayPercentile, setDisplayPercentile] = useState(0)

    useEffect(() => {
        if (user) {
            let start = 0
            const end = user.percentile
            const duration = 1500
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setDisplayPercentile(end)
                    clearInterval(timer)
                } else {
                    setDisplayPercentile(start)
                }
            }, 16)
            return () => clearInterval(timer)
        }
    }, [user])

    const handleRefresh = () => {
        toast.promise(refreshMutation.mutateAsync(rawUsername), {
            loading: '최신 데이터를 GitHub에서 가져오는 중...',
            success: '데이터가 갱신되었습니다!',
            error: '데이터 갱신에 실패했습니다. (쿨다운 7일)',
        })
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Git Ranker - ${username}`,
                text: `${username}님의 개발자 전투력을 확인해보세요!`,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("링크가 복사되었습니다!")
        }
    }

    const handleGithubRegister = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`
    }

    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="container py-12 max-w-6xl space-y-8">
                <div className="flex items-center gap-6">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-60" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-12 md:grid-rows-2 h-[600px]">
                    <Skeleton className="md:col-span-8 md:row-span-2 rounded-3xl" />
                    <Skeleton className="md:col-span-4 md:row-span-1 rounded-3xl" />
                    <Skeleton className="md:col-span-4 md:row-span-1 rounded-3xl" />
                </div>
            </div>
        )
    }

    // --- Error / Not Found State (Refined UX) ---
    if (isError || !user) {
        return (
            <div className="container flex flex-col items-center justify-center py-20 min-h-[70vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-lg"
                >
                    <Card className="border-2 border-dashed border-muted-foreground/20 bg-card/50 backdrop-blur-xl shadow-xl overflow-hidden">
                        <CardHeader className="text-center pb-6 bg-secondary/10 border-b border-border/50">
                            <div className="mx-auto bg-background w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-sm border border-border">
                                <SearchX className="h-10 w-10 text-muted-foreground" />
                            </div>

                            {/* [FIX] break-all 추가로 긴 문자열도 안전하게 표시 */}
                            <CardTitle className="text-3xl font-extrabold break-all px-4 leading-tight">
                                @{username}
                            </CardTitle>
                            <CardDescription className="text-lg mt-2 font-medium">
                                사용자를 찾을 수 없습니다.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-8 px-6 sm:px-8">
                            {/* Case 1: Typo Check (Simplified Design) */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-foreground flex items-center gap-2">
                                    <span className="text-xl">🤔</span> 아이디가 정확한가요?
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    입력하신 GitHub Username에 오타가 없는지 다시 한번 확인해 주세요.
                                </p>
                            </div>

                            {/* [FIX] 구분선(---OR---) 제거하고 간격(space-y-6)으로 자연스럽게 분리 */}

                            {/* Case 2: New User Registration (Main CTA) */}
                            <div className="bg-secondary/20 p-5 rounded-2xl border border-secondary space-y-4">
                                <div>
                                    <h3 className="font-bold text-foreground flex items-center gap-2">
                                        <span className="text-xl">🚀</span> 아직 등록되지 않았나요?
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        Git Ranker는 등록된 사용자만 분석합니다.
                                        <br/>지금 바로 등록하고 내 티어를 확인하세요!
                                    </p>
                                </div>

                                <Button
                                    onClick={handleGithubRegister}
                                    size="lg"
                                    className="w-full h-14 text-base font-bold shadow-md bg-[#24292F] hover:bg-[#24292F]/90 text-white dark:bg-white dark:text-[#24292F] dark:hover:bg-gray-100 transition-all active:scale-[0.98]"
                                >
                                    <Github className="mr-2 h-5 w-5 fill-current" />
                                    @{username} 계정으로 등록하기
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter className="justify-center pt-2 pb-8">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="text-muted-foreground hover:text-foreground h-auto py-2 px-4"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                홈으로 돌아가기
                            </Button>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        )
    }

    // --- Main Content Render Logic ---

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    const tierColors = {
        'CHALLENGER': 'from-red-500/20 to-orange-500/20 text-red-500 border-red-500/50',
        'MASTER': 'from-purple-600/20 to-pink-600/20 text-purple-600 border-purple-600/50',
        'DIAMOND': 'from-blue-500/20 to-cyan-500/20 text-blue-500 border-blue-500/50',
        'EMERALD': 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/50',
        'PLATINUM': 'from-cyan-500/20 to-sky-500/20 text-cyan-600 border-cyan-500/50',
        'GOLD': 'from-yellow-400/20 to-amber-400/20 text-yellow-600 border-yellow-500/50',
        'SILVER': 'from-slate-300/20 to-gray-300/20 text-slate-500 border-slate-400/50',
        'BRONZE': 'from-orange-700/20 to-red-800/20 text-orange-700 border-orange-700/50',
        'IRON': 'from-stone-500/20 to-neutral-500/20 text-stone-500 border-stone-500/50',
    }[user.tier] || 'from-gray-100 to-gray-200'

    const tierBgClass = {
        'CHALLENGER': 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20',
        'MASTER': 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20',
        'DIAMOND': 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20',
        'EMERALD': 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
        'PLATINUM': 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20',
        'GOLD': 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20',
        'SILVER': 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
        'BRONZE': 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20',
        'IRON': 'bg-gradient-to-br from-stone-50 to-neutral-50 dark:from-stone-950/20 dark:to-neutral-950/20',
    }[user.tier] || 'bg-background'

    return (
        <div className={cn("min-h-screen transition-colors duration-500", tierBgClass)}>
            <motion.div
                className="container py-12 max-w-6xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                            <Avatar className="h-28 w-28 border-4 border-background shadow-2xl ring-4 ring-black/5 dark:ring-white/10">
                                <AvatarImage src={user.profileImage} />
                                <AvatarFallback className="text-4xl font-bold">{user.username[0]}</AvatarFallback>
                            </Avatar>
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl font-extrabold tracking-tight">{user.username}</h1>
                                <span className={cn("px-3 py-1 rounded-full text-xs font-bold border bg-gradient-to-r shadow-sm", tierColors)}>
                  {user.tier}
                </span>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground font-medium text-sm">
                                <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                                    <Github className="h-4 w-4" />
                                    GitHub
                                </a>
                                <span>•</span>
                                <span>Updated {new Date(user.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <Button onClick={handleRefresh} disabled={refreshMutation.isPending} variant="outline" className="flex-1 md:flex-none shadow-sm bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 border-transparent">
                            <RefreshCcw className={cn("mr-2 h-4 w-4", refreshMutation.isPending && "animate-spin")} />
                            갱신
                        </Button>
                        <Button onClick={handleShare} variant="outline" className="flex-1 md:flex-none shadow-sm bg-white/50 hover:bg-white/80 dark:bg-black/20 dark:hover:bg-black/40 border-transparent">
                            <Share2 className="mr-2 h-4 w-4" />
                            공유
                        </Button>
                    </div>
                </motion.div>

                <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">

                    <motion.div variants={itemVariants} className="md:col-span-8 md:row-span-2">
                        <Card className="h-full min-h-[400px]">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Combat Radar
                                </CardTitle>
                                <CardDescription>활동 유형별 전투력 분석</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                <StatsChart user={user} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                        <Card className="h-full flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Total Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-black text-primary tracking-tight">
                                    {user.totalScore.toLocaleString()}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">Points</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-4">
                        <Card className="h-full flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader>
                                <CardTitle className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Global Ranking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent tracking-tight">
                                    Top {displayPercentile.toFixed(1)}%
                                </div>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">#{user.ranking.toLocaleString()} of All Users</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-12">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detailed Activity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ActivityGrid user={user} />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={itemVariants} className="md:col-span-12">
                        <BadgeGenerator nodeId={user.nodeId} />
                    </motion.div>

                </motion.div>
            </motion.div>
        </div>
    )
}