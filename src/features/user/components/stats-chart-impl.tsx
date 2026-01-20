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
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion"

interface StatsChartProps {
    user: RegisterUserResponse
}

// [Logic] 활동별 가중치 (점수 계산용)
// 이 가중치를 곱한 값이 곧 그래프의 점수가 됩니다.
const WEIGHTS = {
    commit: 1,       // 1점
    issue: 2,        // 2점
    review: 5,       // 5점
    pr: 5,           // 5점
    mergedPr: 8,     // 8점
}

export function StatsChartImpl({ user }: StatsChartProps) {
    const prefersReducedMotion = useReducedMotion()

    const chartData = useMemo(() => {
        // [Logic] 있는 그대로의 가중치 점수 계산
        // 인위적인 Normalization 없이 (Count * Weight) 값을 그대로 사용합니다.
        return [
            {
                subject: 'Commits',
                raw: user.commitCount,
                value: user.commitCount * WEIGHTS.commit
            },
            {
                subject: 'Issues',
                raw: user.issueCount,
                value: user.issueCount * WEIGHTS.issue
            },
            {
                subject: 'PR Merged',
                raw: user.mergedPrCount,
                value: user.mergedPrCount * WEIGHTS.mergedPr
            },
            {
                subject: 'PR Open',
                raw: user.prCount,
                value: (user.prCount ?? 0) * WEIGHTS.pr // PR Open은 5점
            },
            {
                subject: 'Reviews',
                raw: user.reviewCount,
                value: user.reviewCount * WEIGHTS.review
            },
        ];
    }, [user]);

    // [UX] Custom Tooltip: 디자인은 유지하되 데이터 표시는 원본 유지
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-popover border border-border px-4 py-3 rounded-xl shadow-xl text-sm min-w-[150px]">
                    <p className="font-bold text-foreground mb-2 border-b border-border/50 pb-1">
                        {data.subject}
                    </p>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-medium">Count</span>
                            <span className="text-foreground font-mono font-semibold">
                                {data.raw.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground text-xs font-medium">Score</span>
                            <span className="text-primary font-mono font-bold">
                                {data.value.toLocaleString()} pts
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-full flex items-center justify-center py-2 select-none outline-none focus:outline-none [&_*]:outline-none [&_svg]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData} style={{ outline: 'none' }}>
                    <PolarGrid
                        gridType="polygon"
                        stroke="hsl(var(--muted-foreground))"
                        strokeOpacity={0.15}
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
                                dy={payload.value === 'Commits' ? -10 : 5}
                                className="tracking-wide"
                            >
                                {payload.value}
                            </text>
                        )}
                    />

                    {/* [Logic] domain을 'auto'로 설정하여 데이터 최대값에 맞춰 그래프가 자동으로 커지게 함 */}
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 'auto']}
                        tick={false}
                        axisLine={false}
                    />

                    <Radar
                        name="Activity"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        isAnimationActive={!prefersReducedMotion}
                        animationDuration={800}
                        animationEasing="ease-out"
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={false}
                        isAnimationActive={false}
                        animationDuration={0}
                        allowEscapeViewBox={{ x: true, y: true }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    )
}