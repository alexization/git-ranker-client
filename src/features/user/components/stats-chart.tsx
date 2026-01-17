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
    { subject: 'Commits', A: user.commitCount, fullMark: 100 },
    { subject: 'Issues', A: user.issueCount, fullMark: 100 },
    { subject: 'Reviews', A: user.reviewCount, fullMark: 100 },
    { subject: 'PRs', A: user.prCount, fullMark: 100 },
    { subject: 'Merged', A: user.mergedPrCount, fullMark: 100 },
  ], [user])

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>Activity Radar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
              <Radar
                name={user.username}
                dataKey="A"
                stroke="var(--primary)"
                fill="var(--primary)"
                fillOpacity={0.3}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--popover)', 
                  borderColor: 'var(--border)',
                  color: 'var(--popover-foreground)',
                  borderRadius: 'var(--radius)'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
