"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { apiClient } from "@/shared/lib/api-client"
import { getUser } from "@/features/user/api/user-service"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, login, logout } = useAuthStore()
  const hasVerifiedRef = useRef(false)

  useEffect(() => {
    if (hasVerifiedRef.current || !isAuthenticated || !user) {
      return
    }
    hasVerifiedRef.current = true

    const verifyAuth = async () => {
      try {
        // /auth/me로 쿠키 유효성 확인 후 전체 사용자 정보 조회
        const me = await apiClient.get<void, { username: string }>('/auth/me')
        const freshUser = await getUser(me.username)
        login(freshUser)
      } catch {
        if (process.env.NODE_ENV === "development") {
          console.log("[AuthProvider] Auth verification failed, logging out")
        }
        logout()
      }
    }

    verifyAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  return <>{children}</>
}
