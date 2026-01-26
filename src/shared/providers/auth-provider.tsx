"use client"

import { useEffect, useRef } from "react"
import { jwtDecode } from "jwt-decode"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { apiClient } from "@/shared/lib/api-client"
import axios from "axios"

interface JwtPayload {
  sub: string
  role: string
  iat: number
  exp: number
}

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/v1`

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { accessToken, setAccessToken, logout, isAuthenticated } = useAuthStore()
  const isCheckingRef = useRef(false)

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      // 이미 체크 중이거나 토큰이 없으면 스킵
      if (isCheckingRef.current || !accessToken) {
        return
      }

      isCheckingRef.current = true

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken)
        const currentTime = Date.now() / 1000

        // 토큰이 만료되었거나 1분 이내에 만료 예정인 경우
        if (decoded.exp < currentTime + 60) {
          if (process.env.NODE_ENV === "development") {
            console.log("[AuthProvider] Token expired or expiring soon, refreshing...")
          }

          try {
            // refresh 토큰으로 새 access 토큰 획득
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh`,
              {},
              { withCredentials: true }
            )

            if (response.data?.result === "SUCCESS" && response.data?.data?.accessToken) {
              const newAccessToken = response.data.data.accessToken
              setAccessToken(newAccessToken)
              apiClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`
              if (process.env.NODE_ENV === "development") {
                console.log("[AuthProvider] Token refreshed successfully")
              }
            } else {
              throw new Error("Invalid refresh response")
            }
          } catch (refreshError) {
            if (process.env.NODE_ENV === "development") {
              console.error("[AuthProvider] Token refresh failed:", refreshError)
            }
            logout()
          }
        } else {
          // 토큰이 유효하면 axios 헤더 설정 확인
          if (!apiClient.defaults.headers.common["Authorization"]) {
            apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
          }
        }
      } catch (decodeError) {
        console.error("[AuthProvider] Invalid token format:", decodeError)
        logout()
      } finally {
        isCheckingRef.current = false
      }
    }

    checkAndRefreshToken()
  }, [accessToken, setAccessToken, logout, isAuthenticated])

  return <>{children}</>
}
