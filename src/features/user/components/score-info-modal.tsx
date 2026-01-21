"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/shared/components/dialog"
import {
    GitPullRequest,
    GitMerge,
    MessageSquare,
    GitCommit,
    AlertCircle,
    CalendarClock,
    Zap
} from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/components/button"

interface ScoreInfoModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ScoreInfoModal({ open, onOpenChange }: ScoreInfoModalProps) {

    const scoreItems = [
        {
            label: "PR Merged",
            score: 8,
            icon: <GitMerge className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
            desc: "품질이 보증된 기여",
            bgColor: "bg-blue-500/10"
        },
        {
            label: "PR Open",
            score: 5,
            icon: <GitPullRequest className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />,
            desc: "적극적인 오픈소스 참여",
            bgColor: "bg-purple-500/10"
        },
        {
            label: "Code Review",
            score: 5,
            icon: <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" />,
            desc: "지식 공유와 품질 향상",
            bgColor: "bg-teal-500/10"
        },
        {
            label: "Issue Created",
            score: 2,
            icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
            desc: "문제 정의 및 논의 주도",
            bgColor: "bg-amber-500/10"
        },
        {
            label: "Commit",
            score: 1,
            icon: <GitCommit className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />,
            desc: "꾸준한 코드 작성",
            bgColor: "bg-slate-500/10"
        },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] w-[calc(100%-2rem)] mx-auto p-0 overflow-hidden bg-white dark:bg-[#1C1C1E] border-none shadow-2xl rounded-[24px] sm:rounded-[28px] gap-0 flex flex-col max-h-[75vh] sm:max-h-[85vh]">

                {/* Header - Fixed */}
                <div className="relative px-5 sm:px-7 pt-6 sm:pt-8 pb-4 sm:pb-6 bg-white dark:bg-[#1C1C1E] shrink-0">
                    <DialogTitle className="text-[22px] font-bold text-foreground leading-snug">
                        점수 산정 및<br/>갱신 기준
                    </DialogTitle>
                </div>

                {/* Scrollable Content */}
                <div className="px-5 sm:px-7 pb-4 sm:pb-6 space-y-6 sm:space-y-8 bg-white dark:bg-[#1C1C1E] overflow-y-auto flex-1 min-h-0">

                    {/* Section 1: Score Weights */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-2">활동별 가중치</h4>
                        {scoreItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className={cn("p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-colors", item.bgColor)}>
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground text-[14px] sm:text-[15px]">{item.label}</span>
                                        <span className="text-[11px] sm:text-[12px] text-muted-foreground font-medium">{item.desc}</span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-secondary/50 text-xs sm:text-sm font-bold text-foreground font-mono">
                                    {item.score}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/40 w-full" />

                    {/* Section 2: Refresh Rules */}
                    <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-2">데이터 갱신 규칙</h4>

                        <div className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/30">
                            <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-500/20 rounded-lg sm:rounded-xl shrink-0">
                                <CalendarClock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[14px] sm:text-[15px] font-bold text-foreground mb-0.5">자동 갱신 (매일 새벽)</p>
                                <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-snug">
                                    최근 1년 간의 활동이 매일 자동으로 반영됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-secondary/30">
                            <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-lg sm:rounded-xl shrink-0">
                                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-[14px] sm:text-[15px] font-bold text-foreground mb-0.5">수동 갱신 (5분 쿨타임)</p>
                                <p className="text-[12px] sm:text-[13px] text-muted-foreground leading-snug">
                                    방금 기여한 내용을 즉시 반영하고 싶을 때 사용하세요.
                                    서버 부하 방지를 위해 <span className="text-yellow-600 dark:text-yellow-400 font-bold">5분</span> 간격으로 제한됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Button - Fixed at bottom */}
                <div className="p-4 sm:p-5 pb-6 sm:pb-5 bg-secondary/10 border-t border-border/10 shrink-0">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full h-11 sm:h-12 rounded-xl text-[14px] sm:text-[15px] font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        확인했어요
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}