"use client"

// ... (Imports 유지)
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    GitPullRequest,
    GitMerge,
    MessageSquare,
    GitCommit,
    AlertCircle,
    RefreshCcw,
    Github,
    Share2,
    Copy,
    Trophy,
    SearchX,
    HelpCircle,
    ArrowLeft
} from "lucide-react"
import { useUser, useRefreshUser } from "@/features/user/api/user-service"
import { StatsChart } from "@/features/user/components/stats-chart"
import { BadgeGenerator } from "@/features/user/components/badge-generator"
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

// ✅ Hoisted outside component to prevent recreation on every render
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

// ... (StatCard Component도 동일하므로 생략)
function StatCard({
                      label,
                      value,
                      diff,
                      icon,
                      colorClass,
                      colSpan = "col-span-1",
                      delay = 0
                  }: {
    label: string,
    value: number,
    diff: number,
    icon: React.ReactNode,
    colorClass: string,
    colSpan?: string,
    delay?: number
}) {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1200;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(Math.floor(easeOut * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "relative flex flex-col justify-between rounded-[1.5rem] p-5 transition-all duration-300 border border-transparent hover:scale-[1.02] hover:shadow-lg",
                colorClass,
                colSpan
            )}
        >
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-foreground/70 tracking-wide flex items-center gap-2">
                    {label}
                </span>
                <div className="opacity-60">{icon}</div>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-3xl font-extrabold font-mono tabular-nums tracking-tighter text-foreground">
                    {displayValue.toLocaleString()}
                </span>

                {diff !== 0 && (
                    <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-mono",
                        diff > 0
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/20 text-red-600 dark:text-red-400"
                    )}>
                        {diff > 0 ? "+" : ""}{diff.toLocaleString()}
                    </span>
                )}
            </div>
        </motion.div>
    )
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

    // Loading State
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
                            <Github className="mr-2 h-4 w-4" /> 등록하기
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

                <div className="grid lg:grid-cols-12 gap-6 items-start">

                    {/* [Left Column] Profile Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <TiltCard className="rounded-[2.5rem]">
                            {/* [FIX] Card Background Remove & Overflow Control */}
                            <Card className={cn(
                                "relative overflow-hidden rounded-[2.5rem] border-2 shadow-2xl flex flex-col items-center p-8 text-center h-full bg-white/80 dark:bg-black/40 backdrop-blur-xl",
                                style.border,
                                style.shadow
                            )}>
                                {/* Shine Overlay */}
                                {style.overlay && (
                                    <div className={cn(
                                        "absolute inset-0 bg-[length:200%_100%] animate-background-shine opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]", // rounded 추가
                                        style.overlay
                                    )} />
                                )}

                                {/* Avatar */}
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
                                </div>

                                {/* Tier Badge */}
                                <div className={cn(
                                    "flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-extrabold tracking-widest uppercase shadow-md mb-6 hover:scale-105 transition-transform cursor-default z-10",
                                    style.badgeBg
                                )}>
                                    <Trophy className="h-4 w-4 fill-current" />
                                    {user.tier}
                                </div>

                                {/* Rank Info */}
                                <div className="space-y-2 mb-8 w-full z-10">
                                    <div className="flex items-center justify-center gap-2 text-muted-foreground font-medium text-sm">
                                        <span>상위 <span className={cn("font-bold text-foreground/80")}>{displayPercentile.toFixed(2)}%</span></span>
                                        <span className="text-foreground/40 font-bold">·</span>
                                        <span>{user.ranking.toLocaleString()}위</span>
                                    </div>

                                    {/* Total Score with Info Button */}
                                    <div className="flex items-center justify-center gap-3 relative group">
                                        <span className={cn("text-6xl font-black font-mono tracking-tighter tabular-nums", style.text)}>
                                            {user.totalScore.toLocaleString()}
                                        </span>
                                        <button
                                            onClick={() => setScoreInfoOpen(true)}
                                            className="p-1.5 rounded-full hover:bg-muted transition-colors opacity-50 hover:opacity-100 cursor-pointer z-50" // z-index 확실히 부여
                                            aria-label="점수 산정 기준 확인"
                                        >
                                            <HelpCircle className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                    </div>
                                    <div className="text-sm font-bold text-muted-foreground/50 tracking-wider">Total Score</div>
                                </div>

                                {/* Action Buttons */}
                                <div className="w-full space-y-3 mt-auto relative z-20">
                                    <Button
                                        onClick={handleShare}
                                        className="w-full h-12 rounded-2xl text-[15px] font-bold bg-[#191919] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-md active:scale-[0.98] transition-transform cursor-pointer"
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        이미지 공유/저장
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={handleCopyBadge} variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98] cursor-pointer">
                                            <Copy className="mr-2 h-4 w-4" /> 배지 복사
                                        </Button>
                                        <Button asChild variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98] cursor-pointer">
                                            <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                                                <Github className="mr-2 h-4 w-4" /> GitHub
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
                                        className="w-full rounded-2xl border-dashed border-border hover:bg-accent/50 h-11 text-sm font-medium disabled:opacity-50 transition-all active:scale-[0.98] cursor-pointer"
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
                        <Card className="rounded-[2.5rem] shadow-sm border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl p-0 overflow-hidden min-h-[380px]">
                            <CardContent className="p-0 h-full relative">
                                <div className="absolute top-8 left-8 z-10">
                                    <CardTitle className="text-lg font-bold text-foreground/80 flex items-center gap-2">
                                        <Trophy className={cn("h-5 w-5", style.text)} />
                                        Activity Radar
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium mt-1">활동별 가중치 적용 분석</CardDescription>
                                </div>
                                <div className="w-full h-[380px] mt-4">
                                    <StatsChart user={user} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Activity Grid (2x2 + 1 Layout) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <StatCard
                                label="PR Merged"
                                value={user.mergedPrCount}
                                diff={user.diffMergedPrCount}
                                icon={<GitMerge className="h-5 w-5 text-blue-600" />}
                                colorClass="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800"
                                delay={0.1}
                            />
                            <StatCard
                                label="PR Count"
                                value={user.PrCount ?? user.prCount}
                                diff={user.diffPrCount}
                                icon={<GitPullRequest className="h-5 w-5 text-purple-600" />}
                                colorClass="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800"
                                delay={0.2}
                            />
                            <StatCard
                                label="Reviews"
                                value={user.reviewCount}
                                diff={user.diffReviewCount}
                                icon={<MessageSquare className="h-5 w-5 text-teal-600" />}
                                colorClass="bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-800"
                                delay={0.3}
                            />
                            <StatCard
                                label="Issues"
                                value={user.issueCount}
                                diff={user.diffIssueCount}
                                icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
                                colorClass="bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800"
                                delay={0.4}
                            />
                            <StatCard
                                label="Commits"
                                value={user.commitCount}
                                diff={user.diffCommitCount}
                                icon={<GitCommit className="h-5 w-5 text-slate-600" />}
                                colorClass="bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800"
                                colSpan="md:col-span-2"
                                delay={0.5}
                            />
                        </div>

                        {/* Badge Preview (Without Copy Button) */}
                        <div className="mt-2">
                            <BadgeGenerator nodeId={user.nodeId} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Component Injection */}
            <ScoreInfoModal open={scoreInfoOpen} onOpenChange={setScoreInfoOpen} />
        </div>
    )
}