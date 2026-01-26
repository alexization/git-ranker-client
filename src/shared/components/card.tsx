import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            // Glassmorphism with three-layer shadow for depth (Toss/Apple style)
            "rounded-3xl border border-white/20 bg-white/60 dark:bg-black/20 backdrop-blur-xl transition-all hover:bg-white/80 dark:hover:bg-black/30",
            // Three-layer shadow: subtle ambient + medium diffuse + soft spread
            "shadow-[0_1px_2px_rgba(0,0,0,0.05),0_4px_8px_rgba(0,0,0,0.04),0_12px_24px_rgba(0,0,0,0.03)]",
            "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.15),0_12px_24px_rgba(0,0,0,0.1)]",
            // Hover: lift with enhanced shadow
            "hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_16px_rgba(0,0,0,0.05),0_20px_40px_rgba(0,0,0,0.04)]",
            "dark:hover:shadow-[0_2px_4px_rgba(0,0,0,0.25),0_8px_16px_rgba(0,0,0,0.2),0_20px_40px_rgba(0,0,0,0.15)]",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-bold leading-none tracking-tight text-foreground/90",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground/80 font-medium", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }