import { cache } from "react"
import { apiClient } from "@/shared/lib/api-client"
import { RankingListResponse, Tier } from "@/shared/types/api"
import { useQuery } from "@tanstack/react-query"

// Server-side: React.cache() for per-request deduplication
export const getRankingList = cache(async (page: number, tier?: Tier): Promise<RankingListResponse> => {
  const params = new URLSearchParams()
  params.append("page", page.toString())
  if (tier) {
    params.append("tier", tier)
  }

  return apiClient.get<any, RankingListResponse>(`/ranking?${params.toString()}`)
})

export const useRankingList = (page: number, tier?: Tier) => {
  return useQuery({
    queryKey: ['ranking', page, tier],
    queryFn: () => getRankingList(page, tier),
    placeholderData: (previousData) => previousData,
  })
}