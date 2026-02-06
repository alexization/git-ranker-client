"use client"

import { useState, useEffect, Suspense, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LazyMotion, domAnimation, m } from "framer-motion"
import { useRankingList } from "@/features/ranking/api/ranking-service"
import { Tier } from "@/shared/types/api"
import { getTierBadgeStyle, getTierDotColor } from "@/shared/constants/tier-styles"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Crown, Award } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const TIERS: (Tier | 'ALL')[] = [
    'ALL', 'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD',
    'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

// [Component] Toolbar
function RankingToolbar({
                            selectedTier,
                            onTierChange,
                        }: {
    selectedTier: string,
    onTierChange: (t: string) => void
}) {
    return (
        <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 py-4 mb-8 transition-all">
            <div className="container max-w-5xl px-4 flex justify-center">
                <div className="flex flex-wrap gap-2 justify-center">
                    {TIERS.map((tier) => (
                        <button
                            key={tier}
                            onClick={() => onTierChange(tier)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border select-none",
                                selectedTier === tier
                                    ? "bg-foreground text-background border-foreground shadow-md transform scale-105"
                                    : "bg-background/50 border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95"
                            )}
                        >
                            {tier}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ✅ 순위 렌더링 - 1~3위는 아이콘, 나머지는 검은 숫자
const renderRankIcon = (rank: number) => {
    if (rank === 1) {
        return (
            <div className="relative">
                <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500/30" />
                <div className="absolute -top-1 -right-1 animate-ping h-2 w-2 rounded-full bg-yellow-400 opacity-75" />
            </div>
        )
    }
    if (rank === 2) return <Award className="h-6 w-6 text-slate-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return (
        <span className="font-mono font-bold text-base text-foreground/70 w-8 text-center">
            {rank}
        </span>
    )
}

function RankingContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [pageInput, setPageInput] = useState("")
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const listRef = useRef<HTMLDivElement>(null)

    // URL search params에서 page, tier 상태를 파생
    const pageParam = searchParams.get('page')
    const page = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0
    const tierParam = searchParams.get('tier')
    const selectedTier: Tier | 'ALL' = tierParam && TIERS.includes(tierParam as Tier) ? tierParam as Tier : 'ALL'

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
    const totalPages = pageInfo?.totalPages || 1;
    const startRank = (page * (pageInfo?.pageSize || 20)) + 1;

    // ✅ 페이지 변경 시 리스트 상단으로 스크롤
    const scrollToList = () => {
        if (listRef.current) {
            const offset = 180;
            const top = listRef.current.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    const updateURL = (newPage: number, newTier: Tier | 'ALL') => {
        const params = new URLSearchParams(searchParams.toString())
        if (newPage > 0) {
            params.set('page', String(newPage + 1))
        } else {
            params.delete('page')
        }
        if (newTier !== 'ALL') {
            params.set('tier', newTier)
        } else {
            params.delete('tier')
        }
        const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
        router.push(newUrl, { scroll: false })
    }

    const handlePageChange = (newPage: number) => {
        const validPage = Math.max(0, Math.min(newPage, totalPages - 1));
        setPageInput("");
        updateURL(validPage, selectedTier);
        scrollToList();
    }

    const handlePageInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const inputPage = parseInt(pageInput, 10);
        if (!isNaN(inputPage) && inputPage >= 1 && inputPage <= totalPages) {
            handlePageChange(inputPage - 1);
        }
        setPageInput("");
    }

    const handleUserClick = (username: string) => {
        if (!username) return;
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
                <div className="text-center mb-10 px-4">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-3">
                        <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
                            Leaderboard
                        </span>
                    </h1>
                    <p className="text-muted-foreground font-medium text-lg">
                        전체 개발자 전투력 랭킹
                    </p>
                </div>

                <RankingToolbar
                    selectedTier={selectedTier}
                    onTierChange={(tier) => { setPageInput(""); updateURL(0, tier as Tier | 'ALL'); }}
                />

                <div className="container max-w-5xl px-4" ref={listRef}>
                    {/* Page Info Header */}
                    {totalPages > 1 && !isLoading && rankings.length > 0 && (
                        <div className="flex items-center justify-between mb-4 px-2">
                            <p className="text-sm text-muted-foreground">
                                총 <span className="font-semibold text-foreground">{pageInfo?.totalElements?.toLocaleString() || 0}</span>명
                            </p>
                            <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">{page + 1}</span> / {totalPages} 페이지
                            </p>
                        </div>
                    )}

                    {/* Header Row - Desktop Only */}
                    <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest select-none bg-secondary/80 dark:bg-secondary/50 border border-border/50 rounded-xl">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5 pl-2">User</div>
                        <div className="col-span-3 text-center">Tier</div>
                        <div className="col-span-3 text-right pr-2">Score</div>
                    </div>

                    <div className="space-y-2 min-h-[500px]">
                        {isLoading ? (
                            Array.from({ length: 15 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 md:h-20 w-full rounded-2xl bg-secondary/20" />
                            ))
                        ) : rankings.length === 0 ? (
                            <div className="py-32 text-center bg-secondary/10 rounded-3xl border border-dashed border-border/50">
                                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-medium text-lg">랭킹 데이터가 없습니다.</p>
                                <p className="text-sm text-muted-foreground/60 mt-1">아직 등록된 유저가 없거나 필터 조건에 맞는 결과가 없습니다.</p>
                            </div>
                        ) : (
                            <LazyMotion features={domAnimation}>
                            {rankings.map((user, index) => {
                                const rank = startRank + index;

                                return (
                                    <m.div
                                        key={user.username}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2, delay: index * 0.02 }}
                                        onClick={() => handleUserClick(user.username)}
                                        className="group grid grid-cols-12 gap-2 md:gap-4 items-center px-3 py-3 md:p-4 rounded-2xl border border-border/40 bg-card shadow-sm hover:bg-accent/50 dark:hover:bg-accent/30 hover:border-border hover:shadow-md hover:shadow-primary/5 transition-all duration-200 cursor-pointer"
                                    >
                                        {/* Rank Number */}
                                        <div className="col-span-2 md:col-span-1 text-center flex justify-center items-center">
                                            {renderRankIcon(rank)}
                                        </div>

                                        {/* User Info - Mobile: Avatar with Tier Dot */}
                                        <div className="col-span-7 md:col-span-5 flex items-center gap-3 md:gap-4 overflow-hidden">
                                            <div className="relative flex-shrink-0">
                                                <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-background shadow-sm group-hover:border-primary/20 transition-colors">
                                                    <AvatarImage src={user.profileImage} />
                                                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                                                </Avatar>
                                                {/* Mobile Tier Dot */}
                                                <div
                                                    className={cn(
                                                        "md:hidden absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
                                                        getTierDotColor(user.tier)
                                                    )}
                                                    title={user.tier}
                                                />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-bold text-sm md:text-lg truncate text-foreground group-hover:text-primary transition-colors">
                                                    {user.username}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Desktop Tier Badge */}
                                        <div className="col-span-3 hidden md:flex justify-center">
                                            <span className={cn("px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest border shadow-sm", getTierBadgeStyle(user.tier))}>
                                                {user.tier}
                                            </span>
                                        </div>

                                        {/* Score */}
                                        <div className="col-span-3 text-right">
                                            <span className="font-mono font-bold text-base md:text-xl text-foreground tabular-nums tracking-tight">
                                                {user.totalScore.toLocaleString()}
                                            </span>
                                        </div>
                                    </m.div>
                                )
                            })}
                            </LazyMotion>
                        )}
                    </div>

                    {/* Pagination - Enhanced (항상 표시) */}
                    {!isLoading && rankings.length > 0 && (
                        <div className="py-12 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2">
                                {/* First Page */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePageChange(0)}
                                    disabled={page === 0 || isLoading}
                                    className="rounded-xl w-10 h-10 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                    title="첫 페이지"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>

                                {/* Previous Page */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0 || isLoading}
                                    className="rounded-xl w-10 h-10 shadow-sm disabled:opacity-30"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                {/* Page Input */}
                                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 px-3">
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ''))}
                                        placeholder={String(page + 1)}
                                        className="w-14 h-10 text-center font-bold rounded-xl border-border/50 focus:border-primary text-sm"
                                        disabled={isLoading}
                                    />
                                    <span className="text-muted-foreground font-medium">/</span>
                                    <span className="font-bold text-foreground min-w-[2rem]">{totalPages}</span>
                                </form>

                                {/* Next Page */}
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages - 1 || isLoading}
                                    className="rounded-xl w-10 h-10 shadow-sm disabled:opacity-30"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>

                                {/* Last Page */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages - 1)}
                                    disabled={page >= totalPages - 1 || isLoading}
                                    className="rounded-xl w-10 h-10 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                    title="마지막 페이지"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

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
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
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