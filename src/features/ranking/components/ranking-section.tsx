"use client"

import { useState, useEffect, useRef, memo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useRankingList } from "../api/ranking-service"
import { usePrefetchUser } from "@/features/user/api/user-service"
import { Tier, RankingUserInfo } from "@/shared/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { Input } from "@/shared/components/input"
import { ChevronLeft, ChevronRight, Crown, Award, Flame, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { validatePageNumber } from "@/shared/lib/validations"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"
import { Card } from "@/shared/components/card"
import { TIER_ORDER, getTierColorClass, getTierDotColor } from "@/shared/constants/tier-styles"

const tiers = TIER_ORDER

const tierColorClass = getTierColorClass
const tierDotColor = getTierDotColor

// ✅ Hoisted rank icon renderer - Modern style icons
const renderRankIcon = (rank: number) => {
  if (rank === 1) return <div className="relative"><Crown className="h-6 w-6 text-yellow-500 fill-yellow-500/30" /><div className="absolute -top-1 -right-1 animate-ping h-2 w-2 rounded-full bg-yellow-400 opacity-75"></div></div>
  if (rank === 2) return <Award className="h-6 w-6 text-slate-400" />
  if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
  return <span className="font-bold text-foreground/70 w-6 text-center">{rank}</span>
}

// ✅ Memoized Mobile Ranking Card - prevents unnecessary re-renders
interface RankingItemProps {
  user: RankingUserInfo
  onUserClick: (username: string) => void
  onPrefetch: (username: string) => void
}

const MobileRankingCard = memo(function MobileRankingCard({ user, onUserClick, onPrefetch }: RankingItemProps) {
  return (
    <motion.div
      onClick={() => onUserClick(user.username)}
      onMouseEnter={() => onPrefetch(user.username)}
      onFocus={() => onPrefetch(user.username)}
      onKeyDown={(e) => e.key === 'Enter' && onUserClick(user.username)}
      className="ranking-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      role="listitem"
      tabIndex={0}
      aria-label={`${user.username}, ${user.tier} 티어, ${user.totalScore.toLocaleString()}점, ${user.ranking}위`}
    >
      <Card className="flex items-center px-3 py-3 gap-3 cursor-pointer transition-all duration-200 border-none bg-secondary/10 hover:bg-secondary/20">
        <div className="flex-shrink-0 w-8 flex items-center justify-center">
          {user.ranking <= 3 ? renderRankIcon(user.ranking) : (
            <span className="text-sm font-bold text-foreground/60">{user.ranking}</span>
          )}
        </div>
        <div className="relative flex-shrink-0">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={user.profileImage} alt={`${user.username}의 프로필 이미지`} />
            <AvatarFallback className="text-sm">{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <motion.div
            className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
              tierDotColor(user.tier)
            )}
            title={user.tier}
            whileHover={{ scale: 1.2 }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm truncate block">{user.username}</span>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-base font-bold font-mono text-foreground">{user.totalScore.toLocaleString()}</p>
        </div>
      </Card>
    </motion.div>
  )
})

// ✅ Memoized Desktop Ranking Row - with enhanced micro-interactions
const DesktopRankingRow = memo(function DesktopRankingRow({ user, onUserClick, onPrefetch }: RankingItemProps) {
  return (
    <motion.tr
      className="border-b cursor-pointer group ranking-row"
      onClick={() => onUserClick(user.username)}
      onMouseEnter={() => onPrefetch(user.username)}
      onFocus={() => onPrefetch(user.username)}
      onKeyDown={(e) => e.key === 'Enter' && onUserClick(user.username)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{
        backgroundColor: "hsl(var(--muted) / 0.5)",
        scale: 1.005,
        transition: { duration: 0.15 }
      }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
      aria-label={`${user.username}, ${user.tier} 티어, ${user.totalScore.toLocaleString()}점, ${user.ranking}위`}
    >
      <td className="p-4 text-center">
        <div className="flex justify-center items-center">
          {renderRankIcon(user.ranking)}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
            <Avatar className="h-10 w-10 border-2 border-background group-hover:border-primary/20 transition-colors duration-150">
              <AvatarImage src={user.profileImage} alt={`${user.username}의 프로필 이미지`} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </motion.div>
          <span className="font-bold text-base group-hover:text-primary transition-colors duration-150">{user.username}</span>
        </div>
      </td>
      <td className="p-4 text-center">
        <motion.span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide",
            tierColorClass(user.tier)
          )}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {user.tier}
        </motion.span>
      </td>
      <td className="p-4 text-right font-mono font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-150">
        {user.totalScore.toLocaleString()}
      </td>
    </motion.tr>
  )
})

export function RankingSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(0)
  const [pageInput, setPageInput] = useState("")
  const [selectedTier, setSelectedTier] = useState<Tier | 'ALL'>('ALL')
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Prefetch user data on hover/focus for faster modal opening
  const prefetchUser = usePrefetchUser()

  const { data, isLoading, isError } = useRankingList(
      page,
      selectedTier === 'ALL' ? undefined : selectedTier
  )

  const rankings = data?.rankings || [];
  const pageInfo = data?.pageInfo;
  const totalPages = pageInfo?.totalPages || 1;

  useEffect(() => {
    const userParam = searchParams.get('user')
    if (userParam) {
      setSelectedUsername(userParam)
      setModalOpen(true)
    }
  }, [searchParams])

  // ✅ Scroll to list top when page changes
  const scrollToList = () => {
    if (listRef.current) {
      const offset = 100; // Header height consideration
      const top = listRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(0, Math.min(newPage, totalPages - 1));
    setPage(validPage);
    setPageInput("");
    scrollToList();
  }

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputPage = parseInt(pageInput, 10);

    // Validate page number
    const validation = validatePageNumber(inputPage - 1); // Convert to 0-indexed
    if (!validation.success || isNaN(inputPage) || inputPage < 1 || inputPage > totalPages) {
      setPageInput("");
      return;
    }

    handlePageChange(inputPage - 1);
    setPageInput("");
  }

  const handleTierChange = (value: string) => {
    setSelectedTier(value as Tier | 'ALL')
    setPage(0)
    setPageInput("")
  }

  // ✅ Memoized callback for child components
  const handleUserClick = useCallback((username: string) => {
    setSelectedUsername(username)
    setModalOpen(true)
    const params = new URLSearchParams(searchParams.toString())
    params.set('user', username)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

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

  if (isError) {
    return (
        <section className="container py-12 text-center text-muted-foreground">
          <p>랭킹 데이터를 불러오는데 실패했습니다.</p>
          <Button onClick={() => window.location.reload()} variant="link">새로고침</Button>
        </section>
    )
  }

  return (
      <section className="container py-12 max-w-5xl" id="ranking">
        <div className="mb-10 text-center">
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-extrabold flex items-center justify-center gap-3 mb-2">
              <Flame className="h-8 w-8 text-orange-500" />
              Global Ranking
            </h2>
            <p className="text-muted-foreground">전체 개발자들의 실시간 순위입니다.</p>
          </motion.div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="mb-8 flex justify-center overflow-x-auto scrollbar-hide py-2">
          <div
              className="inline-flex gap-2 rounded-2xl bg-secondary/30 p-1.5 backdrop-blur-sm border border-white/10"
              role="tablist"
              aria-label="티어별 필터"
          >
            <button
                onClick={() => handleTierChange('ALL')}
                className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                    selectedTier === 'ALL'
                        ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
                role="tab"
                aria-selected={selectedTier === 'ALL'}
                aria-controls="ranking-list"
            >
              ALL
            </button>
            {tiers.map((tier) => (
                <button
                    key={tier}
                    onClick={() => handleTierChange(tier)}
                    className={cn(
                        "rounded-xl px-4 py-2 text-sm font-semibold uppercase transition-all duration-200 whitespace-nowrap",
                        selectedTier === tier
                            ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                    )}
                    role="tab"
                    aria-selected={selectedTier === tier}
                    aria-controls="ranking-list"
                >
                  {tier}
                </button>
            ))}
          </div>
        </div>

        {/* Page Info Header - Shows current page status */}
        {totalPages > 1 && !isLoading && rankings.length > 0 && (
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-sm text-muted-foreground">
              총 <span className="font-semibold text-foreground">{pageInfo?.totalElements?.toLocaleString() || 0}</span>명
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{page + 1}</span> / {totalPages} 페이지
            </p>
          </div>
        )}

        <div className="w-full" ref={listRef} id="ranking-list" role="tabpanel" aria-label="랭킹 목록">
          {/* Mobile View: Card List - Optimized for narrow screens */}
          <div className="md:hidden space-y-2" role="list" aria-label="랭킹 목록 (모바일)">
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-[72px] w-full rounded-2xl" />
                ))
            ) : rankings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-3xl">
                  랭킹 데이터가 없습니다.
                </div>
            ) : (
                rankings.map((user) => (
                    <MobileRankingCard
                        key={user.username}
                        user={user}
                        onUserClick={handleUserClick}
                        onPrefetch={prefetchUser}
                    />
                ))
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block rounded-3xl border bg-card/80 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm" aria-label="개발자 랭킹 테이블">
                <thead>
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-14 px-6 text-center align-middle font-semibold text-muted-foreground w-[100px]">Rank</th>
                  <th className="h-14 px-6 text-left align-middle font-semibold text-muted-foreground">User</th>
                  <th className="h-14 px-6 text-center align-middle font-semibold text-muted-foreground w-[150px]">Tier</th>
                  <th className="h-14 px-6 text-right align-middle font-semibold text-muted-foreground w-[150px]">Total Score</th>
                </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-4"><Skeleton className="h-6 w-8 mx-auto" /></td>
                          <td className="p-4 flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-5 w-32" />
                          </td>
                          <td className="p-4"><Skeleton className="h-6 w-20 mx-auto" /></td>
                          <td className="p-4"><Skeleton className="h-6 w-24 ml-auto" /></td>
                        </tr>
                    ))
                ) : rankings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="h-40 text-center text-muted-foreground text-lg">
                        랭킹 데이터가 없습니다.
                      </td>
                    </tr>
                ) : (
                    rankings.map((user) => (
                        <DesktopRankingRow
                            key={user.username}
                            user={user}
                            onUserClick={handleUserClick}
                            onPrefetch={prefetchUser}
                        />
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination - Toss Style */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {/* First Page */}
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0 || isLoading}
                  className="rounded-xl w-9 h-9 text-muted-foreground hover:text-foreground disabled:opacity-30"
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
                  className="rounded-xl w-9 h-9 shadow-sm disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Info with Input */}
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2 px-2">
                <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder={String(page + 1)}
                    className="w-12 h-9 text-center font-semibold rounded-xl border-border/50 focus:border-primary text-sm"
                    disabled={isLoading}
                />
                <span className="text-sm text-muted-foreground font-medium">/</span>
                <span className="text-sm font-semibold text-foreground min-w-[2rem]">{totalPages}</span>
              </form>

              {/* Next Page */}
              <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1 || isLoading}
                  className="rounded-xl w-9 h-9 shadow-sm disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              {/* Last Page */}
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page >= totalPages - 1 || isLoading}
                  className="rounded-xl w-9 h-9 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  title="마지막 페이지"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ✅ Conditional rendering: only render modal when open to reduce DOM nodes */}
        {modalOpen && (
            <UserDetailModal
                username={selectedUsername}
                open={modalOpen}
                onOpenChange={handleModalClose}
            />
        )}
      </section>
  )
}