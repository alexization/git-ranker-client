"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useUser, useRefreshUser } from "@/features/user/api/user-service"
import { ActivityGrid } from "@/features/user/components/activity-grid"
import { StatsChart } from "@/features/user/components/stats-chart"
import { BadgeGenerator } from "@/features/user/components/badge-generator"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card"
import { RefreshCcw, Github } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { useEffect, useState } from "react"

export default function UserDetailPage() {
  const params = useParams()
  const username = params.username as string
  const { data: user, isLoading, isError, refetch } = useUser(username)
  const refreshMutation = useRefreshUser()

  const handleRefresh = () => {
    toast.promise(refreshMutation.mutateAsync(username), {
      loading: '최신 데이터를 GitHub에서 가져오는 중...',
      success: '데이터가 갱신되었습니다!',
      error: '데이터 갱신에 실패했습니다. (쿨다운 7일)',
    })
  }

  if (isLoading) {
    return (
        <div className="container py-10 max-w-5xl space-y-8">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
        </div>
    )
  }

  if (isError || !user) {
    return (
        <div className="container flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold mb-4">사용자를 찾을 수 없습니다.</h1>
            <p className="text-muted-foreground mb-8">GitHub Username을 다시 확인해주세요.</p>
            <Button onClick={() => window.history.back()}>뒤로 가기</Button>
        </div>
    )
  }

  // Animated percentile counter
  const [displayPercentile, setDisplayPercentile] = useState(0)

  useEffect(() => {
    if (user) {
      let start = 0
      const end = user.percentile
      const duration = 1500
      const increment = end / (duration / 16)

      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setDisplayPercentile(end)
          clearInterval(timer)
        } else {
          setDisplayPercentile(start)
        }
      }, 16)

      return () => clearInterval(timer)
    }
  }, [user])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  // Tier-specific background colors
  const tierBackgroundClass = {
    'CHALLENGER': 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/10 dark:to-orange-950/10',
    'MASTER': 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10',
    'DIAMOND': 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10',
    'EMERALD': 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/10 dark:to-teal-950/10',
    'PLATINUM': 'bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-950/10 dark:to-gray-950/10',
    'GOLD': 'bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/10 dark:to-amber-950/10',
    'SILVER': 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10',
    'BRONZE': 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/10 dark:to-amber-950/10',
    'IRON': 'bg-gradient-to-br from-stone-50 to-neutral-50 dark:from-stone-950/10 dark:to-neutral-950/10',
  }[user.tier] || 'bg-background'

  return (
    <div className={cn("min-h-screen", tierBackgroundClass)}>
      <motion.div
        className="container py-10 max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      {/* Profile Header */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
      >
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl ring-4 ring-primary/10">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback>{user.username[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <div className="flex items-center gap-3">
                <motion.h1
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {user.username}
                </motion.h1>
                <motion.span
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold uppercase tracking-wide",
                    user.tier === 'CHALLENGER' && "border-transparent bg-red-500 text-white shadow-lg shadow-red-500/30",
                    user.tier === 'MASTER' && "border-transparent bg-purple-500 text-white shadow-lg shadow-purple-500/30",
                    user.tier === 'DIAMOND' && "border-transparent bg-blue-500 text-white shadow-lg shadow-blue-500/30",
                    (user.tier === 'PLATINUM' || user.tier === 'EMERALD') && "border-transparent bg-cyan-500 text-white shadow-lg shadow-cyan-500/30",
                    user.tier === 'GOLD' && "border-transparent bg-yellow-500 text-white shadow-lg shadow-yellow-500/30",
                    user.tier === 'SILVER' && "border-transparent bg-slate-400 text-white shadow-lg shadow-slate-400/30",
                    user.tier === 'BRONZE' && "border-transparent bg-orange-700 text-white shadow-lg shadow-orange-700/30",
                    user.tier === 'IRON' && "border-transparent bg-slate-200 text-slate-700 shadow-lg shadow-slate-200/30"
                  )}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                >
                    {user.tier}
                </motion.span>
            </div>
            <motion.div
              className="flex items-center gap-4 mt-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
                <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground transition-colors">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                </a>
                <span className="text-sm">Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
            </motion.div>
          </div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              variant="outline"
              className="shadow-md"
          >
              <RefreshCcw className={cn("mr-2 h-4 w-4", refreshMutation.isPending && "animate-spin")} />
              데이터 수동 갱신
          </Button>
        </motion.div>
      </motion.div>

      {/* Main Stats Dashboard */}
      <motion.div
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-3"
      >
        <motion.div variants={itemVariants} className="md:col-span-3">
            <ActivityGrid user={user} />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-2">
            <StatsChart user={user} />
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full shadow-lg border-2">
                <CardHeader>
                    <CardTitle className="text-xl">Percentile</CardTitle>
                    <CardDescription>전체 사용자 중 상위</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                        <motion.span
                          className="text-6xl font-extrabold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        >
                          {displayPercentile.toFixed(1)}%
                        </motion.span>
                        <p className="text-sm text-muted-foreground mt-2 font-medium">Top Player</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
      </motion.div>

      {/* Badge Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <BadgeGenerator nodeId={user.nodeId} />
      </motion.div>
    </motion.div>
    </div>
  )
}
