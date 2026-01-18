"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card"

interface BadgeGeneratorProps {
    nodeId: string
}

export function BadgeGenerator({ nodeId }: BadgeGeneratorProps) {
    const badgeUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/badges/${nodeId}`

    return (
        <Card className="mt-2 rounded-[2rem] border-0 bg-white/50 dark:bg-black/20 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-2 text-center sm:text-left">
                <CardTitle className="text-lg font-bold">Live Badge Preview</CardTitle>
                <CardDescription className="text-xs">
                    GitHub 프로필에 표시되는 실시간 배지 미리보기입니다.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center sm:justify-start pt-4 pb-6">
                <div className="p-4 border rounded-2xl bg-white/80 dark:bg-black/40 shadow-inner flex items-center justify-center min-w-[300px] sm:min-w-fit">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={badgeUrl}
                        alt="Git Ranker Badge"
                        className="max-w-full h-auto object-contain"
                    />
                </div>
            </CardContent>
        </Card>
    )
}