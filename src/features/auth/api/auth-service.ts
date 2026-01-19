import { apiClient } from "@/shared/lib/api-client"
import { useMutation } from "@tanstack/react-query"
import { useAuthStore } from "../store/auth-store"

export const logoutFromServer = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
}

export const logoutAllFromServer = async (): Promise<void> => {
  await apiClient.post('/auth/logout/all')
}

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: logoutFromServer,
    onSuccess: () => {
      logout()
    },
    onError: () => {
      // 서버 로그아웃 실패해도 클라이언트 상태는 초기화
      logout()
    },
  })
}

export const useLogoutAll = () => {
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: logoutAllFromServer,
    onSuccess: () => {
      logout()
    },
    onError: () => {
      logout()
    },
  })
}
