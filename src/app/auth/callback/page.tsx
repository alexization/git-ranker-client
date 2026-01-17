"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { apiClient } from "@/shared/lib/api-client"
import { getUser } from "@/features/user/api/user-service"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

function RedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")

    if (accessToken) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
      
      try {
        const decoded = jwtDecode<JwtPayload>(accessToken)
        const username = decoded.sub

        getUser(username).then((user) => {
          login(user, accessToken) // 토큰도 함께 저장
          toast.success(`환영합니다, ${user.username}님!`)
          router.replace("/")
        }).catch((err) => {
          console.error("Failed to fetch user info", err)
          toast.error("사용자 정보를 불러오는데 실패했습니다.")
          router.replace("/login")
        })

      } catch (e) {
        console.error("Invalid Token", e)
        toast.error("로그인 토큰이 올바르지 않습니다.")
        router.replace("/login")
      }
    } else {
      router.replace("/login")
    }
  }, [searchParams, router, login])

  return (
    <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-lg font-medium text-muted-foreground">로그인 처리 중입니다...</p>
    </div>
  )
}

export default function OAuth2RedirectPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <Suspense fallback={<p>Loading...</p>}>
        <RedirectHandler />
      </Suspense>
    </div>
  )
}