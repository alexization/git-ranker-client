"use client"

import { useUser } from "../api/user-service"
import { Dialog, DialogContent, DialogTitle } from "@/shared/components/dialog"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { ExternalLink, Crown, AlertCircle, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"
import { motion } from "framer-motion"
import { ActivityGrid } from "./activity-grid"
import { GithubIcon } from "@/shared/components/icons/github-icon"

interface UserDetailModalProps {
  username: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const TIER_TEXT_COLORS: Record<string, string> = {
  CHALLENGER: "text-red-500",
  MASTER: "text-purple-500",
  DIAMOND: "text-blue-500",
  EMERALD: "text-emerald-500",
  PLATINUM: "text-cyan-500",
  GOLD: "text-yellow-500",
  SILVER: "text-slate-500",
  BRONZE: "text-orange-500",
  IRON: "text-stone-500",
}

export function UserDetailModal({ username, open, onOpenChange }: UserDetailModalProps) {
  const { data: user, isLoading, isError } = useUser(username || "", { enabled: !!username && open })

  const tierColor = user && TIER_TEXT_COLORS[user.tier] ? TIER_TEXT_COLORS[user.tier] : "text-muted-foreground"

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {/* [Fix] flex-col 및 max-h 설정으로 내부 스크롤 구조 잡기 */}
        <DialogContent
            className="sm:max-w-xl p-0 overflow-hidden bg-background border-none shadow-2xl rounded-[32px] ring-1 ring-black/5 dark:ring-white/10 flex flex-col max-h-[85vh] outline-none [&>button]:hidden"
        >
          {/* [Fix] 닫기 버튼: 위치 조정 (right-6, top-6) 및 배경 추가로 시인성 확보 */}
          {/* [Important] 닫기 버튼을 div로 감싸서 [&>button]:hidden 선택자를 피함 */}
          <div className="absolute right-6 top-6 z-50">
            <DialogPrimitive.Close className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 transition-colors focus:outline-none backdrop-blur-md group">
              <X className="h-5 w-5 text-foreground/70 group-hover:text-foreground transition-colors" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>

          <DialogTitle className="sr-only">
            {user ? `${user.username} 상세 정보` : "유저 상세 정보"}
          </DialogTitle>

          {isLoading ? (
              <div className="flex-1 p-8 space-y-8 flex flex-col items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="h-28 w-28 rounded-full" />
                  <Skeleton className="h-8 w-40" />
                </div>
                <div className="w-full space-y-3 px-4">
                  <Skeleton className="h-24 w-full rounded-2xl" />
                  <Skeleton className="h-24 w-full rounded-2xl" />
                </div>
              </div>
          ) : isError || !user ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6 min-h-[400px]">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold mb-1">정보를 불러올 수 없어요</h3>
              </div>
          ) : (
              <>
                {/* [Fix] Scrollable Content Area: 컨텐츠 영역만 스크롤되도록 분리 */}
                <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain">

                  {/* Header Section */}
                  <div className="relative pt-16 pb-8 px-6 flex flex-col items-center text-center bg-gradient-to-b from-secondary/50 to-background shrink-0">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative"
                    >
                      <Avatar className="h-28 w-28 border-[6px] border-background shadow-xl">
                        <AvatarImage src={user.profileImage} className="object-cover" />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>

                      <motion.div
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="absolute -bottom-3 left-1/2 -translate-x-1/2"
                      >
                        <div className="bg-background px-3 py-1 rounded-full border border-border shadow-sm flex items-center justify-center whitespace-nowrap">
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
                                <Crown className="w-3.5 h-3.5" />
                              #{user.ranking.toLocaleString()}
                            </span>
                        <span className="w-0.5 h-3 bg-border" />
                        <span>Top {user.percentile.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-5xl font-black font-mono tracking-tighter text-foreground tabular-nums">
                        {user.totalScore.toLocaleString()}
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Total Score</p>
                    </div>
                  </div>

                  {/* Stats Grid - [Fix] 불필요한 하단 패딩 제거 (Footer 분리로 해결됨) */}
                  <div className="px-6 pb-8">
                    <ActivityGrid user={user} />
                  </div>
                </div>

                {/* [Fix] Fixed Footer: 스크롤 영역 밖에 배치하여 항상 보이게 함 */}
                <div className="p-6 pt-4 bg-background/95 backdrop-blur-xl border-t border-border/50 z-20 shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                        asChild
                        className="h-14 rounded-2xl font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                      <Link href={`/users/${user.username}`}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        상세 리포트 보기
                      </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="h-14 rounded-2xl font-bold text-sm border-2 hover:bg-secondary hover:text-foreground hover:border-transparent transition-all"
                    >
                      <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                        <GithubIcon className="w-4 h-4 mr-2" />
                        GitHub 방문
                      </a>
                    </Button>
                  </div>
                </div>
              </>
          )}
        </DialogContent>
      </Dialog>
  )
}