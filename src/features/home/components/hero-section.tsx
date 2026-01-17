"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, History, X, BookOpen } from "lucide-react"
import { useSearchStore } from "../store/search-store"
import { Button } from "@/shared/components/button"
import { cn } from "@/shared/lib/utils"

export function HeroSection() {
  const router = useRouter()
  const { recentSearches, addSearch, removeSearch } = useSearchStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (username: string) => {
    if (!username.trim()) return
    addSearch(username)
    setOpen(false)
    setQuery("")
    setSelectedIndex(-1)
    router.push(`/users/${username}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter') {
        handleSearch(query)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < recentSearches.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSearch(recentSearches[selectedIndex])
        } else {
          handleSearch(query)
        }
        break
      case 'Escape':
        setOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && recentSearches[selectedIndex]) {
      setQuery(recentSearches[selectedIndex])
    }
  }, [selectedIndex, recentSearches])

  return (
    <section className="relative flex flex-col items-center justify-center py-16 md:py-24 lg:py-32">
      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"></div>

      <div className="container max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-foreground">Git Ranker</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            코드의 품질로 증명하는 개발자 전투력 측정기
          </p>

          {/* 사용 가이드 링크 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 flex justify-center"
          >
            <a
              href="https://github.com/alexization/git-ranker"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <BookOpen className="h-4 w-4" />
              <span>📖 사용 가이드</span>
            </a>
          </motion.div>
        </motion.div>

        {/* 검색창 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative mx-auto w-full max-w-2xl"
        >
          <div className="relative">
            <div className={cn(
              "relative flex items-center rounded-2xl border-2 bg-background shadow-lg transition-all duration-200",
              open ? "border-primary shadow-xl" : "border-border hover:border-primary/50"
            )}>
              <Search className="ml-5 h-5 w-5 text-muted-foreground" />
              <input
                ref={inputRef}
                className="h-16 w-full rounded-2xl bg-transparent px-4 text-lg outline-none placeholder:text-muted-foreground"
                placeholder="GitHub Username을 입력하세요..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(-1)
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 200)}
              />
              <Button
                size="lg"
                className="mr-2 gap-2 rounded-xl px-6"
                onClick={() => handleSearch(query)}
              >
                검색
              </Button>
            </div>

            {/* 최근 검색어 드롭다운 */}
            <AnimatePresence>
              {open && mounted && recentSearches.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full z-50 mt-2 w-full rounded-xl border bg-background p-2 shadow-xl"
                >
                  <div className="mb-2 px-3 py-2 text-xs font-semibold text-muted-foreground">
                    최근 검색어
                  </div>
                  {recentSearches.map((term, index) => (
                    <div
                      key={term}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors",
                        selectedIndex === index
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-secondary/50 cursor-pointer"
                      )}
                      onClick={() => handleSearch(term)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{term}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSearch(term)
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
