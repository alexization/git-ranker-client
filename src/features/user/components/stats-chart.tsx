"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/shared/components/skeleton"
import { RegisterUserResponse } from "@/shared/types/api"

interface StatsChartProps {
    user: RegisterUserResponse
}

// ✅ Dynamic import for Recharts (reduces initial bundle by ~60KB gzipped)
const StatsChartImpl = dynamic(
    () => import("./stats-chart-impl").then((mod) => ({ default: mod.StatsChartImpl })),
    {
        loading: () => (
            <div className="w-full h-full flex items-center justify-center">
                <Skeleton className="h-[350px] w-full rounded-2xl" />
            </div>
        ),
        ssr: false, // Chart doesn't need SSR, reduces server load
    }
)

export function StatsChart({ user }: StatsChartProps) {
    return <StatsChartImpl user={user} />
}
