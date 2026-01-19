"use client"

import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    RefreshCcw,
    Share2,
    Copy,
    Trophy,
    SearchX,
    HelpCircle,
    ArrowLeft
} from "lucide-react"
import { GithubIcon } from "@/shared/components/icons/github-icon"
import { useUser, useRefreshUser } from "@/features/user/api/user-service"
import { StatsChart } from "@/features/user/components/stats-chart"
import { BadgeGenerator } from "@/features/user/components/badge-generator"
import { ActivityGrid } from "@/features/user/components/activity-grid"
import { ScoreInfoModal } from "@/features/user/components/score-info-modal"
import { TiltCard } from "@/shared/components/ui/tilt-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/card"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { useEffect, useState } from "react"
import { Tier } from "@/shared/types/api"

// Tier Styles (변동 없음, 그대로 유지)
const TIER_STYLES: Record<Tier | string, {
    bgGradient: string;
    border: string;
    text: string;
    badgeBg: string;
    shadow: string;
    iconColor: string;
    overlay?: string;
}> = {
    CHALLENGER: {
        bgGradient: "from-red-500/10 via-orange-500/5 to-background",
        border: "border-red-500/30",
        text: "text-red-500",
        badgeBg: "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-red-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]",
        iconColor: "text-red-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(239,68,68,0.1)_50%,transparent_75%)]"
    },
    MASTER: {
        bgGradient: "from-purple-600/10 via-pink-600/5 to-background",
        border: "border-purple-500/30",
        text: "text-purple-500",
        badgeBg: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)]",
        iconColor: "text-purple-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(168,85,247,0.1)_50%,transparent_75%)]"
    },
    DIAMOND: {
        bgGradient: "from-blue-500/10 via-cyan-500/5 to-background",
        border: "border-blue-500/30",
        text: "text-blue-500",
        badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]",
        iconColor: "text-blue-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(59,130,246,0.1)_50%,transparent_75%)]"
    },
    EMERALD: {
        bgGradient: "from-emerald-500/10 via-teal-500/5 to-background",
        border: "border-emerald-500/30",
        text: "text-emerald-500",
        badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
        iconColor: "text-emerald-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(16,185,129,0.1)_50%,transparent_75%)]"
    },
    PLATINUM: {
        bgGradient: "from-cyan-500/10 via-sky-500/5 to-background",
        border: "border-cyan-500/30",
        text: "text-cyan-500",
        badgeBg: "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-cyan-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]",
        iconColor: "text-cyan-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(6,182,212,0.1)_50%,transparent_75%)]"
    },
    GOLD: {
        bgGradient: "from-yellow-400/10 via-amber-400/5 to-background",
        border: "border-yellow-500/30",
        text: "text-yellow-500",
        badgeBg: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]",
        iconColor: "text-yellow-500"
    },
    SILVER: {
        bgGradient: "from-slate-300/10 via-gray-300/5 to-background",
        border: "border-slate-400/30",
        text: "text-slate-500",
        badgeBg: "bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-slate-500/30",
        shadow: "shadow-none",
        iconColor: "text-slate-400"
    },
    BRONZE: {
        bgGradient: "from-orange-700/10 via-amber-900/5 to-background",
        border: "border-orange-700/30",
        text: "text-orange-700",
        badgeBg: "bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-orange-500/30",
        shadow: "shadow-none",
        iconColor: "text-orange-700"
    },
    IRON: {
        bgGradient: "from-stone-500/10 via-neutral-500/5 to-background",
        border: "border-stone-500/30",
        text: "text-stone-500",
        badgeBg: "bg-gradient-to-r from-stone-500 to-neutral-600 text-white shadow-stone-500/30",
        shadow: "shadow-none",
        iconColor: "text-stone-500"
    }
}

export default function UserDetailPage() {
    const router = useRouter()
    const params = useParams()
    const rawUsername = params.username as string
    const username = decodeURIComponent(rawUsername)

    const { data: user, isLoading, isError } = useUser(rawUsername)
    const refreshMutation = useRefreshUser()

    const [displayPercentile, setDisplayPercentile] = useState(0)
    const [scoreInfoOpen, setScoreInfoOpen] = useState(false)

    useEffect(() => {
        if (user) {
            setDisplayPercentile(0)
            setTimeout(() => setDisplayPercentile(user.percentile), 100)
        }
    }, [user])

    const COOLDOWN_MINUTES = 5;
    const lastScan = user ? new Date(user.lastFullScanAt).getTime() : 0;
    const nextRefreshTime = lastScan + COOLDOWN_MINUTES * 60 * 1000;
    const now = new Date().getTime();
    const canRefresh = now > nextRefreshTime;

    const getTimeRemaining = () => {
        if (canRefresh) return "지금 갱신 가능";
        const diff = nextRefreshTime - now;
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (minutes < 0) return "잠시 후 가능";
        return `${minutes}분 ${seconds}초 후 가능`;
    }

    const handleRefresh = () => {
        if (!canRefresh) {
            toast.error(`잠시 후 다시 시도해주세요. (${getTimeRemaining()})`);
            return;
        }
        toast.promise(refreshMutation.mutateAsync(rawUsername), {
            loading: 'GitHub 데이터를 동기화 중입니다...',
            success: '데이터가 갱신되었습니다!',
            error: '데이터 갱신에 실패했습니다.',
        })
    }

    const handleCopyBadge = () => {
        const badgeUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/badges/${user?.nodeId}`
        const markdown = `[![Git Ranker](${badgeUrl})](https://www.git-ranker.com)`
        navigator.clipboard.writeText(markdown)
        toast.success("배지 마크다운이 복사되었습니다!")
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `Git Ranker - ${username}`,
                text: `${username}님의 개발자 전투력: ${user?.tier} (${user?.totalScore}점)`,
                url: window.location.href,
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("프로필 링크가 복사되었습니다!")
        }
    }

    const handleGithubRegister = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`
    }

    if (isLoading) {
        return (
            <div className="container py-12 max-w-6xl space-y-6">
                <div className="grid lg:grid-cols-12 gap-6">
                    <Skeleton className="lg:col-span-4 h-[600px] rounded-[2rem]" />
                    <div className="lg:col-span-8 space-y-6">
                        <Skeleton className="h-[400px] rounded-[2rem]" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-32 rounded-[1.5rem]" />
                            <Skeleton className="h-32 rounded-[1.5rem]" />
                            <Skeleton className="h-32 rounded-[1.5rem]" />
                            <Skeleton className="h-32 rounded-[1.5rem]" />
                            <Skeleton className="col-span-2 h-32 rounded-[1.5rem]" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !user) {
        return (
            <div className="container flex flex-col items-center justify-center py-20 min-h-[70vh]">
                <Card className="w-full max-w-lg border-2 border-dashed bg-card/50 backdrop-blur-xl p-8 text-center shadow-xl rounded-[2rem]">
                    <div className="mx-auto bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                        <SearchX className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">@{username}</h2>
                    <p className="text-muted-foreground mb-8">
                        사용자를 찾을 수 없습니다.<br/>GitHub 아이디를 확인하거나 새로 등록해 주세요.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push('/')}>홈으로</Button>
                        <Button onClick={handleGithubRegister} className="bg-[#24292F] text-white hover:bg-[#24292F]/90">
                            <GithubIcon className="mr-2 h-4 w-4" /> 등록하기
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    const style = TIER_STYLES[user.tier] || TIER_STYLES.IRON

    return (
        <div className={cn("min-h-screen bg-background pb-20 transition-colors duration-700", style.bgGradient)}>
            <div className="container py-12 max-w-6xl px-4">

                {/* Back Button */}
                <div className="mb-6 lg:hidden">
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="gap-2 text-muted-foreground hover:text-foreground pl-0">
                        <ArrowLeft className="h-4 w-4" /> 뒤로가기
                    </Button>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">

                    {/* [Left Column] Profile Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <TiltCard className="rounded-[2.5rem]">
                            <Card className={cn(
                                "relative overflow-hidden rounded-[2.5rem] border-2 shadow-2xl flex flex-col items-center p-8 text-center h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl",
                                style.border,
                                style.shadow
                            )}>
                                {style.overlay && (
                                    <div className={cn(
                                        "absolute inset-0 bg-[length:200%_100%] animate-background-shine opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]",
                                        style.overlay
                                    )} />
                                )}

                                {/* Avatar Section */}
                                <div className="relative mb-5 group cursor-default z-10">
                                    <div className={cn(
                                        "absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500",
                                        style.text.replace('text-', 'bg-')
                                    )} />
                                    <Avatar className={cn(
                                        "h-36 w-36 border-[5px] shadow-xl z-10 relative bg-background",
                                        style.border
                                    )}>
                                        <AvatarImage src={user.profileImage} className="object-cover" />
                                        <AvatarFallback className="text-4xl font-bold">{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                    {/* [Design] 랭킹 배지 (아바타 하단에 겹치게) */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg z-20 border border-background whitespace-nowrap">
                                        #{user.ranking}
                                    </div>
                                </div>

                                {/* User Info */}
                                <h1 className="text-2xl font-bold mb-1 z-10">{user.username}</h1>

                                {/* Tier Badge */}
                                <div className={cn(
                                    "flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-extrabold tracking-widest uppercase shadow-md mb-8 hover:scale-105 transition-transform cursor-default z-10 mt-2",
                                    style.badgeBg
                                )}>
                                    <Trophy className="h-4 w-4 fill-current" />
                                    {user.tier}
                                </div>

                                {/* [Typography Improvement] Total Score & Percentile */}
                                <div className="space-y-1 mb-8 w-full z-10 p-4 rounded-2xl bg-secondary/30 border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                        Total Score
                                        <button onClick={() => setScoreInfoOpen(true)} className="opacity-50 hover:opacity-100 transition-opacity">
                                            <HelpCircle className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className={cn("text-5xl font-black font-mono tracking-tighter tabular-nums leading-tight", style.text)}>
                                        {user.totalScore.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-medium pt-1 flex justify-center gap-2">
                                        <span className="text-muted-foreground">상위</span>
                                        <span className="text-foreground font-bold">{displayPercentile.toFixed(2)}%</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full space-y-3 mt-auto relative z-20">
                                    <Button
                                        onClick={handleShare}
                                        className="w-full h-12 rounded-2xl text-[15px] font-bold bg-[#191919] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-md active:scale-[0.98] transition-transform"
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        이미지 공유/저장
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={handleCopyBadge} variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98]">
                                            <Copy className="mr-2 h-4 w-4" /> 배지 복사
                                        </Button>
                                        <Button asChild variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98]">
                                            <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                                                <GithubIcon className="mr-2 h-4 w-4" /> GitHub
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                {/* Refresh Section */}
                                <div className="w-full mt-6 pt-6 border-t border-border/50 relative z-20">
                                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-secondary/50 text-[11px] font-medium text-muted-foreground mb-3">
                                        {canRefresh ? "✨ 지금 바로 갱신 가능" : `⏳ ${getTimeRemaining()}`}
                                    </div>
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={!canRefresh || refreshMutation.isPending}
                                        variant="outline"
                                        className="w-full rounded-2xl border-dashed border-border hover:bg-accent/50 h-11 text-sm font-medium disabled:opacity-50 transition-all active:scale-[0.98]"
                                    >
                                        <RefreshCcw className={cn("mr-2 h-4 w-4", refreshMutation.isPending && "animate-spin")} />
                                        {refreshMutation.isPending ? "동기화 중..." : "최신 데이터 불러오기"}
                                    </Button>
                                </div>
                            </Card>
                        </TiltCard>
                    </div>

                    {/* [Right Column] Dashboard */}
                    <div className="lg:col-span-8 flex flex-col gap-6">

                        {/* 1. Radar Chart Section */}
                        <Card className="rounded-[2.5rem] shadow-sm border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl p-0 overflow-hidden min-h-[420px]">
                            <CardContent className="p-0 h-full relative">
                                <div className="absolute top-8 left-8 z-10 pointer-events-none">
                                    <CardTitle className="text-xl font-bold text-foreground/80 flex items-center gap-2">
                                        <Trophy className={cn("h-5 w-5", style.text)} />
                                        Stats Radar
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium mt-1 ml-7">
                                        활동 유형별 기여도 분포
                                    </CardDescription>
                                </div>
                                <div className="w-full h-[420px] mt-4">
                                    <StatsChart user={user} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Activity Grid (New Component Applied) */}
                        <ActivityGrid user={user} />

                        {/* Badge Preview */}
                        <div className="mt-2">
                            <BadgeGenerator nodeId={user.nodeId} />
                        </div>
                    </div>
                </div>
            </div>

            <ScoreInfoModal open={scoreInfoOpen} onOpenChange={setScoreInfoOpen} />
        </div>
    )
}