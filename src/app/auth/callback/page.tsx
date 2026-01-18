"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { apiClient } from "@/shared/lib/api-client"
import { getUser } from "@/features/user/api/user-service"
import { jwtDecode } from "jwt-decode"
import { toast } from "sonner"
import { Card } from "@/shared/components/card"
import { Skeleton } from "@/shared/components/skeleton"
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface JwtPayload {
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

const LOADING_STEPS = [
  "GitHub 계정을 확인하고 있습니다...",
  "공개 레포지토리 데이터를 수집 중입니다...",
  "커밋, PR, 이슈 활동을 분석 중입니다...",
  "코드 품질과 기여도를 평가하고 있습니다...",
  "개발자 전투력과 티어를 산정 중입니다..."
];

function RedirectHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthStore()

  const [currentStep, setCurrentStep] = useState(0);

  // Fake Progress Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1500); // 1.5초마다 멘트 변경

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")

    if (accessToken) {
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`

      try {
        const decoded = jwtDecode<JwtPayload>(accessToken)
        const username = decoded.sub

        getUser(username).then((user) => {
          login(user, accessToken)
          toast.success(`환영합니다, ${user.username}님!`)
          router.replace(`/users/${user.username}`)
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
      <div className="flex flex-col items-center justify-center w-full max-w-md space-y-8 px-4">
        {/* Loading Card Skeleton */}
        <Card className="w-full relative overflow-hidden rounded-[2.5rem] border-2 bg-white/50 dark:bg-black/20 backdrop-blur-xl p-8 flex flex-col items-center text-center shadow-2xl">

          {/* Avatar Skeleton */}
          <div className="relative mb-6">
            <Skeleton className="h-36 w-36 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin opacity-50" />
            </div>
          </div>

          {/* Tier Badge Skeleton */}
          <Skeleton className="h-8 w-32 rounded-full mb-6" />

          {/* Text Info Skeleton */}
          <div className="space-y-3 w-full flex flex-col items-center mb-8">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Animated Loading Text */}
          <div className="w-full space-y-3 mt-auto pt-6 border-t border-border/50">
            <div className="h-6 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                    key={currentStep}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-medium text-muted-foreground absolute inset-0 w-full"
                >
                  {LOADING_STEPS[currentStep]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${((currentStep + 1) / LOADING_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </Card>
      </div>
  )
}

export default function AuthCallbackPage() {
  return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Suspense fallback={<p>Loading...</p>}>
          <RedirectHandler />
        </Suspense>
      </div>
  )
}