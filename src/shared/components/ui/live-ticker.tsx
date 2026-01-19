"use client";

import { cn } from "@/shared/lib/utils";
import { Tier } from "@/shared/types/api";

export interface TickerUpdate {
    user: string;
    tier: Tier;
}

// [Data] Action 제거 및 순수 랭킹 정보로 변경
const MOCK_UPDATES: TickerUpdate[] = [
    { user: "alexization", tier: "CHALLENGER" },
    { user: "torvalds", tier: "DIAMOND" },
    { user: "shadcn", tier: "MASTER" },
    { user: "vercel", tier: "PLATINUM" },
    { user: "react", tier: "GOLD" },
    { user: "nextjs", tier: "EMERALD" },
    { user: "linux", tier: "SILVER" },
];

interface LiveTickerProps {
    updates?: TickerUpdate[];
}

export function LiveTicker({ updates = MOCK_UPDATES }: LiveTickerProps) {
    // 데이터 4배수 복제 (무한 스크롤용)
    const duplicatedData = [...updates, ...updates, ...updates, ...updates];

    return (
        <div className="relative flex w-full overflow-hidden bg-secondary/20 py-3 border-y border-border/50 backdrop-blur-sm select-none group">

            {/* Side Fade Effect */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            <div className="flex w-max min-w-full shrink-0 animate-infinite-scroll group-hover:[animation-play-state:paused] will-change-transform">
                {duplicatedData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 mx-8">
                        <span className="text-sm font-bold text-foreground/90">{item.user}</span>
                        {/* [Visual Fix] 티어 배지만 깔끔하게 표시 */}
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border font-bold tracking-wide",
                            item.tier === 'CHALLENGER' ? "bg-red-500/10 text-red-600 border-red-500/20" :
                                item.tier === 'MASTER' ? "bg-purple-500/10 text-purple-600 border-purple-500/20" :
                                    item.tier === 'DIAMOND' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                                        item.tier === 'EMERALD' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                            item.tier === 'PLATINUM' ? "bg-cyan-500/10 text-cyan-600 border-cyan-500/20" :
                                                item.tier === 'GOLD' ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" :
                                                    item.tier === 'SILVER' ? "bg-slate-500/10 text-slate-600 border-slate-500/20" :
                                                        item.tier === 'BRONZE' ? "bg-orange-500/10 text-orange-600 border-orange-500/20" :
                                                            "bg-stone-500/10 text-stone-600 border-stone-500/20"
                        )}>
                            {item.tier}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}