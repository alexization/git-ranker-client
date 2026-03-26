"use client";

import { useMemo, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type HeatmapBlock = {
    colorClass: string
    delay: number
    duration: number
    opacity: number
}

function subscribeToWindowResize(onStoreChange: () => void) {
    if (typeof window === "undefined") {
        return () => {}
    }

    let frameId: number | null = null
    const throttledHandler = () => {
        if (frameId !== null) {
            return
        }

        frameId = window.requestAnimationFrame(() => {
            frameId = null
            onStoreChange()
        })
    }

    window.addEventListener("resize", throttledHandler)
    return () => {
        window.removeEventListener("resize", throttledHandler)

        if (frameId !== null) {
            window.cancelAnimationFrame(frameId)
        }
    }
}

function getWindowWidth(): number {
    if (typeof window === "undefined") {
        return 1200
    }

    return window.innerWidth
}

function seededValue(seed: number): number {
    const normalized = Math.sin(seed) * 10000
    return normalized - Math.floor(normalized)
}

function buildBlocks(width: number): HeatmapBlock[] {
    const blockSize = width < 768 ? 30 : 40
    const cols = Math.ceil(width / blockSize)
    const rows = 12
    const total = cols * rows

    return Array.from({ length: total }, (_, index) => {
        const activeSeed = seededValue(index + width)
        const opacitySeed = seededValue(index * 1.7 + width)
        const durationSeed = seededValue(index * 2.3 + width)
        const delaySeed = seededValue(index * 3.1 + width)
        const colorSeed = seededValue(index * 4.9 + width)
        const isActive = activeSeed > 0.8

        return {
            opacity: isActive ? opacitySeed * 0.35 + 0.15 : 0.03,
            duration: durationSeed * 2 + 2,
            delay: delaySeed * 5,
            colorClass: colorSeed > 0.6
                ? "bg-primary dark:bg-blue-500"
                : "bg-emerald-500 dark:bg-emerald-400",
        }
    })
}

export function HeatmapBackground() {
    const width = useSyncExternalStore(subscribeToWindowResize, getWindowWidth, () => 1200)
    const blocks = useMemo(() => buildBlocks(width), [width])

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div
                className="flex flex-wrap gap-2 p-4 justify-center [mask-image:linear-gradient(to_bottom,black_30%,transparent_90%)]"
                style={{ width: '110%', marginLeft: '-5%' }}
            >
                {blocks.map((block, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: block.opacity }}
                        transition={{
                            duration: block.duration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: block.delay,
                            ease: "easeInOut"
                        }}
                        className={cn(
                            "rounded-sm transition-colors duration-700",
                            "w-6 h-6 md:w-8 md:h-8",
                            block.colorClass,
                            // [Visual] 다크 모드에서만 살짝 빛나는 효과(Glow) 추가하여 시인성 보강
                            "dark:shadow-[0_0_8px_-2px_rgba(255,255,255,0.1)]"
                        )}
                    />
                ))}
            </div>

            {/* 배경 블렌딩 레이어 */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
    );
}
