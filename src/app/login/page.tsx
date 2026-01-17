"use client"

import { motion } from "framer-motion"
import { Github, Sparkles } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/card"

export default function LoginPage() {
  const handleGithubLogin = () => {
    // 백엔드 OAuth2 엔드포인트로 이동
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/oauth2/authorization/github`
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      }
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className="h-16 w-16" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-secondary/20"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Github className="h-20 w-20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="w-full max-w-md shadow-2xl border-2">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <CardHeader className="text-center space-y-3">
              <motion.div variants={itemVariants}>
                <CardTitle className="text-3xl font-extrabold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Git Ranker 로그인
                </CardTitle>
              </motion.div>
              <motion.div variants={itemVariants}>
                <CardDescription className="text-base">
                  GitHub 계정으로 간편하게 시작하세요.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-base text-foreground flex items-center gap-2">
                  <span className="text-xl">👋</span> 서비스 소개
                </p>
                <p className="leading-relaxed">
                  Git Ranker는 개발자의 GitHub 활동을 분석하여 전투력을 측정하고,
                  동기 부여를 제공하는 게이미피케이션 서비스입니다.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2 text-sm text-muted-foreground">
                <p className="font-semibold text-base text-foreground flex items-center gap-2">
                  <span className="text-xl">🔒</span> 수집 데이터 안내
                </p>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
                  <li>Public Profile (Username, Avatar)</li>
                  <li>Public Activity Data (Commit, Issue, PR, Review)</li>
                </ul>
                <p className="text-xs mt-2 text-muted-foreground/80 bg-muted/50 rounded-md p-2">
                  * Private Repository의 활동이나 소스 코드는 절대 수집하지 않습니다.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="rounded-lg bg-secondary/80 p-4 text-xs text-secondary-foreground border border-secondary-foreground/10"
              >
                로그인 시 <span className="font-semibold underline">개인정보 처리방침</span> 및 <span className="font-semibold underline">이용약관</span>에 동의하는 것으로 간주합니다.
              </motion.div>
            </CardContent>

            <CardFooter>
              <motion.div variants={itemVariants} className="w-full">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/20"
                    onClick={handleGithubLogin}
                  >
                    <Github className="mr-2 h-5 w-5" />
                    GitHub로 계속하기
                  </Button>
                </motion.div>
              </motion.div>
            </CardFooter>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  )
}
