"use client";

import { cn } from "@/shared/lib/utils";
import { Tier } from "@/shared/types/api";

export interface TickerUpdate {
    user: string;
    tier: Tier;
    action: string;
}

const MOCK_UPDATES: TickerUpdate[] = [
    { user: "alexization", tier: "CHALLENGER", action: "Rank Up 🚀" },
    { user: "torvalds", tier: "DIAMOND", action: "New Commit 🔥" },
    { user: "shadcn", tier: "MASTER", action: "PR Merged ✨" },
    { user: "vercel", tier: "PLATINUM", action: "Score +50 📈" },
    { user: "react", tier: "GOLD", action: "Review Added 💬" },
    { user: "nextjs", tier: "EMERALD", action: "Issue Closed ✅" },
    { user: "linux", tier: "SILVER", action: "Repo Created 📦" },
];

interface LiveTickerProps {
    updates?: TickerUpdate[];
}

export function LiveTicker({ updates = MOCK_UPDATES }: LiveTickerProps) {
    // 데이터 4배수 복제
    const duplicatedData = [...updates, ...updates, ...updates, ...updates];

    return (
        <div className="relative flex w-full overflow-hidden bg-secondary/20 py-2.5 border-y border-border/50 backdrop-blur-sm select-none group">

            {/* Side Fade Effect */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            {/* [FIX] 'shrink-0' 클래스 추가
        - flex 컨테이너 안에서 자식이 찌그러지는 것을 방지합니다.
        - 이제 모바일에서도 PC와 동일한 물리적 길이(약 5000px)를 유지하므로 속도가 동일하게 빠릅니다.
      */}
            <div className="flex w-max min-w-full shrink-0 animate-infinite-scroll group-hover:[animation-play-state:paused] will-change-transform">
                {duplicatedData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 mx-8 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <span className="font-bold text-foreground/90">{item.user}</span>
                        <span className={cn(
                            "text-[10px] px-2 py-0.5 rounded-full border font-bold",
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
                        <span className="text-xs opacity-80">{item.action}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}