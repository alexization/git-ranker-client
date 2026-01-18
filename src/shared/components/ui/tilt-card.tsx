"use client"

import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/shared/lib/utils"

interface TiltCardProps {
    children: React.ReactNode
    className?: string
    perspective?: number
}

export function TiltCard({ children, className, perspective = 1000 }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // 부드러운 움직임
    const mouseX = useSpring(x, { stiffness: 200, damping: 20 })
    const mouseY = useSpring(y, { stiffness: 200, damping: 20 })

    // 2도 회전 (은은한 효과)
    const rotateX = useTransform(mouseY, [-0.5, 0.5], [2, -2])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-2, 2])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXFromCenter = e.clientX - rect.left - width / 2
        const mouseYFromCenter = e.clientY - rect.top - height / 2
        x.set(mouseXFromCenter / width)
        y.set(mouseYFromCenter / height)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective }}
            // [Fix] rounded와 overflow-hidden을 여기서 강제하여 직각 모서리 노출 방지
            className={cn("relative w-full h-full rounded-[2.5rem] overflow-visible", className)}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                }}
                // [Fix] 내부 컨텐츠도 둥글게 처리
                className="w-full h-full transition-all duration-500 ease-out will-change-transform hover:shadow-2xl rounded-[2.5rem]"
            >
                {children}
            </motion.div>
        </motion.div>
    )
}