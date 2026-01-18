"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useRankingList } from "../api/ranking-service"
import { Tier, RankingUserInfo } from "@/shared/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { ChevronLeft, ChevronRight, Trophy, Medal } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"
import { Card } from "@/shared/components/card"

const tiers: Tier[] = [
  'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD',
  'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

// ✅ Object lookup for O(1) performance
const TIER_COLOR_STYLES: Record<Tier | string, string> = {
  'CHALLENGER': "bg-red-500/10 text-red-500 border-red-500/20",
  'MASTER': "bg-purple-500/10 text-purple-500 border-purple-500/20",
  'DIAMOND': "bg-blue-500/10 text-blue-500 border-blue-500/20",
  'PLATINUM': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  'EMERALD': "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  'GOLD': "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  'SILVER': "bg-slate-500/10 text-slate-500 border-slate-500/20",
  'BRONZE': "bg-orange-500/10 text-orange-500 border-orange-500/20",
  'IRON': "bg-stone-500/10 text-stone-500 border-stone-500/20",
}

const tierColorClass = (tier: Tier) =>
  TIER_COLOR_STYLES[tier] || TIER_COLOR_STYLES['IRON']

// ✅ Hoisted rank icon renderer
const renderRankIcon = (rank: number) => {
  if (rank === 1) return <div className="relative"><Trophy className="h-6 w-6 text-yellow-500 fill-yellow-500" /><div className="absolute -top-1 -right-1 animate-ping h-2 w-2 rounded-full bg-yellow-400 opacity-75"></div></div>
  if (rank === 2) return <Medal className="h-6 w-6 text-slate-400 fill-slate-400" />
  if (rank === 3) return <Medal className="h-6 w-6 text-amber-700 fill-amber-700" />
  return <span className="font-bold text-muted-foreground w-6 text-center">{rank}</span>
}

export function RankingSection() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [page, setPage] = useState(0)
  const [selectedTier, setSelectedTier] = useState<Tier | 'ALL'>('ALL')
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const { data, isLoading, isError } = useRankingList(
      page,
      selectedTier === 'ALL' ? undefined : selectedTier
  )

  useEffect(() => {
    const userParam = searchParams.get('user')
    if (userParam) {
      setSelectedUsername(userParam)
      setModalOpen(true)
    }
  }, [searchParams])

  const handleTierChange = (value: string) => {
    setSelectedTier(value as Tier | 'ALL')
    setPage(0)
  }

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

  const rankings = data?.rankings || [];
  const pageInfo = data?.pageInfo;

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
              <Trophy className="h-8 w-8 text-yellow-500" />
              Global Ranking
            </h2>
            <p className="text-muted-foreground">전체 개발자들의 실시간 순위입니다.</p>
          </motion.div>
        </div>

        {/* Tier Filter Tabs */}
        <div className="mb-8 flex justify-center overflow-x-auto scrollbar-hide py-2">
          <div className="inline-flex gap-2 rounded-2xl bg-secondary/30 p-1.5 backdrop-blur-sm border border-white/10">
            <button
                onClick={() => handleTierChange('ALL')}
                className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                    selectedTier === 'ALL'
                        ? "bg-background text-foreground shadow-sm ring-1 ring-black/5"
                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                )}
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
                >
                  {tier}
                </button>
            ))}
          </div>
        </div>

        <div className="w-full">
          {/* Mobile View: Card List */}
          <div className="md:hidden space-y-3">
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))
            ) : rankings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-secondary/20 rounded-3xl">
                  랭킹 데이터가 없습니다.
                </div>
            ) : (
                rankings.map((user, index) => (
                    <motion.div
                        key={user.username}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleUserClick(user.username)}
                    >
                      <Card className="flex items-center p-4 gap-4 cursor-pointer active:scale-95 transition-transform border-none bg-secondary/10 hover:bg-secondary/20">
                        <div className="flex-shrink-0 flex flex-col items-center justify-center w-10">
                          {renderRankIcon(user.ranking)}
                        </div>
                        <Avatar className="h-12 w-12 border border-border">
                          <AvatarImage src={user.profileImage} alt={user.username} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-base truncate">{user.username}</span>
                          </div>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-semibold", tierColorClass(user.tier))}>
                      {user.tier}
                    </span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground font-medium uppercase">Score</p>
                          <p className="text-lg font-bold font-mono text-primary">{user.totalScore.toLocaleString()}</p>
                        </div>
                      </Card>
                    </motion.div>
                ))
            )}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block rounded-3xl border bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
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
                    rankings.map((user, index) => (
                        <motion.tr
                            key={user.username}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.03 }}
                            className="border-b transition-colors hover:bg-muted/50 cursor-pointer group"
                            onClick={() => handleUserClick(user.username)}
                        >
                          <td className="p-4 text-center">
                            <div className="flex justify-center items-center">
                              {renderRankIcon(user.ranking)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10 border-2 border-background group-hover:border-primary/20 transition-colors">
                                <AvatarImage src={user.profileImage} alt={user.username} />
                                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-base group-hover:text-primary transition-colors">{user.username}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                        <span className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide transition-transform group-hover:scale-105",
                            tierColorClass(user.tier)
                        )}>
                          {user.tier}
                        </span>
                          </td>
                          <td className="p-4 text-right font-mono font-bold text-lg text-foreground/80 group-hover:text-primary transition-colors">
                            {user.totalScore.toLocaleString()}
                          </td>
                        </motion.tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
              className="rounded-full w-10 h-10 shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-muted-foreground min-w-[3rem] text-center">
          {page + 1} / {pageInfo?.totalPages || 1}
        </span>
          <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => p + 1)}
              disabled={!pageInfo || pageInfo.isLast || isLoading}
              className="rounded-full w-10 h-10 shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

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