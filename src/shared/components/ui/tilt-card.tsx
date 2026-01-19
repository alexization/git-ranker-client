"use client"

import React, { useRef, useCallback } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/shared/lib/utils"
import { useThrottledCallback } from "@/shared/hooks/use-throttle"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    perspective?: number
}

export function TiltCard({ children, className, perspective = 1000 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)
    const rectRef = useRef<DOMRect | null>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Reduced stiffness for smoother, less CPU-intensive animation
    const mouseX = useSpring(x, { stiffness: 150, damping: 25 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 25 })

    // 2도 회전 (은은한 효과)
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2])

    // Throttle to ~30fps - tilt effect is subtle, doesn't need 60fps
    const handleMouseMove = useThrottledCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!ref.current) return

            // Cache rect to avoid layout thrashing
            if (!rectRef.current) {
                rectRef.current = ref.current.getBoundingClientRect()
            }

            const rect = rectRef.current
            const mouseXFromCenter = e.clientX - rect.left - rect.width / 2
            const mouseYFromCenter = e.clientY - rect.top - rect.height / 2
            x.set(mouseXFromCenter / rect.width)
            y.set(mouseYFromCenter / rect.height)
        },
        32 // ~30fps
    )

    const handleMouseLeave = useCallback(() => {
        x.set(0)
        y.set(0)
        rectRef.current = null // Invalidate cache on leave
    }, [x, y])

    const handleMouseEnter = useCallback(() => {
        // Refresh rect on enter in case of scroll/resize
        rectRef.current = null
    }, [])

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{ perspective }}
            className={cn("relative w-full h-full rounded-[2.5rem] overflow-visible", className)}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                }}
                className="w-full h-full transition-shadow duration-500 ease-out will-change-transform hover:shadow-xl rounded-[2.5rem]"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}
