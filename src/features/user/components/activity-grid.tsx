"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GitPullRequest, GitMerge, MessageSquare, GitCommit, AlertCircle } from "lucide-react"
import { RegisterUserResponse } from "@/shared/types/api"
import { cn } from "@/shared/lib/utils"

interface ActivityItemProps {
  label: string
  value: number
  diff: number
  icon: React.ReactNode
  colorClass: string
}

function ActivityItem({ label, value, diff, icon, colorClass }: ActivityItemProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    const duration = 1200
    const increment = end / (duration / 16)

    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setDisplayValue(end)
        clearInterval(timer)
      } else {
        setDisplayValue(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-3xl p-6 shadow-sm border border-opacity-20 transition-all duration-200 hover:shadow-md",
        colorClass
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground/70">{label}</span>
        <div className="opacity-60">{icon}</div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-4xl font-extrabold">{displayValue.toLocaleString()}</span>
        {diff !== 0 && (
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full mb-2",
            diff > 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {diff > 0 ? "+" : ""}{diff}
          </span>
        )}
      </div>
    </motion.div>
  )
}

interface ActivityGridProps {
  user: RegisterUserResponse
}

export function ActivityGrid({ user }: ActivityGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ActivityItem
        label="PR Merged"
        value={user.mergedPrCount}
        diff={user.diffMergedPrCount}
        icon={<GitMerge className="h-5 w-5" />}
        colorClass="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
      />
      <ActivityItem
        label="PR Open"
        value={user.prCount - user.mergedPrCount}
        diff={user.diffPrCount - user.diffMergedPrCount}
        icon={<GitPullRequest className="h-5 w-5" />}
        colorClass="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800"
      />
      <ActivityItem
        label="Reviews"
        value={user.reviewCount}
        diff={user.diffReviewCount}
        icon={<MessageSquare className="h-5 w-5" />}
        colorClass="bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800"
      />
      <ActivityItem
        label="Issues"
        value={user.issueCount}
        diff={user.diffIssueCount}
        icon={<AlertCircle className="h-5 w-5" />}
        colorClass="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800"
      />
      <ActivityItem
        label="Commits"
        value={user.commitCount}
        diff={user.diffCommitCount}
        icon={<GitCommit className="h-5 w-5" />}
        colorClass="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700"
      />
    </div>
  )
}
