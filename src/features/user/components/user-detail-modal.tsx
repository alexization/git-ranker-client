"use client"

import { useEffect, useState } from "react"
import { useUser } from "../api/user-service"
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import {
  Github,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  GitCommit,
  GitPullRequest,
  GitMerge,
  MessageSquare,
  AlertCircle,
  Trophy,
  Share2,
  X
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"

interface UserDetailModalProps {
  username: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// [Design System] Tier Colors - Text Only (Toss Style)
const TIER_TEXT_COLORS: Record<string, string> = {
  CHALLENGER: "text-blue-600 dark:text-blue-400",
  MASTER: "text-purple-600 dark:text-purple-400",
  DIAMOND: "text-sky-600 dark:text-sky-400",
  EMERALD: "text-emerald-600 dark:text-emerald-400",
  PLATINUM: "text-cyan-600 dark:text-cyan-400",
  GOLD: "text-yellow-600 dark:text-yellow-400",
  SILVER: "text-slate-500 dark:text-slate-400",
  BRONZE: "text-orange-600 dark:text-orange-400",
  IRON: "text-stone-500 dark:text-stone-400",
}

// [Animation] Odometer Effect
function CountUp({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Elastic Ease-out
      const easeOut = 1 - Math.pow(1 - progress, 4)

      setDisplayValue(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplayValue(end)
      }
    }
    requestAnimationFrame(animate)
  }, [value])

  return <span className="tabular-nums tracking-tighter">{displayValue.toLocaleString()}</span>
}

// [Component] Clean Stat Row
function StatRow({
                   label, value, diff, icon, delay
                 }: {
  label: string, value: number, diff: number, icon: React.ReactNode, delay: number
}) {
  return (
      <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay, duration: 0.3 }}
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-secondary/40 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-secondary/60 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
            {icon}
          </div>
          <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </div>

        <div className="text-right">
          <div className="text-lg font-bold font-mono tracking-tight text-foreground">
            <CountUp value={value} />
          </div>
          {diff !== 0 && (
              <div className={cn(
                  "text-[10px] font-medium flex items-center justify-end gap-0.5",
                  diff > 0 ? "text-red-500" : "text-blue-500" // Toss Style: 상승(Red), 하락(Blue)
              )}>
                {diff > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(diff)}</span>
              </div>
          )}
        </div>
      </motion.div>
  )
}

export function UserDetailModal({ username, open, onOpenChange }: UserDetailModalProps) {
  const { data: user, isLoading, isError } = useUser(username || "", { enabled: !!username && open })

  // 티어 텍스트 컬러 (없을 경우 기본값)
  const tierColor = user && TIER_TEXT_COLORS[user.tier] ? TIER_TEXT_COLORS[user.tier] : "text-muted-foreground"

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
            className="sm:max-w-[420px] p-0 overflow-hidden bg-background border-none shadow-[0_0_50px_-12px_rgba(0,0,0,0.2)] rounded-[32px] ring-1 ring-black/5 dark:ring-white/10"
            // 참고: DialogContent 내부의 기본 X 버튼을 사용하므로, 별도의 닫기 버튼은 추가하지 않습니다.
        >

          {/* [FIX] A11y: Screen Reader Title (TS Error Fixed by using className) */}
          <DialogTitle className="sr-only">
            {user ? `${user.username} 상세 정보` : "유저 상세 정보"}
          </DialogTitle>

          {isLoading ? (
              <div className="p-8 space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-28 w-28 rounded-full" />
                  <div className="space-y-2 text-center items-center flex flex-col">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full rounded-2xl" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>
              </div>
          ) : isError || !user ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold mb-1">정보를 불러올 수 없어요</h3>
                <p className="text-sm text-muted-foreground">잠시 후 다시 시도해주세요.</p>
              </div>
          ) : (
              <div className="flex flex-col">

                {/* 1. Header Section (Toss Style Profile) */}
                <div className="relative pt-12 pb-8 px-6 flex flex-col items-center text-center bg-gradient-to-b from-secondary/30 to-background">
                  <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative"
                  >
                    <Avatar className="h-28 w-28 border-[6px] border-background shadow-2xl">
                      <AvatarImage src={user.profileImage} className="object-cover" />
                      <AvatarFallback>{user.username[0]}</AvatarFallback>
                    </Avatar>

                    {/* [Design Fix] Tier Badge Position & Style */}
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                    >
                      <div className="bg-background px-3 py-1 rounded-full border border-border shadow-sm flex items-center justify-center">
                            <span className={cn("text-[11px] font-extrabold tracking-widest", tierColor)}>
                                {user.tier}
                            </span>
                      </div>
                    </motion.div>
                  </motion.div>

                  <div className="mt-6 space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">{user.username}</h2>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Trophy className="w-3.5 h-3.5" />
                          {user.ranking.toLocaleString()}위
                        </span>
                      <span className="w-0.5 h-3 bg-border" />
                      <span>상위 {user.percentile.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Total Score Display (Big Impact) */}
                  <div className="mt-6 mb-2">
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Total Score</p>
                    <div className="text-5xl font-black font-mono tracking-tighter text-foreground tabular-nums">
                      <CountUp value={user.totalScore} />
                    </div>
                  </div>
                </div>

                {/* 2. Stats List (Clean List View - like bank transactions) */}
                <div className="px-6 pb-8 space-y-1">
                  {/* '상세 활동 분석' 텍스트 제거됨 */}
                  <div className="bg-secondary/20 rounded-3xl p-2 border border-border/40">
                    <StatRow
                        label="Merged PRs"
                        value={user.mergedPrCount}
                        diff={user.diffMergedPrCount}
                        icon={<GitMerge className="w-4 h-4" />}
                        delay={0.1}
                    />
                    <StatRow
                        label="Open PRs"
                        value={user.prCount - user.mergedPrCount}
                        diff={user.diffPrCount - user.diffMergedPrCount}
                        icon={<GitPullRequest className="w-4 h-4" />}
                        delay={0.2}
                    />
                    <StatRow
                        label="Reviews"
                        value={user.reviewCount}
                        diff={user.diffReviewCount}
                        icon={<MessageSquare className="w-4 h-4" />}
                        delay={0.3}
                    />
                    <StatRow
                        label="Issues"
                        value={user.issueCount}
                        diff={user.diffIssueCount}
                        icon={<AlertCircle className="w-4 h-4" />}
                        delay={0.4}
                    />
                    <StatRow
                        label="Commits"
                        value={user.commitCount}
                        diff={user.diffCommitCount}
                        icon={<GitCommit className="w-4 h-4" />}
                        delay={0.5}
                    />
                  </div>
                </div>

                {/* 3. Footer Actions */}
                <div className="px-6 pb-8 grid grid-cols-2 gap-3">
                  <Button
                      asChild
                      className="h-12 rounded-2xl font-bold text-sm bg-secondary hover:bg-secondary/80 text-foreground border border-border/50 shadow-sm"
                  >
                    <Link href={`/users/${user.username}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      상세 리포트
                    </Link>
                  </Button>
                  <Button
                      asChild
                      className="h-12 rounded-2xl font-bold text-sm bg-[#191919] hover:bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/10"
                  >
                    <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub 방문
                    </a>
                  </Button>
                </div>

              </div>
          )}
        </DialogContent>
      </Dialog>
  )
}