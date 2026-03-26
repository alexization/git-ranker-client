"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    RefreshCcw,
    Share2,
    Copy,
    Sparkles,
    UserX,
    HelpCircle,
    ArrowLeft,
    Zap
} from "lucide-react"
import { GithubIcon } from "@/shared/components/icons/github-icon"
import { useUser, useRefreshUser } from "@/features/user/api/user-service"
import { StatsChart } from "@/features/user/components/stats-chart"
import { ActivityGrid } from "@/features/user/components/activity-grid"
import { ScoreInfoModal } from "@/features/user/components/score-info-modal"
import { BadgeGenerator } from "@/features/user/components/badge-generator"
import { TiltCard } from "@/shared/components/ui/tilt-card"
import { OptimizedAvatar } from "@/shared/components/optimized-avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { Card, CardContent, CardTitle, CardDescription } from "@/shared/components/card"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { getErrorMessage } from "@/shared/lib/api-client"
import { useEffect, useState } from "react"
import { TIER_STYLES } from "@/shared/constants/tier-styles"
import { useI18n } from "@/shared/providers/locale-provider"
import { getBadgeImageUrl, githubOAuthStartUrl } from "@/shared/lib/public-env"

interface UserProfileClientProps {
    username: string
}

export function UserProfileClient({ username }: UserProfileClientProps) {
    const { t } = useI18n()
    const router = useRouter()
    const { data: user, isLoading, isError } = useUser(username)
    const refreshMutation = useRefreshUser()

    const [displayPercentile, setDisplayPercentile] = useState(0)
    const [scoreInfoOpen, setScoreInfoOpen] = useState(false)

    useEffect(() => {
        if (user) {
            const timeoutId = window.setTimeout(() => {
                setDisplayPercentile(user.percentile)
            }, 100)

            return () => window.clearTimeout(timeoutId)
        }
    }, [user])

    const COOLDOWN_MINUTES = 5;
    const lastScan = user ? new Date(user.lastFullScanAt).getTime() : 0;
    const nextRefreshTime = lastScan + COOLDOWN_MINUTES * 60 * 1000;
    const now = new Date().getTime();
    const canRefresh = now > nextRefreshTime;

    const getTimeRemaining = () => {
        if (canRefresh) return t("profile.refresh.available-now");
        const diff = nextRefreshTime - now;
        const minutes = Math.floor(diff / 1000 / 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (minutes < 0) return t("profile.refresh.available-soon");
        return t("profile.refresh.available-in", { minutes, seconds });
    }

    const handleRefresh = () => {
        if (!canRefresh) {
            toast.error(t("profile.refresh.retry-after", { time: getTimeRemaining() }));
            return;
        }
        toast.promise(refreshMutation.mutateAsync(username), {
            loading: t("profile.refresh.loading"),
            success: t("profile.refresh.success"),
            error: (err) => getErrorMessage(err, t("profile.refresh.error")),
        })
    }

    const handleCopyBadge = () => {
        if (!user?.nodeId) {
            return
        }

        const badgeUrl = getBadgeImageUrl(user.nodeId)
        const markdown = `[![Git Ranker](${badgeUrl})](https://www.git-ranker.com)`
        navigator.clipboard.writeText(markdown)
        toast.success(t("profile.badge.copied"))
    }

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/users/${username}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${username} - Git Ranker`,
                    url: shareUrl,
                })
            } catch (err) {
                // 사용자가 공유를 취소한 경우 무시
                if ((err as Error).name !== 'AbortError') {
                    navigator.clipboard.writeText(shareUrl)
                    toast.success(t("profile.share.copied"))
                }
            }
        } else {
            navigator.clipboard.writeText(shareUrl)
            toast.success(t("profile.share.copied"))
        }
    }

    const handleGithubRegister = () => {
        window.location.href = githubOAuthStartUrl
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
            <div className="container flex flex-col items-center justify-center py-16 min-h-[70vh] px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <Card className="relative overflow-hidden border border-border/50 bg-card p-8 text-center shadow-2xl rounded-[2rem]">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                            className="relative z-10 mb-6 w-full flex justify-center"
                        >
                            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                <motion.div
                                    initial={{ rotate: 0 }}
                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
                                >
                                    <motion.div
                                        animate={{ y: [0, -3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    >
                                        <UserX className="w-10 h-10 text-orange-500 dark:text-orange-400" />
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.3 }}
                            className="relative z-10 inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-4"
                        >
                            <GithubIcon className="w-4 h-4" />
                            <span className="font-mono font-semibold text-sm">@{username}</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="relative z-10"
                        >
                            <h2 className="text-xl font-bold mb-3 text-foreground">
                                {t("profile.not-found.title")}
                            </h2>
                            <p className="text-muted-foreground text-[15px] leading-relaxed mb-8">
                                {t("profile.not-found.description.line1")}<br/>
                                {t("profile.not-found.description.line2")}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.4 }}
                            className="relative z-10 flex flex-col gap-3"
                        >
                            <Button
                                onClick={handleGithubRegister}
                                className="w-full h-12 rounded-2xl font-semibold bg-[#24292F] hover:bg-[#24292F]/90 text-white dark:bg-white dark:text-[#24292F] dark:hover:bg-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
                            >
                                <GithubIcon className="mr-2 h-5 w-5" />
                                {t("profile.not-found.register")}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/')}
                                className="w-full h-11 rounded-2xl font-medium text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-[0.98] transition-all duration-200"
                            >
                                {t("profile.not-found.go-home")}
                            </Button>
                        </motion.div>
                    </Card>
                </motion.div>
            </div>
        )
    }

    const style = TIER_STYLES[user.tier] || TIER_STYLES.IRON

    return (
        <div className={cn("min-h-screen bg-background pb-20 transition-colors duration-700", style.bgGradient)}>
            <div className="container py-12 max-w-6xl px-4">

                <div className="mb-6 lg:hidden">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2 text-muted-foreground hover:text-foreground pl-0">
                        <ArrowLeft className="h-4 w-4" /> {t("profile.back")}
                    </Button>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 items-start">

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

                                <div className="relative mb-5 group cursor-default z-10">
                                    <div className={cn(
                                        "absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500",
                                        style.text.replace('text-', 'bg-')
                                    )} />
                                    <OptimizedAvatar
                                        src={user.profileImage}
                                        alt={t("profile.avatar.alt", { username: user.username })}
                                        size={144}
                                        priority
                                        className={cn(
                                            "border-[5px] shadow-xl z-10 relative bg-background",
                                            style.border
                                        )}
                                        fallback={<span className="text-4xl font-bold">{user.username[0]}</span>}
                                    />
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-0.5 rounded-full text-[10px] font-bold shadow-lg z-20 border border-background whitespace-nowrap">
                                        #{user.ranking}
                                    </div>
                                </div>

                                <h1 className="text-2xl font-bold mb-1 z-10">{user.username}</h1>

                                <div className={cn(
                                    "flex items-center gap-2 px-5 py-1.5 rounded-full text-sm font-extrabold tracking-widest uppercase shadow-md mb-8 hover:scale-105 transition-transform cursor-default z-10 mt-2",
                                    style.badgeBg
                                )}>
                                    <Sparkles className="h-4 w-4" />
                                    {user.tier}
                                </div>

                                <div className="space-y-1 mb-8 w-full z-10 p-4 rounded-2xl bg-secondary/30 border border-white/10 backdrop-blur-sm">
                                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                        Total Score
                                        <button
                                            onClick={() => setScoreInfoOpen(true)}
                                            className="opacity-50 hover:opacity-100 transition-opacity"
                                            aria-label={t("profile.score.info-aria")}
                                        >
                                            <HelpCircle className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div
                                        className={cn("text-5xl font-black font-mono tracking-tighter tabular-nums leading-tight", style.text)}
                                        aria-label={t("profile.score.aria", { score: user.totalScore.toLocaleString() })}
                                    >
                                        {user.totalScore.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-medium pt-1 flex justify-center gap-2">
                                        <span className="text-muted-foreground">{t("profile.percentile.label")}</span>
                                        <span className="text-foreground font-bold" aria-label={t("profile.percentile.aria", { percent: displayPercentile.toFixed(2) })}>
                                            {displayPercentile.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full space-y-3 mt-auto relative z-20">
                                    <Button
                                        onClick={handleShare}
                                        className="w-full h-12 rounded-2xl text-[15px] font-bold bg-[#191919] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-md active:scale-[0.98] transition-transform"
                                    >
                                        <Share2 className="mr-2 h-4 w-4" />
                                        {t("profile.share.button")}
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button onClick={handleCopyBadge} variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98]">
                                            <Copy className="mr-2 h-4 w-4" /> {t("profile.badge.copy-button")}
                                        </Button>
                                        <Button asChild variant="secondary" className="h-11 rounded-2xl font-semibold bg-secondary/80 hover:bg-secondary active:scale-[0.98]">
                                            <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                                                <GithubIcon className="mr-2 h-4 w-4" /> GitHub
                                            </a>
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full mt-6 pt-6 border-t border-border/50 relative z-20">
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={!canRefresh || refreshMutation.isPending}
                                        variant="ghost"
                                        className={cn(
                                            "w-full rounded-2xl h-14 text-sm font-medium transition-all active:scale-[0.98] flex flex-col items-center justify-center gap-0.5 group",
                                            canRefresh
                                                ? "bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20"
                                                : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "transition-transform duration-300",
                                                refreshMutation.isPending && "animate-spin"
                                            )}>
                                                <RefreshCcw className={cn(
                                                    "h-4 w-4 transition-colors",
                                                    canRefresh ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "font-semibold transition-colors",
                                                canRefresh ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                            )}>
                                                {refreshMutation.isPending ? t("profile.refresh.pending") : t("profile.refresh.button")}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-medium flex items-center gap-1.5 transition-colors",
                                            canRefresh ? "text-emerald-600/70 dark:text-emerald-400/70" : "text-muted-foreground/60"
                                        )}>
                                            {canRefresh ? (
                                                <>
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                                    </span>
                                                    {t("profile.refresh.available-now")}
                                                </>
                                            ) : (
                                                getTimeRemaining()
                                            )}
                                        </span>
                                    </Button>
                                </div>
                            </Card>
                        </TiltCard>
                    </div>

                    <div className="lg:col-span-8 flex flex-col gap-6">

                        <Card className="rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl p-0 overflow-hidden min-h-[360px] sm:min-h-[420px]">
                            <CardContent className="p-0 h-full relative">
                                <div className="absolute top-5 left-5 sm:top-8 sm:left-8 z-10 pointer-events-none">
                                    <CardTitle className="text-lg sm:text-xl font-bold text-foreground/80 flex items-center gap-2">
                                        <Zap className={cn("h-4 w-4 sm:h-5 sm:w-5", style.text)} />
                                        Stats Radar
                                    </CardTitle>
                                    <CardDescription className="text-[10px] sm:text-xs font-medium mt-1 ml-6 sm:ml-7">
                                        {t("profile.chart.subtitle")}
                                    </CardDescription>
                                </div>
                                <div className="w-full h-[360px] sm:h-[420px]">
                                    <StatsChart user={user} />
                                </div>
                            </CardContent>
                        </Card>

                        <ActivityGrid user={user} />

                        <BadgeGenerator nodeId={user.nodeId} username={user.username} />
                    </div>
                </div>
            </div>

            <ScoreInfoModal open={scoreInfoOpen} onOpenChange={setScoreInfoOpen} />
        </div>
    )
}
