"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { apiClient } from "@/shared/lib/api-client"
import { RegisterUserResponse } from "@/shared/types/api"

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
        const freshUser = await apiClient.get<void, RegisterUserResponse>(`/users/${user.username}`)
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
