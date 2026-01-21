"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card"
import { Button } from "@/shared/components/button"
import { Check, Copy, Link2, Code2, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"

interface BadgeGeneratorProps {
    nodeId: string
    username: string
}

type CopyType = "markdown" | "html" | "link" | null

export function BadgeGenerator({ nodeId, username }: BadgeGeneratorProps) {
    const [copied, setCopied] = useState<CopyType>(null)

    const badgeUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/badges/${nodeId}`
    const profileUrl = `https://www.git-ranker.com/users/${username}`

    const markdownCode = `[![Git Ranker](${badgeUrl})](${profileUrl})`
    const htmlCode = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="Git Ranker Badge" /></a>`

    const handleCopy = async (text: string, type: CopyType) => {
        await navigator.clipboard.writeText(text)
        setCopied(type)
        toast.success(
            type === "markdown" ? "마크다운이 복사되었습니다!" :
            type === "html" ? "HTML이 복사되었습니다!" :
            "링크가 복사되었습니다!"
        )
        setTimeout(() => setCopied(null), 2000)
    }

    const CopyButton = ({
        type,
        text,
        icon: Icon,
        label
    }: {
        type: CopyType
        text: string
        icon: React.ElementType
        label: string
    }) => (
        <Button
            onClick={() => handleCopy(text, type)}
            variant="ghost"
            className={cn(
                "h-10 px-4 rounded-xl font-medium text-sm transition-all duration-200",
                "bg-secondary/50 hover:bg-secondary border border-transparent",
                copied === type && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            )}
        >
            {copied === type ? (
                <Check className="w-4 h-4 mr-2" />
            ) : (
                <Icon className="w-4 h-4 mr-2" />
            )}
            {label}
        </Button>
    )

    return (
        <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-4 px-5 sm:px-8 pt-6 sm:pt-8">
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    README 배지
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5 ml-11">
                    GitHub 프로필에 나만의 배지를 추가해보세요
                </CardDescription>
            </CardHeader>

            <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5">
                {/* Badge Preview */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 sm:p-6 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center">
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-90 transition-opacity"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={badgeUrl}
                                alt="Git Ranker Badge"
                                className="max-w-full h-auto object-contain"
                            />
                        </a>
                    </div>
                </div>

                {/* Copy Buttons */}
                <div className="flex flex-wrap gap-2">
                    <CopyButton
                        type="markdown"
                        text={markdownCode}
                        icon={Copy}
                        label="Markdown"
                    />
                    <CopyButton
                        type="html"
                        text={htmlCode}
                        icon={Code2}
                        label="HTML"
                    />
                    <CopyButton
                        type="link"
                        text={badgeUrl}
                        icon={Link2}
                        label="이미지 링크"
                    />
                    <Button
                        asChild
                        variant="ghost"
                        className="h-10 px-4 rounded-xl font-medium text-sm bg-secondary/50 hover:bg-secondary"
                    >
                        <a href={badgeUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            미리보기
                        </a>
                    </Button>
                </div>

                {/* Usage Hint */}
                <div className="p-3 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400/90 leading-relaxed">
                        <span className="font-semibold">💡 Tip:</span>{" "}
                        GitHub 프로필 README.md 파일에 마크다운 코드를 붙여넣으세요!
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}