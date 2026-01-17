"use client"

import { useParams } from "next/navigation"
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

  return (
    <div className="container py-10 max-w-5xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{user.username}</h1>
                <span className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    user.tier === 'CHALLENGER' && "border-transparent bg-red-500 text-white shadow",
                    user.tier === 'MASTER' && "border-transparent bg-purple-500 text-white shadow",
                    user.tier === 'DIAMOND' && "border-transparent bg-blue-500 text-white shadow",
                    (user.tier === 'PLATINUM' || user.tier === 'EMERALD') && "border-transparent bg-cyan-500 text-white shadow",
                    user.tier === 'GOLD' && "border-transparent bg-yellow-500 text-white shadow",
                    user.tier === 'SILVER' && "border-transparent bg-slate-400 text-white shadow",
                    user.tier === 'BRONZE' && "border-transparent bg-orange-700 text-white shadow",
                    user.tier === 'IRON' && "border-transparent bg-slate-200 text-slate-700"
                )}>
                    {user.tier}
                </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <a href={`https://github.com/${user.username}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-foreground">
                    <Github className="h-4 w-4" />
                    GitHub Profile
                </a>
                <span className="text-sm">Updated: {new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <Button 
            onClick={handleRefresh} 
            disabled={refreshMutation.isPending}
            variant="outline"
        >
            <RefreshCcw className={cn("mr-2 h-4 w-4", refreshMutation.isPending && "animate-spin")} />
            데이터 수동 갱신
        </Button>
      </div>

      {/* Main Stats Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-3">
            <ActivityGrid user={user} />
        </div>
        <div className="md:col-span-2">
            <StatsChart user={user} />
        </div>
        <div className="md:col-span-1">
            {/* Additional Info or Mini Charts could go here */}
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Percentile</CardTitle>
                    <CardDescription>전체 사용자 중 상위</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px]">
                    <div className="text-center">
                        <span className="text-5xl font-extrabold text-primary">{user.percentile.toFixed(1)}%</span>
                        <p className="text-sm text-muted-foreground mt-2">Top Player</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Badge Section */}
      <BadgeGenerator nodeId={user.nodeId} />
    </div>
  )
}
