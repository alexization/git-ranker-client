"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useRankingList } from "@/features/ranking/api/ranking-service"
import { Tier } from "@/shared/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Input } from "@/shared/components/input"

const TIERS: (Tier | 'ALL')[] = [
    'ALL', 'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD',
    'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

// ✅ Object lookup for O(1) performance instead of O(n) switch statement
const TIER_BADGE_STYLES: Record<string, string> = {
    'CHALLENGER': "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    'MASTER': "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
    'DIAMOND': "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
    'EMERALD': "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    'PLATINUM': "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    'GOLD': "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    'SILVER': "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    'BRONZE': "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
    'IRON': "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
}

const getTierBadgeStyle = (tier: string) =>
    TIER_BADGE_STYLES[tier] || TIER_BADGE_STYLES['IRON']

// [Component] Sticky Toolbar
function RankingToolbar({
                            selectedTier,
                            onTierChange,
                            onSearch
                        }: {
    selectedTier: string,
    onTierChange: (t: string) => void,
    onSearch: (q: string) => void
}) {
    return (
        <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 mb-8">
            <div className="container max-w-5xl px-4 flex flex-col md:flex-row gap-4 items-center justify-between">

                {/* Clean Filters */}
                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                    {TIERS.map((tier) => (
                        <button
                            key={tier}
                            onClick={() => onTierChange(tier)}
                            className={cn(
                                "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                                selectedTier === tier
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                            )}
                        >
                            {tier}
                        </button>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-64 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                        placeholder="유저 검색"
                        className="pl-10 h-10 rounded-xl bg-secondary/30 border-transparent focus:bg-background focus:border-border transition-all text-sm"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                onSearch(e.currentTarget.value)
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

function RankingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [page, setPage] = useState(0)
    const [selectedTier, setSelectedTier] = useState<Tier | 'ALL'>('ALL')
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        const userParam = searchParams.get('user')
        if (userParam) {
            setSelectedUsername(userParam)
            setModalOpen(true)
        }
    }, [searchParams])

    const { data, isLoading } = useRankingList(
        page,
        selectedTier === 'ALL' ? undefined : selectedTier
    )

    const rankings = data?.rankings || [];
    const pageInfo = data?.pageInfo;
    const startRank = (page * 20) + 1;

    const handleUserClick = (username: string) => {
        if(!username) return;
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

    return (
        <div className="min-h-screen bg-background pb-20">
            <main className="pt-16">
                {/* Title Section */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
                        <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Leaderboard
                        </span>
                    </h1>
                    <p className="text-muted-foreground font-medium">Top Contributors</p>
                </div>

                <RankingToolbar
                    selectedTier={selectedTier}
                    onTierChange={(tier) => { setSelectedTier(tier as Tier | 'ALL'); setPage(0); }}
                    onSearch={handleUserClick}
                />

                {/* List Container */}
                <div className="container max-w-5xl px-4">
                    {/* Header Row */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 mb-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest select-none">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5 pl-2">User</div>
                        <div className="col-span-3 text-center">Tier</div>
                        <div className="col-span-3 text-right">Score</div>
                    </div>

                    <div className="space-y-1 min-h-[500px]">
                        {isLoading ? (
                            Array.from({ length: 15 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl bg-secondary/20" />
                            ))
                        ) : rankings.length === 0 ? (
                            <div className="py-32 text-center">
                                <Search className="w-10 h-10 mx-auto mb-4 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-medium">검색 결과가 없습니다.</p>
                            </div>
                        ) : (
                            rankings.map((user, index) => {
                                const rank = startRank + index;

                                return (
                                    <motion.div
                                        key={user.username}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                        onClick={() => handleUserClick(user.username)}
                                        className="group grid grid-cols-12 gap-4 items-center p-3 md:px-6 md:py-4 rounded-2xl border border-transparent hover:bg-secondary/30 hover:border-border/50 transition-all cursor-pointer"
                                    >
                                        {/* Rank Number (No Icon) */}
                                        <div className="col-span-2 md:col-span-1 text-center">
                                            <span className="font-mono font-bold text-lg text-muted-foreground group-hover:text-foreground transition-colors">
                                                {rank}
                                            </span>
                                        </div>

                                        {/* User Info */}
                                        <div className="col-span-7 md:col-span-5 flex items-center gap-4 overflow-hidden">
                                            <Avatar className="h-10 w-10 md:h-12 md:w-12 border border-border/50 bg-background">
                                                <AvatarImage src={user.profileImage} />
                                                <AvatarFallback>{user.username[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-base md:text-lg truncate text-foreground">
                                                    {user.username}
                                                </span>
                                                {/* Mobile Tier Badge */}
                                                <span className={cn("md:hidden text-[10px] w-fit px-1.5 py-0.5 rounded font-bold mt-1", getTierBadgeStyle(user.tier))}>
                                                    {user.tier}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Desktop Tier Badge */}
                                        <div className="col-span-3 hidden md:flex justify-center">
                                            <span className={cn("px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest", getTierBadgeStyle(user.tier))}>
                                                {user.tier}
                                            </span>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-3 text-right">
                                            <span className="font-mono font-bold text-lg md:text-xl text-foreground tabular-nums tracking-tight">
                                                {user.totalScore.toLocaleString()}
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>

                    {/* Simple Pagination */}
                    {pageInfo && (
                        <div className="py-16 flex justify-center items-center gap-6">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                disabled={page === 0 || isLoading}
                                className="w-10 h-10 rounded-full hover:bg-secondary"
                            >
                                <ChevronLeft className="h-5 w-5 opacity-60" />
                            </Button>
                            <span className="text-sm font-mono font-bold text-muted-foreground select-none">
                                {page + 1} / {pageInfo.totalPages}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                disabled={pageInfo.isLast || isLoading}
                                className="w-10 h-10 rounded-full hover:bg-secondary"
                            >
                                <ChevronRight className="h-5 w-5 opacity-60" />
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* ✅ Conditional rendering: only render modal when open to reduce DOM nodes */}
            {modalOpen && (
                <UserDetailModal
                    username={selectedUsername}
                    open={modalOpen}
                    onOpenChange={handleModalClose}
                />
            )}
        </div>
    )
}

function RankingPageSkeleton() {
    return (
        <div className="min-h-screen bg-background pb-20 pt-16">
            <div className="container max-w-5xl px-4">
                <div className="text-center mb-10">
                    <Skeleton className="h-16 w-64 mx-auto mb-3" />
                    <Skeleton className="h-6 w-32 mx-auto" />
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function RankingPage() {
    return (
        <Suspense fallback={<RankingPageSkeleton />}>
            <RankingContent />
        </Suspense>
    )
}