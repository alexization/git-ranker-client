"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/shared/lib/utils"

interface OptimizedAvatarProps {
  src?: string | null
  alt: string
  size?: number
  className?: string
  fallback?: React.ReactNode
  priority?: boolean
}

export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className,
  fallback,
  priority = false,
}: OptimizedAvatarProps) {
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false)
    setIsLoading(true)
  }, [src])

  const showFallback = !src || hasError

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
        className
      )}
      style={{ width: size, height: size }}
    >
      {showFallback ? (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-muted-foreground font-medium">
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse rounded-full" />
          )}
          <Image
            src={src}
            alt={alt}
            width={size}
            height={size}
            className={cn(
              "aspect-square h-full w-full object-cover transition-opacity duration-200",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true)
              setIsLoading(false)
            }}
            priority={priority}
            unoptimized={src.includes('githubusercontent.com')} // GitHub avatars already optimized
          />
        </>
      )}
    </div>
  )
}
