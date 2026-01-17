import { apiClient } from "@/shared/lib/api-client"
import { RegisterUserResponse } from "@/shared/types/api"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const getUser = async (username: string): Promise<RegisterUserResponse> => {
  return apiClient.get<any, RegisterUserResponse>(`/users/${username}`)
}

export const refreshUser = async (username: string): Promise<RegisterUserResponse> => {
  return apiClient.post<any, RegisterUserResponse>(`/users/${username}/refresh`)
}

export const useUser = (username: string) => {
  return useQuery({
    queryKey: ['user', username],
    queryFn: () => getUser(username),
    retry: 1,
    staleTime: 1000 * 60 * 5,
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