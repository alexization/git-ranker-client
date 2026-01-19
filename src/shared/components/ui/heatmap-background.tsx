"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export function HeatmapBackground() {
    const [blocks, setBlocks] = useState<{ opacity: number; colorClass: string }[]>([]);

    useEffect(() => {
        const width = typeof window !== "undefined" ? window.innerWidth : 1200;
        const blockSize = width < 768 ? 30 : 40;
        const cols = Math.ceil(width / blockSize);
        const rows = 12;
        const total = cols * rows;

        const newBlocks = Array.from({ length: total }).map(() => {
            const isActive = Math.random() > 0.8; // 20% 활성 확률 유지
            return {
                // Opacity 범위: 0.15 ~ 0.5 (이 값만으로 투명도 조절)
                opacity: isActive ? Math.random() * 0.35 + 0.15 : 0.03,

                // [Fix] 다크 모드 클래스에서 불투명도(/40 등) 제거 및 더 밝은 컬러(400~500) 사용
                // 이제 Framer Motion의 opacity 값(최소 0.15)이 그대로 적용되어 훨씬 잘 보입니다.
                colorClass: Math.random() > 0.6
                    ? "bg-primary dark:bg-blue-500"
                    : "bg-emerald-500 dark:bg-emerald-400",
            };
        });

        setBlocks(newBlocks);
    }, []);

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
                            duration: Math.random() * 2 + 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: Math.random() * 5,
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