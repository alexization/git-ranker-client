"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { useThrottledCallback } from "@/shared/hooks/use-throttle";

type SpotlightProps = {
    className?: string;
    fill?: string;
};

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
    const rectRef = useRef<DOMRect | null>(null);

    // Lower stiffness for smoother, less CPU-intensive animation
    const mouseX = useSpring(0, { stiffness: 300, damping: 50 });
    const mouseY = useSpring(0, { stiffness: 300, damping: 50 });

    // Throttle to ~30fps for non-critical visual effect
    const handleMouseMove = useThrottledCallback(
        (e: React.MouseEvent) => {
            const target = e.currentTarget as HTMLElement;
            // Cache rect to avoid layout thrashing
            if (!rectRef.current) {
                rectRef.current = target.getBoundingClientRect();
            }
            mouseX.set(e.clientX - rectRef.current.left);
            mouseY.set(e.clientY - rectRef.current.top);
        },
        32 // ~30fps
    );

    const handleMouseLeave = useCallback(() => {
        rectRef.current = null; // Invalidate cache on leave
    }, []);

    return (
        <div
            className={cn(
                "pointer-events-none absolute -inset-px overflow-hidden opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-500",
                className
            )}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
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
    const rectRef = useRef<DOMRect | null>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    // Throttle to ~30fps - spotlight effect doesn't need 60fps precision
    const handleMouseMove = useThrottledCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!divRef.current) return;
            // Cache rect to avoid layout thrashing on every move
            if (!rectRef.current) {
                rectRef.current = divRef.current.getBoundingClientRect();
            }
            setPosition({
                x: e.clientX - rectRef.current.left,
                y: e.clientY - rectRef.current.top
            });
        },
        32 // ~30fps
    );

    const handleMouseEnter = useCallback(() => {
        setOpacity(1);
        // Refresh rect on enter in case of scroll/resize
        rectRef.current = null;
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpacity(0);
        rectRef.current = null;
    }, []);

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
