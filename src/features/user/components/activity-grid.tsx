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
    delay?: number // [ADD] 순차적 등장을 위한 delay prop
}

function ActivityItem({ label, value, diff, icon, colorClass, delay = 0 }: ActivityItemProps) {
    const [displayValue, setDisplayValue] = useState(0)

    // Count-up Animation with Ease-out effect
    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 1500; // 1.5s duration

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // Ease-out expo function: 1 - pow(2, -10 * progress)
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            setDisplayValue(Math.floor(easeOut * value));

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    }, [value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }} // [UX] 순차적 애니메이션 적용
            className={cn(
                "rounded-3xl p-6 shadow-sm border border-opacity-20 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden group",
                colorClass
            )}
        >
            {/* Background Decoration Icon */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300 transform rotate-12 scale-150 pointer-events-none text-foreground">
                {icon}
            </div>

            <div className="flex items-center justify-between mb-3 relative z-10">
                <span className="text-sm font-semibold text-foreground/60 uppercase tracking-wider">{label}</span>
                <div className="p-2 rounded-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm opacity-80">
                    {icon}
                </div>
            </div>

            <div className="flex items-end gap-3 relative z-10">
                {/* [UX/Typography] font-mono와 tabular-nums로 숫자 정렬 최적화 */}
                <span className="text-4xl font-extrabold font-mono tabular-nums tracking-tight text-foreground/90">
            {displayValue.toLocaleString()}
        </span>

                {diff !== 0 && (
                    <div className={cn(
                        "flex flex-col mb-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-sm",
                        diff > 0
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
                    )}>
                        <span className="leading-none">{diff > 0 ? "+" : ""}{diff.toLocaleString()}</span>
                        <span className="text-[8px] opacity-70 font-sans font-normal">Today</span>
                    </div>
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"> {/* [Layout] lg 사이즈에서 3열로 확장 */}
            <ActivityItem
                label="Merged PRs"
                value={user.mergedPrCount}
                diff={user.diffMergedPrCount}
                icon={<GitMerge className="h-6 w-6 text-blue-600" />}
                colorClass="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50"
                delay={0.1}
            />
            <ActivityItem
                label="Open PRs"
                value={user.prCount - user.mergedPrCount}
                diff={user.diffPrCount - user.diffMergedPrCount}
                icon={<GitPullRequest className="h-6 w-6 text-purple-600" />}
                colorClass="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50"
                delay={0.2}
            />
            <ActivityItem
                label="Code Reviews"
                value={user.reviewCount}
                diff={user.diffReviewCount}
                icon={<MessageSquare className="h-6 w-6 text-teal-600" />}
                colorClass="bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/50"
                delay={0.3}
            />
            <ActivityItem
                label="Total Issues"
                value={user.issueCount}
                diff={user.diffIssueCount}
                icon={<AlertCircle className="h-6 w-6 text-amber-600" />}
                colorClass="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50"
                delay={0.4}
            />
            <ActivityItem
                label="Total Commits"
                value={user.commitCount}
                diff={user.diffCommitCount}
                icon={<GitCommit className="h-6 w-6 text-slate-600" />}
                colorClass="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700/50"
                delay={0.5}
            />
        </div>
    )
}