"use client"

import { useUser } from "../api/user-service"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Skeleton } from "@/shared/components/skeleton"
import { Card, CardContent } from "@/shared/components/card"
import { Github, ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/shared/lib/utils"

interface UserDetailModalProps {
  username: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailModal({ username, open, onOpenChange }: UserDetailModalProps) {
  const { data: user, isLoading, isError } = useUser(username || "", { enabled: !!username })

  const getDiffIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (diff < 0) return <TrendingDown className="h-3 w-3 text-red-500" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getDiffColor = (diff: number) => {
    if (diff > 0) return "text-green-600 dark:text-green-400"
    if (diff < 0) return "text-red-600 dark:text-red-400"
    return "text-muted-foreground"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        ) : isError || !user ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">사용자 정보를 불러올 수 없습니다.</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-lg">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl flex items-center gap-2">
                    {user.username}
                    <span className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      user.tier === 'CHALLENGER' && "border-transparent bg-red-500 text-white",
                      user.tier === 'MASTER' && "border-transparent bg-purple-500 text-white",
                      user.tier === 'DIAMOND' && "border-transparent bg-blue-500 text-white",
                      (user.tier === 'PLATINUM' || user.tier === 'EMERALD') && "border-transparent bg-cyan-500 text-white",
                      user.tier === 'GOLD' && "border-transparent bg-yellow-500 text-white",
                      user.tier === 'SILVER' && "border-transparent bg-slate-400 text-white",
                      user.tier === 'BRONZE' && "border-transparent bg-orange-700 text-white",
                      user.tier === 'IRON' && "border-transparent bg-slate-200 text-slate-700"
                    )}>
                      {user.tier}
                    </span>
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span>Rank #{user.ranking}</span>
                    <span>·</span>
                    <span>상위 {user.percentile.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Stats Grid */}
            <div className="grid gap-3 md:grid-cols-2">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                      <p className="text-2xl font-bold text-primary mt-1">{user.totalScore.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Commits</p>
                      <p className="text-2xl font-bold mt-1">{user.commitCount.toLocaleString()}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getDiffColor(user.diffCommitCount))}>
                      {getDiffIcon(user.diffCommitCount)}
                      {user.diffCommitCount !== 0 && Math.abs(user.diffCommitCount)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Pull Requests</p>
                      <p className="text-2xl font-bold mt-1">{user.prCount.toLocaleString()}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getDiffColor(user.diffPrCount))}>
                      {getDiffIcon(user.diffPrCount)}
                      {user.diffPrCount !== 0 && Math.abs(user.diffPrCount)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Merged PRs</p>
                      <p className="text-2xl font-bold mt-1">{user.mergedPrCount.toLocaleString()}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getDiffColor(user.diffMergedPrCount))}>
                      {getDiffIcon(user.diffMergedPrCount)}
                      {user.diffMergedPrCount !== 0 && Math.abs(user.diffMergedPrCount)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Code Reviews</p>
                      <p className="text-2xl font-bold mt-1">{user.reviewCount.toLocaleString()}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getDiffColor(user.diffReviewCount))}>
                      {getDiffIcon(user.diffReviewCount)}
                      {user.diffReviewCount !== 0 && Math.abs(user.diffReviewCount)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-4 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Issues</p>
                      <p className="text-2xl font-bold mt-1">{user.issueCount.toLocaleString()}</p>
                    </div>
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getDiffColor(user.diffIssueCount))}>
                      {getDiffIcon(user.diffIssueCount)}
                      {user.diffIssueCount !== 0 && Math.abs(user.diffIssueCount)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button asChild className="flex-1">
                <Link href={`/users/${user.username}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  전체 프로필 보기
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
