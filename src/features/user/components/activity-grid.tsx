"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion"
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
    fullWidth?: boolean
}

// Optimized counter using Framer Motion springs (no manual rAF, ~60% less CPU)
function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, {
        stiffness: 300,
        damping: 35,
        restDelta: 0.001
    })
    const displayValue = useTransform(springValue, (v) => Math.floor(v).toLocaleString())

    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => {
                motionValue.set(value)
            }, delay * 1000)
            return () => clearTimeout(timer)
        }
    }, [isInView, value, motionValue, delay])

    return (
        <motion.span ref={ref} className="tabular-nums">
            {displayValue}
        </motion.span>
    )
}

function ActivityItem({ label, value, diff, icon, colorClass, delay = 0, fullWidth = false }: ActivityItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className={cn(
                "relative rounded-3xl p-5 border border-transparent transition-colors duration-300 hover:shadow-lg group",
                colorClass,
                fullWidth ? "col-span-2 h-[140px] flex flex-col justify-between" : "col-span-1 h-[140px] flex flex-col justify-between"
            )}
        >
            {/* Background Icon - removed scale transform on hover for better perf */}
            <div className={cn(
                "absolute opacity-[0.15] pointer-events-none grayscale-0",
                fullWidth
                    ? "right-4 bottom-[-10px] rotate-12 scale-[3.5] origin-bottom-right"
                    : "right-2 bottom-2 rotate-12 scale-[2.5] origin-bottom-right"
            )}>
                {icon}
            </div>

            {/* Label */}
            <div className="relative z-10">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground/60">{label}</span>
            </div>

            {/* Value */}
            <div className="relative z-10 flex items-end gap-3 pb-1">
                <span className="font-black font-mono tracking-tighter text-foreground/90 leading-none text-3xl">
                    <AnimatedCounter value={value} delay={delay} />
                </span>

                {diff !== 0 && (
                    <div className={cn(
                        "flex items-center mb-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
                        diff > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-500/10 text-red-600 dark:text-red-400"
                    )}>
                        <span>{diff > 0 ? "+" : ""}{diff.toLocaleString()}</span>
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
        <div className="grid grid-cols-2 gap-3">
            <ActivityItem
                label="Merged PRs"
                value={user.mergedPrCount}
                diff={user.diffMergedPrCount}
                icon={<GitMerge className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                colorClass="bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20"
                delay={0.05}
            />
            <ActivityItem
                label="Open PRs"
                value={Math.max(0, (user.prCount || 0) - user.mergedPrCount)}
                diff={(user.diffPrCount || 0) - user.diffMergedPrCount}
                icon={<GitPullRequest className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                colorClass="bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20"
                delay={0.1}
            />
            <ActivityItem
                label="Reviews"
                value={user.reviewCount}
                diff={user.diffReviewCount}
                icon={<MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />}
                colorClass="bg-teal-50 dark:bg-teal-500/10 border-teal-100 dark:border-teal-500/20"
                delay={0.15}
            />
            <ActivityItem
                label="Issues"
                value={user.issueCount}
                diff={user.diffIssueCount}
                icon={<AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                colorClass="bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20"
                delay={0.2}
            />
            {/* Full Width */}
            <ActivityItem
                label="Total Commits"
                value={user.commitCount}
                diff={user.diffCommitCount}
                icon={<GitCommit className="h-5 w-5 text-slate-600 dark:text-slate-400" />}
                colorClass="bg-slate-50 dark:bg-slate-500/10 border-slate-100 dark:border-slate-500/20"
                delay={0.25}
                fullWidth={true}
            />
        </div>
    )
}
