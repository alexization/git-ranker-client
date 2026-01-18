"use client";

import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

const MOCK_UPDATES = [
    { user: "alexization", tier: "CHALLENGER", action: "Rank Up 🚀" },
    { user: "torvalds", tier: "DIAMOND", action: "New Commit 🔥" },
    { user: "shadcn", tier: "MASTER", action: "PR Merged ✨" },
    { user: "vercel", tier: "PLATINUM", action: "Score +50 📈" },
    { user: "react", tier: "GOLD", action: "Review Added 💬" },
];

export function LiveTicker() {
    return (
        <div className="relative flex w-full overflow-hidden bg-secondary/20 py-2 border-y border-border/50 backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

            <motion.div
                className="flex min-w-full shrink-0 gap-12 px-4"
                animate={{ x: ["0%", "-100%"] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...MOCK_UPDATES, ...MOCK_UPDATES, ...MOCK_UPDATES].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-medium text-muted-foreground whitespace-nowrap">
                        <span className="font-bold text-foreground">{item.user}</span>
                        <span className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-full border",
                            item.tier === 'CHALLENGER' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                item.tier === 'MASTER' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                                    "bg-primary/10 text-primary border-primary/20"
                        )}>
              {item.tier}
            </span>
                        <span className="text-xs">{item.action}</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}