"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useSpring, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type SpotlightProps = {
    className?: string;
    fill?: string;
};

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            className={cn(
                "pointer-events-none absolute -inset-px overflow-hidden opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500",
                className
            )}
            onMouseMove={handleMouseMove}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) =>
                            `radial-gradient(600px circle at ${x}px ${y}px, ${fill}10, transparent 40%)`
                    ),
                }}
            />
        </div>
    );
}

// 전체 화면 배경용 Spotlight (HeroSection 전용)
export function HeroSpotlight() {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const div = divRef.current;
        const rect = div.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className="absolute inset-0 z-0 overflow-hidden"
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(120, 119, 198, 0.15), transparent 40%)`,
                }}
            />
        </div>
    );
}