"use client"

import { useMemo } from "react"
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
} from "recharts"
import { RegisterUserResponse } from "@/shared/types/api"

interface StatsChartProps {
    user: RegisterUserResponse
}

// [Logic] Git Ranker Scoring Weights
const WEIGHTS = {
    mergedPr: 8,
    openPr: 5,
    review: 5,
    issue: 2,
    commit: 1,
}

export function StatsChartImpl({ user }: StatsChartProps) {
    // [Fix] 단순 횟수가 아닌 '가중치 점수'로 변환하여 그래프 균형 보정
    const chartData = useMemo(() => [
        {
            subject: 'Commits',
            raw: user.commitCount,
            value: user.commitCount * WEIGHTS.commit,
            fullMark: 100
        },
        {
            subject: 'Issues',
            raw: user.issueCount,
            value: user.issueCount * WEIGHTS.issue,
            fullMark: 100
        },
        {
            subject: 'PR Merged',
            raw: user.mergedPrCount,
            value: user.mergedPrCount * WEIGHTS.mergedPr,
            fullMark: 100
        },
        {
            subject: 'PR Count',
            raw: user.PrCount ?? user.prCount,
            value: (user.PrCount ?? user.prCount) * WEIGHTS.openPr,
            fullMark: 100
        },
        {
            subject: 'Reviews',
            raw: user.reviewCount,
            value: user.reviewCount * WEIGHTS.review,
            fullMark: 100
        },
    ], [user.commitCount, user.issueCount, user.mergedPrCount, user.PrCount, user.prCount, user.reviewCount])

    // Custom Tooltip: 점수와 원본 횟수를 함께 표시
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-popover/90 backdrop-blur-md border border-border px-3 py-2 rounded-xl shadow-xl text-xs">
                    <p className="font-bold text-foreground mb-1">{data.subject}</p>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-muted-foreground">
                            Count: <span className="text-foreground font-mono font-semibold">{data.raw.toLocaleString()}</span>
                        </p>
                        <p className="text-primary font-medium">
                            Score: <span className="font-mono">{data.value.toLocaleString()}</span> pts
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex items-center justify-center py-2">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid
                        gridType="polygon"
                        stroke="hsl(var(--muted-foreground))"
                        strokeOpacity={0.2}
                    />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={({ x, y, payload, textAnchor }) => (
                            <text
                                x={x}
                                y={y}
                                textAnchor={textAnchor}
                                fill="hsl(var(--muted-foreground))"
                                fontSize={11}
                                fontWeight={600}
                                dy={payload.value === 'Commits' ? -10 : 5} // 라벨 위치 미세 조정
                            >
                                {payload.value}
                            </text>
                        )}
                    />
                    {/* RadiusAxis는 시각적 노이즈를 줄이기 위해 숨김 처리 */}
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />

                    <Radar
                        name={user.username}
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}
