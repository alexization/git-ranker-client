"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Home, RefreshCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card } from "@/shared/components/card"
import Link from "next/link"
import { useI18n } from "@/shared/providers/locale-provider"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useI18n()

  useEffect(() => {
    // Log error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("Application Error:", error)
    }
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        <Card className="relative overflow-hidden rounded-[2.5rem] border-2 border-dashed border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-xl p-10 text-center shadow-2xl">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6"
          >
            <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold mb-3 text-foreground">
              {t("error-page.title")}
            </h1>
            <p className="text-muted-foreground mb-2 text-[15px] leading-relaxed">
              {t("error-page.description.line1")}<br />
              {t("error-page.description.line2")}
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-red-100/50 dark:bg-red-900/20 rounded-xl text-left overflow-hidden">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-8"
          >
            <Button
              onClick={reset}
              variant="outline"
              className="rounded-2xl h-12 px-6 font-medium border-border hover:bg-accent/50 active:scale-[0.98] transition-all"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              {t("common.retry")}
            </Button>
            <Button
              asChild
              className="rounded-2xl h-12 px-6 font-medium bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                {t("common.go-home")}
              </Link>
            </Button>
          </motion.div>

          {/* Decorative gradient orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        </Card>
      </motion.div>
    </div>
  )
}
