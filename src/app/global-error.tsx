"use client"

import { AlertTriangle, Home, RefreshCcw } from "lucide-react"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <div className="relative overflow-hidden rounded-3xl border-2 border-dashed border-red-200 dark:border-red-800/50 bg-white dark:bg-gray-900 p-10 text-center shadow-2xl">
            {/* Icon */}
            <div className="mx-auto bg-red-100 dark:bg-red-900/30 w-20 h-20 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="h-10 w-10 text-red-500 dark:text-red-400" />
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
              예상치 못한 오류가 발생했습니다
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2 text-[15px] leading-relaxed">
              애플리케이션에 문제가 발생했습니다.<br />
              새로고침하거나 메인 페이지로 이동해 주세요.
            </p>

            {/* Error details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-left overflow-hidden">
                <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs font-mono text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-2xl h-12 px-6 font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.98] transition-all"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                다시 시도
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-2xl h-12 px-6 font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                <Home className="mr-2 h-4 w-4" />
                메인으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
