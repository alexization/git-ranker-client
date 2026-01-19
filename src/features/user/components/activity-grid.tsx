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
    delay?: number
}

function ActivityItem({ label, value, diff, icon, colorClass, delay = 0 }: ActivityItemProps) {
    const [displayValue, setDisplayValue] = useState(0)

    // [Typography] Count-up Animation
    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1200;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            setDisplayValue(Math.floor(easeOut * value));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setDisplayValue(value);
            }
        };
        window.requestAnimationFrame(step);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "relative overflow-hidden rounded-3xl p-6 border border-transparent transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group",
                colorClass
            )}
        >
            {/* 배경 데코레이션 아이콘 */}
            <div className="absolute right-2 bottom-2 opacity-[0.15] transform rotate-12 scale-[2.5] pointer-events-none transition-transform group-hover:scale-[2.8] group-hover:rotate-6 duration-500 origin-bottom-right grayscale-0">
                {icon}
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">{label}</span>
                </div>

                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black font-mono tabular-nums tracking-tighter text-foreground/90 leading-none">
                        {displayValue.toLocaleString()}
                    </span>

                    {diff !== 0 && (
                        <div className={cn(
                            "flex items-center mb-1 px-1.5 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm",
                            diff > 0
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                        )}>
                            <span>{diff > 0 ? "+" : ""}{diff.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

interface ActivityGridProps {
    user: RegisterUserResponse
}

export function ActivityGrid({ user }: ActivityGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActivityItem
                label="Merged PRs"
                value={user.mergedPrCount}
                diff={user.diffMergedPrCount}
                // [Fix] Dark 모드 아이콘 컬러 밝게 조정 (blue-600 -> dark:blue-400)
                icon={<GitMerge className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                // [Fix] Dark 모드 배경 가시성 확보 (blue-900/20 -> blue-500/10)
                colorClass="bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20"
                delay={0.1}
            />
            <ActivityItem
                label="Open PRs"
                value={Math.max(0, (user.prCount || 0) - user.mergedPrCount)}
                diff={(user.diffPrCount || 0) - user.diffMergedPrCount}
                icon={<GitPullRequest className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                colorClass="bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20"
                delay={0.2}
            />
            <ActivityItem
                label="Code Reviews"
                value={user.reviewCount}
                diff={user.diffReviewCount}
                icon={<MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
                colorClass="bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20"
                delay={0.3}
            />
            <ActivityItem
                label="Issues Created"
                value={user.issueCount}
                diff={user.diffIssueCount}
                icon={<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                colorClass="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20"
                delay={0.4}
            />
            <ActivityItem
                label="Total Commits"
                value={user.commitCount}
                diff={user.diffCommitCount}
                icon={<GitCommit className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                colorClass="bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20"
                delay={0.5}
            />
        </div>
    )
}