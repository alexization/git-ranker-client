"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useRankingList } from "../api/ranking-service"
import { Tier } from "@/shared/types/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { UserDetailModal } from "@/features/user/components/user-detail-modal"

const tiers: Tier[] = [
  'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD', 
  'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

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

  // URL에서 user 파라미터 읽기
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
    // URL에 user 파라미터 추가
    const params = new URLSearchParams(searchParams.toString())
    params.set('user', username)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  const handleModalClose = (open: boolean) => {
    setModalOpen(open)
    if (!open) {
      setSelectedUsername(null)
      // URL에서 user 파라미터 제거
      const params = new URLSearchParams(searchParams.toString())
      params.delete('user')
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname
      router.push(newUrl, { scroll: false })
    }
  }

  // 데이터 추출 로직 강화
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
    <section className="container py-12 max-w-5xl">
      {/* Ranking 제목 */}
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-extrabold flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 text-yellow-500" />
          Ranking
        </h2>
      </div>

      {/* 티어 필터 탭 - Ranking 아래 배치 + 수평 스크롤 */}
      <div className="mb-8 flex justify-center overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-2 rounded-2xl bg-secondary/30 p-2 min-w-min">
          <button
            onClick={() => handleTierChange('ALL')}
            className={cn(
              "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0",
              selectedTier === 'ALL'
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            ALL
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => handleTierChange(tier)}
              className={cn(
                "rounded-xl px-5 py-2.5 text-sm font-semibold uppercase transition-all duration-200 whitespace-nowrap flex-shrink-0",
                selectedTier === tier
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border-2 bg-card shadow-sm">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-14 px-6 text-center align-middle font-bold text-base text-muted-foreground w-[100px]">Rank</th>
                <th className="h-14 px-6 text-left align-middle font-bold text-base text-muted-foreground">User</th>
                <th className="h-14 px-6 text-center align-middle font-bold text-base text-muted-foreground w-[140px]">Tier</th>
                <th className="h-14 px-6 text-right align-middle font-bold text-base text-muted-foreground w-[140px]">Score</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><Skeleton className="h-5 w-10 mx-auto" /></td>
                    <td className="p-4 flex items-center gap-3">
                      <Skeleton className="h-11 w-11 rounded-full" />
                      <Skeleton className="h-5 w-28" />
                    </td>
                    <td className="p-4"><Skeleton className="h-5 w-20 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-5 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : rankings.length === 0 ? (
                <tr>
                    <td colSpan={4} className="h-32 text-center text-muted-foreground font-semibold text-base">
                        랭킹 데이터가 없습니다.
                    </td>
                </tr>
              ) : (
                rankings.map((user, index) => (
                  <motion.tr
                    key={user.username}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer group"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <td className="p-5 text-center font-extrabold text-xl group-hover:text-primary transition-colors">#{user.ranking}</td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 border-2 ring-2 ring-background">
                          <AvatarImage src={user.profileImage} alt={user.username} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-base text-foreground">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-5 text-center">
                        <span className={cn(
                            "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-bold uppercase tracking-wide transition-all group-hover:scale-105",
                            user.tier === 'CHALLENGER' && "bg-red-500 text-white border-transparent shadow-md shadow-red-500/30",
                            user.tier === 'MASTER' && "bg-purple-600 text-white border-transparent shadow-md shadow-purple-600/30",
                            user.tier === 'DIAMOND' && "bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30",
                            (user.tier === 'PLATINUM' || user.tier === 'EMERALD') && "bg-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/30",
                            user.tier === 'GOLD' && "bg-yellow-500 text-white border-transparent shadow-md shadow-yellow-500/30",
                            user.tier === 'SILVER' && "bg-slate-400 text-white border-transparent shadow-md shadow-slate-400/30",
                            user.tier === 'BRONZE' && "bg-orange-700 text-white border-transparent shadow-md shadow-orange-700/30",
                            user.tier === 'IRON' && "bg-slate-200 text-slate-700 border-slate-300 shadow-md shadow-slate-200/30"
                        )}>
                            {user.tier}
                        </span>
                    </td>
                    <td className="p-5 text-right font-mono font-extrabold text-lg text-primary">
                        {user.totalScore.toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <div className="px-4 py-2 text-sm font-semibold bg-muted rounded-md min-w-[4rem] text-center">
            {page + 1} / {pageInfo?.totalPages || 1}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => p + 1)}
          disabled={!pageInfo || pageInfo.isLast || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* 사용자 상세 모달 */}
      <UserDetailModal
        username={selectedUsername}
        open={modalOpen}
        onOpenChange={handleModalClose}
      />
    </section>
  )
}