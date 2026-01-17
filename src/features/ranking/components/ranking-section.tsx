"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useRankingList } from "../api/ranking-service"
import { Tier } from "@/shared/types/api"
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Skeleton } from "@/shared/components/skeleton"
import { Button } from "@/shared/components/button"
import { ChevronLeft, ChevronRight, Trophy } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const tiers: Tier[] = [
  'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD', 
  'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
]

export function RankingSection() {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [selectedTier, setSelectedTier] = useState<Tier | 'ALL'>('ALL')
  
  const { data, isLoading, isError } = useRankingList(
    page, 
    selectedTier === 'ALL' ? undefined : selectedTier
  )

  const handleTierChange = (value: string) => {
    setSelectedTier(value as Tier | 'ALL')
    setPage(0)
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
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <h2 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Ranking
        </h2>
        
        <Tabs value={selectedTier} onValueChange={handleTierChange} className="w-full md:w-auto">
          <TabsList className="flex w-full overflow-x-auto justify-start md:justify-center">
            <TabsTrigger value="ALL">ALL</TabsTrigger>
            {tiers.map((tier) => (
              <TabsTrigger key={tier} value={tier} className="uppercase">
                {tier}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="rounded-md border bg-card">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50">
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-[80px]">Rank</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground w-[120px]">Tier</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground w-[120px]">Score</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
                    <td className="p-4 flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="p-4"><Skeleton className="h-4 w-16 mx-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                  </tr>
                ))
              ) : rankings.length === 0 ? (
                <tr>
                    <td colSpan={4} className="h-24 text-center text-muted-foreground font-medium">
                        랭킹 데이터가 없습니다.
                    </td>
                </tr>
              ) : (
                rankings.map((user) => (
                  <tr 
                    key={user.username}
                    className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/users/${user.username}`)}
                  >
                    <td className="p-4 text-center font-bold text-base">#{user.ranking}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="border">
                          <AvatarImage src={user.profileImage} alt={user.username} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-foreground/90">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                        <span className={cn(
                            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold transition-shadow",
                            user.tier === 'CHALLENGER' && "bg-red-500 text-white border-transparent shadow-sm",
                            user.tier === 'MASTER' && "bg-purple-600 text-white border-transparent shadow-sm",
                            user.tier === 'DIAMOND' && "bg-blue-600 text-white border-transparent shadow-sm",
                            (user.tier === 'PLATINUM' || user.tier === 'EMERALD') && "bg-emerald-500 text-white border-transparent shadow-sm",
                            user.tier === 'GOLD' && "bg-yellow-500 text-white border-transparent shadow-sm",
                            user.tier === 'SILVER' && "bg-slate-400 text-white border-transparent shadow-sm",
                            user.tier === 'BRONZE' && "bg-orange-700 text-white border-transparent shadow-sm",
                            user.tier === 'IRON' && "bg-slate-100 text-slate-600 border-slate-200"
                        )}>
                            {user.tier}
                        </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-primary">
                        {user.totalScore.toLocaleString()}
                    </td>
                  </tr>
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
    </section>
  )
}