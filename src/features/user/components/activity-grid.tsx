import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { RegisterUserResponse } from "@/shared/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"
import { cn } from "@/shared/lib/utils"

interface ActivityItemProps {
  label: string
  value: number
  diff: number
}

function ActivityItem({ label, value, diff }: ActivityItemProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {label}
        </CardTitle>
        {diff > 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500" />
        ) : diff < 0 ? (
          <ArrowDown className="h-4 w-4 text-red-500" />
        ) : (
          <Minus className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className={cn(
            "text-xs",
            diff > 0 ? "text-green-500" : diff < 0 ? "text-red-500" : "text-muted-foreground"
        )}>
          {diff > 0 ? "+" : ""}{diff} from yesterday
        </p>
      </CardContent>
    </Card>
  )
}

interface ActivityGridProps {
  user: RegisterUserResponse
}

export function ActivityGrid({ user }: ActivityGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ActivityItem label="Commits" value={user.commitCount} diff={user.diffCommitCount} />
      <ActivityItem label="Issues" value={user.issueCount} diff={user.diffIssueCount} />
      <ActivityItem label="Pull Requests" value={user.prCount} diff={user.diffPrCount} />
      <ActivityItem label="Merged PRs" value={user.mergedPrCount} diff={user.diffMergedPrCount} />
      <ActivityItem label="Reviews" value={user.reviewCount} diff={user.diffReviewCount} />
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">Total Score</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-primary">{user.totalScore.toLocaleString()}</div>
            <p className="text-xs text-primary/70">
                Rank #{user.ranking} (Top {user.percentile.toFixed(1)}%)
            </p>
        </CardContent>
      </Card>
    </div>
  )
}
