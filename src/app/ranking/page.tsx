"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useRankingList } from "@/features/ranking/api/ranking-service"
import { Tier, RankingUserInfo } from "@/shared/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { Card } from "@/shared/components/card"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"
import {
    ChevronLeft,
    ChevronRight,
    Trophy,
    Medal,
    Crown,
    Search,
    TrendingUp,
    GitCommit,
    GitPullRequest
} from "lucide-react"
import { cn } from "@/shared/lib/utils"

const tiers: Tier[] = [
    'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD',
    'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

// --- Components ---

// 1. Podium Component (1, 2, 3위 시각화)
function RankingPodium({ top3, onUserClick }: { top3: RankingUserInfo[], onUserClick: (username: string) => void }) {
    if (top3.length < 3) return null;

    const [first, second, third] = [top3[0], top3[1], top3[2]];

    return (
        <div className="flex justify-center items-end gap-4 mb-16 pt-10 px-4">
            {/* 2nd Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onUserClick(second.username)}
            >
                <div className="relative">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-slate-300 shadow-xl ring-4 ring-slate-300/20 group-hover:scale-105 transition-transform">
                        <AvatarImage src={second.profileImage} />
                        <AvatarFallback>{second.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-slate-500">
                        #2
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="font-bold text-lg md:text-xl text-foreground/90">{second.username}</p>
                    <p className="font-mono text-sm font-semibold text-slate-500">{second.totalScore.toLocaleString()} pts</p>
                </div>
                <div className="mt-2 h-24 w-20 md:w-28 bg-gradient-to-t from-slate-300/20 to-transparent rounded-t-lg border-x border-t border-slate-300/30" />
            </motion.div>

            {/* 1st Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center cursor-pointer group z-10 -mx-2"
                onClick={() => onUserClick(first.username)}
            >
                <div className="relative">
                    <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 h-8 w-8 text-yellow-500 fill-yellow-500 animate-bounce" />
                    <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-yellow-400 shadow-2xl ring-4 ring-yellow-400/20 group-hover:scale-105 transition-transform">
                        <AvatarImage src={first.profileImage} />
                        <AvatarFallback>{first.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-600 text-white text-sm font-bold px-3 py-0.5 rounded-full shadow-lg border border-yellow-400">
                        #1
                    </div>
                </div>
                <div className="mt-5 text-center">
                    <p className="font-bold text-xl md:text-2xl text-foreground">{first.username}</p>
                    <p className="font-mono text-base font-extrabold text-yellow-600 dark:text-yellow-400">{first.totalScore.toLocaleString()} pts</p>
                </div>
                <div className="mt-2 h-32 w-24 md:w-36 bg-gradient-to-t from-yellow-400/20 to-transparent rounded-t-lg border-x border-t border-yellow-400/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shine_3s_infinite]" />
                </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center cursor-pointer group"
                onClick={() => onUserClick(third.username)}
            >
                <div className="relative">
                    <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-amber-600 shadow-xl ring-4 ring-amber-600/20 group-hover:scale-105 transition-transform">
                        <AvatarImage src={third.profileImage} />
                        <AvatarFallback>{third.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg border border-amber-600">
                        #3
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="font-bold text-lg md:text-xl text-foreground/90">{third.username}</p>
                    <p className="font-mono text-sm font-semibold text-amber-700">{third.totalScore.toLocaleString()} pts</p>
                </div>
                <div className="mt-2 h-16 w-20 md:w-28 bg-gradient-to-t from-amber-600/20 to-transparent rounded-t-lg border-x border-t border-amber-600/30" />
            </motion.div>
        </div>
    )
}

// 2. Ranking List Item (Desktop & Mobile Hybrid)
function RankingItem({ user, rank, onClick }: { user: RankingUserInfo, rank: number, onClick: () => void }) {
    const getRankStyle = (r: number) => {
        if (r === 1) return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
        if (r === 2) return "text-slate-400 bg-slate-400/10 border-slate-400/20"
        if (r === 3) return "text-amber-600 bg-amber-600/10 border-amber-600/20"
        return "text-muted-foreground bg-secondary/30 border-transparent"
    }

    const tierColors = {
        'CHALLENGER': 'text-red-500 bg-red-500/10 border-red-500/20',
        'MASTER': 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        'DIAMOND': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        'EMERALD': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        'PLATINUM': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
        'GOLD': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
        'SILVER': 'text-slate-400 bg-slate-400/10 border-slate-400/20',
        'BRONZE': 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        'IRON': 'text-stone-500 bg-stone-500/10 border-stone-500/20',
    }[user.tier]

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/80 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer"
            onClick={onClick}
        >
            {/* Rank */}
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border font-bold text-lg", getRankStyle(rank))}>
                {rank}
            </div>

            {/* User Info */}
            <div className="flex flex-1 items-center gap-4 overflow-hidden">
                <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-border/50 group-hover:ring-primary/20 transition-all">
                    <AvatarImage src={user.profileImage} />
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg truncate group-hover:text-primary transition-colors">{user.username}</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-wide hidden sm:inline-flex", tierColors)}>
              {user.tier}
            </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className={cn("inline-flex sm:hidden font-semibold", tierColors.split(' ')[0])}>{user.tier}</span>
                        <span className="flex items-center gap-1"><GitCommit className="h-3 w-3" /> Dev</span>
                        <span className="hidden sm:flex items-center gap-1"><GitPullRequest className="h-3 w-3" /> Contributor</span>
                    </div>
                </div>
            </div>

            {/* Score */}
            <div className="text-right">
                <div className="font-mono font-black text-xl text-primary/90">{user.totalScore.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground font-medium">Points</div>
            </div>

            {/* Hover Decoration */}
            <div className="absolute right-0 top-0 h-full w-1 bg-primary/0 group-hover:bg-primary transition-colors rounded-r-2xl" />
        </motion.div>
    )
}

// --- Main Page Component ---

export default function RankingPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [page, setPage] = useState(0)
    const [selectedTier, setSelectedTier] = useState<Tier | 'ALL'>('ALL')
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    // URL에서 초기 상태 로드
    useEffect(() => {
        const userParam = searchParams.get('user')
        if (userParam) {
            setSelectedUsername(userParam)
            setModalOpen(true)
        }
    }, [searchParams])

    const { data, isLoading, isError } = useRankingList(
        page,
        selectedTier === 'ALL' ? undefined : selectedTier
    )

    const rankings = data?.rankings || [];
    const pageInfo = data?.pageInfo;

    // Podium용 데이터 분리 (전체 랭킹 1페이지일 때만 표시)
    const showPodium = selectedTier === 'ALL' && page === 0 && rankings.length >= 3;
    const podiumData = showPodium ? rankings.slice(0, 3) : [];
    const listData = showPodium ? rankings.slice(3) : rankings;
    const startRank = showPodium ? 4 : (page * 20) + 1; // 20 is default page size assumed

    const handleUserClick = (username: string) => {
        setSelectedUsername(username)
        setModalOpen(true)
        const params = new URLSearchParams(searchParams.toString())
        params.set('user', username)
        router.push(`?${params.toString()}`, { scroll: false })
    }

    const handleModalClose = (open: boolean) => {
        setModalOpen(open)
        if (!open) {
            setSelectedUsername(null)
            const params = new URLSearchParams(searchParams.toString())
            params.delete('user')
            const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
            router.push(newUrl, { scroll: false })
        }
    }

    const handleTierChange = (tier: string) => {
        setSelectedTier(tier as Tier | 'ALL')
        setPage(0)
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Background Decoration */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10" />

            <main className="container max-w-4xl px-4 pt-12 md:pt-20">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 border border-secondary text-xs font-semibold text-muted-foreground mb-4"
                    >
                        <Trophy className="h-3 w-3" />
                        <span>Leaderboard</span>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
                    >
                        Hall of Fame
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground max-w-lg mx-auto"
                    >
                        끊임없는 기여와 열정으로 오픈소스 생태계를 이끄는<br className="hidden sm:block" />
                        최고의 개발자들을 만나보세요.
                    </motion.p>
                </div>

                {/* Podium (Only visible on ALL Tier & 1st Page) */}
                <AnimatePresence mode="wait">
                    {showPodium && !isLoading && (
                        <RankingPodium top3={podiumData} onUserClick={handleUserClick} />
                    )}
                </AnimatePresence>

                {/* Filters */}
                <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl py-4 -mx-4 px-4 border-b border-border/40 mb-6 transition-all">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">

                        {/* Tier Scroll Area */}
                        <div className="w-full sm:w-auto overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
                            <div className="flex gap-1.5 p-1">
                                <button
                                    onClick={() => handleTierChange('ALL')}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                                        selectedTier === 'ALL'
                                            ? "bg-foreground text-background shadow-md"
                                            : "text-muted-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    ALL
                                </button>
                                {tiers.map((tier) => (
                                    <button
                                        key={tier}
                                        onClick={() => handleTierChange(tier)}
                                        className={cn(
                                            "px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                                            selectedTier === tier
                                                ? "bg-secondary text-foreground border-primary/30 shadow-sm"
                                                : "border-transparent text-muted-foreground hover:bg-secondary/30"
                                        )}
                                    >
                                        {tier}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Trigger (Mock) */}
                        <div className="hidden sm:block">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search user..."
                                    className="h-10 w-64 rounded-xl bg-secondary/30 border border-transparent focus:border-primary/30 focus:bg-background focus:ring-2 focus:ring-primary/20 pl-10 pr-4 text-sm transition-all outline-none"
                                    onKeyDown={(e) => {
                                        if(e.key === 'Enter') {
                                            const target = e.currentTarget as HTMLInputElement
                                            if(target.value) handleUserClick(target.value)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Section */}
                <div className="space-y-3 min-h-[500px]">
                    {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/30">
                                <Skeleton className="h-10 w-10 rounded-xl" />
                                <Skeleton className="h-12 w-12 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-8 w-16" />
                            </div>
                        ))
                    ) : isError ? (
                        <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/10">
                            <p className="text-destructive font-medium mb-4">데이터를 불러오는 중 문제가 발생했습니다.</p>
                            <Button onClick={() => window.location.reload()} variant="outline" className="border-destructive/30 hover:bg-destructive/10">
                                다시 시도
                            </Button>
                        </div>
                    ) : listData.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
                            <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground font-medium">해당 조건의 사용자가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {listData.map((user, index) => (
                                <RankingItem
                                    key={user.username}
                                    user={user}
                                    rank={startRank + index}
                                    onClick={() => handleUserClick(user.username)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pageInfo && (
                    <div className="mt-12 flex justify-center items-center gap-6">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setPage(p => Math.max(0, p - 1))
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            disabled={page === 0 || isLoading}
                            className="h-12 w-12 rounded-full hover:bg-secondary hover:text-primary transition-all disabled:opacity-30"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <div className="flex items-baseline gap-1 font-mono">
                            <span className="text-2xl font-bold text-foreground">{page + 1}</span>
                            <span className="text-sm text-muted-foreground font-medium">/ {pageInfo.totalPages}</span>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setPage(p => p + 1)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            disabled={pageInfo.isLast || isLoading}
                            className="h-12 w-12 rounded-full hover:bg-secondary hover:text-primary transition-all disabled:opacity-30"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>
                )}
            </main>

            {/* User Modal */}
            <UserDetailModal
                username={selectedUsername}
                open={modalOpen}
                onOpenChange={handleModalClose}
            />
        </div>
    )
}