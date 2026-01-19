"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Search, ArrowLeft } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card } from "@/shared/components/card"
import Link from "next/link"

export default function NotFoundPage() {
  const router = useRouter()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-border bg-white/50 dark:bg-black/20 backdrop-blur-xl p-10 text-center shadow-2xl">
          {/* 404 Number with Gradient */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="text-[120px] font-black leading-none tracking-tighter bg-gradient-to-br from-primary via-primary/60 to-primary/20 bg-clip-text text-transparent select-none">
              404
            </span>
          </motion.div>

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6"
          >
            <Search className="h-10 w-10 text-muted-foreground" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold mb-3 text-foreground">
              페이지를 찾을 수 없습니다
            </h1>
            <p className="text-muted-foreground mb-8 text-[15px] leading-relaxed">
              요청하신 페이지가 존재하지 않거나<br />
              이동되었을 수 있습니다.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="rounded-2xl h-12 px-6 font-medium border-border hover:bg-accent/50 active:scale-[0.98] transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              이전 페이지
            </Button>
            <Button
              asChild
              className="rounded-2xl h-12 px-6 font-medium bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                메인으로 돌아가기
              </Link>
            </Button>
          </motion.div>

          {/* Decorative gradient orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </motion.div>
    </div>
  )
}
