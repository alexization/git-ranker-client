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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/card"

interface StatsChartProps {
  user: RegisterUserResponse
}

export function StatsChart({ user }: StatsChartProps) {
  const chartData = useMemo(() => [
    { subject: 'Commits', value: user.commitCount },
    { subject: 'Issues', value: user.issueCount },
    { subject: 'PR Merged', value: user.mergedPrCount },
    { subject: 'PR Open', value: user.prCount - user.mergedPrCount },
    { subject: 'Reviews', value: user.reviewCount },
  ], [user])

  return (
    <Card className="shadow-lg border-2 rounded-3xl bg-white dark:bg-slate-900/50">
      <CardContent className="pt-6">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
              <PolarGrid
                stroke="hsl(var(--border))"
                strokeWidth={1.5}
                strokeDasharray="0"
              />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "hsl(var(--foreground))", fontSize: 13, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 'auto']}
                tick={false}
                axisLine={false}
              />
              <Radar
                name={user.username}
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.25}
                strokeWidth={2.5}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  color: 'hsl(var(--popover-foreground))',
                  borderRadius: '12px',
                  border: '2px solid',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
