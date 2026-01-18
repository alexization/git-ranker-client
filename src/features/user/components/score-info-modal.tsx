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
            icon: <GitMerge className="w-5 h-5 text-blue-500" />,
            desc: "품질이 보증된 기여",
            bgColor: "bg-blue-500/10"
        },
        {
            label: "PR Open",
            score: 5,
            icon: <GitPullRequest className="w-5 h-5 text-purple-500" />,
            desc: "적극적인 오픈소스 참여",
            bgColor: "bg-purple-500/10"
        },
        {
            label: "Code Review",
            score: 5,
            icon: <MessageSquare className="w-5 h-5 text-teal-500" />,
            desc: "지식 공유와 품질 향상",
            bgColor: "bg-teal-500/10"
        },
        {
            label: "Issue Created",
            score: 2,
            icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
            desc: "문제 정의 및 논의 주도",
            bgColor: "bg-amber-500/10"
        },
        {
            label: "Commit",
            score: 1,
            icon: <GitCommit className="w-5 h-5 text-slate-500" />,
            desc: "꾸준한 코드 작성",
            bgColor: "bg-slate-500/10"
        },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-white dark:bg-[#1C1C1E] border-none shadow-2xl rounded-[28px] gap-0">

                {/* Header - [FIX] 중복 닫기 버튼 제거 */}
                <div className="relative px-7 pt-8 pb-6 bg-white dark:bg-[#1C1C1E]">
                    <DialogTitle className="text-[22px] font-bold text-foreground leading-snug">
                        점수 산정 및<br/>갱신 기준
                    </DialogTitle>
                </div>

                {/* Scrollable Content */}
                <div className="px-7 pb-8 space-y-8 bg-white dark:bg-[#1C1C1E]">

                    {/* Section 1: Score Weights */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-2">활동별 가중치</h4>
                        {scoreItems.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-2.5 rounded-2xl transition-colors", item.bgColor)}>
                                        {item.icon}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground text-[15px]">{item.label}</span>
                                        <span className="text-[12px] text-muted-foreground font-medium">{item.desc}</span>
                                    </div>
                                </div>
                                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary/50 text-sm font-bold text-foreground font-mono">
                                    {item.score}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border/40 w-full" />

                    {/* Section 2: Refresh Rules */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-2">데이터 갱신 규칙</h4>

                        <div className="flex gap-4 items-start p-4 rounded-2xl bg-secondary/30">
                            <div className="p-2 bg-orange-100 dark:bg-orange-500/20 rounded-xl shrink-0">
                                <CalendarClock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-foreground mb-0.5">자동 갱신 (매일 새벽)</p>
                                <p className="text-[13px] text-muted-foreground leading-snug">
                                    최근 1년 간의 활동이 매일 자동으로 반영됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start p-4 rounded-2xl bg-secondary/30">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-500/20 rounded-xl shrink-0">
                                <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-[15px] font-bold text-foreground mb-0.5">수동 갱신 (5분 쿨타임)</p>
                                <p className="text-[13px] text-muted-foreground leading-snug">
                                    방금 기여한 내용을 즉시 반영하고 싶을 때 사용하세요.<br/>
                                    서버 부하 방지를 위해 <span className="text-yellow-600 dark:text-yellow-400 font-bold">5분</span> 간격으로 제한됩니다.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Button */}
                <div className="p-4 bg-secondary/10 border-t border-border/10">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 rounded-xl text-[15px] font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                    >
                        확인했어요
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}