import { cache } from "react"
import { apiClient } from "@/shared/lib/api-client"
import { RegisterUserResponse } from "@/shared/types/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// Server-side: React.cache() for per-request deduplication
// Multiple components calling getUser() with same username will only make 1 request
export const getUser = cache(async (username: string): Promise<RegisterUserResponse> => {
  return apiClient.get<void, RegisterUserResponse>(`/users/${username}`)
})

export const refreshUser = async (username: string): Promise<RegisterUserResponse> => {
  return apiClient.post<void, RegisterUserResponse>(`/users/${username}/refresh`)
}

export const useUser = (username: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    retry: 1,
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true,
  })
}

export const useRefreshUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (username: string) => refreshUser(username),
    onSuccess: (data, username) => {
      queryClient.setQueryData(['user', username], data)
    },
  })
}

/**
 * Prefetch user data on hover/focus to reduce perceived latency
 * @see Vercel Best Practice: Preload Based on User Intent
 */
export const usePrefetchUser = () => {
  const queryClient = useQueryClient()

  return (username: string) => {
    // Only prefetch if not already in cache
    const cached = queryClient.getQueryData(['user', username])
    if (!cached) {
      queryClient.prefetchQuery({
        queryKey: ['user', username],
        queryFn: () => getUser(username),
        staleTime: 1000 * 60 * 5,
      })
    }
  }
}

/**
 * 회원탈퇴 API mutation
 * DELETE /api/v1/users/me
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await apiClient.delete('/users/me')
    },
    onSuccess: () => {
      // 모든 쿼리 캐시 무효화
      queryClient.clear()
    },
  })
}