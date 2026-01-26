import { cn } from "@/shared/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Use shimmer animation instead of pulse (Toss/Apple style) */
  shimmer?: boolean
}

function Skeleton({
  className,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-md bg-muted relative overflow-hidden",
        shimmer ? "isolate" : "animate-pulse",
        className
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

export { Skeleton }
