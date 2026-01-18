"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, History, X, BookOpen, Sparkles, TrendingUp } from "lucide-react"
import { useSearchStore } from "../store/search-store"
import { Button } from "@/shared/components/button"
import { cn } from "@/shared/lib/utils"
import { HeroSpotlight } from "@/shared/components/ui/spotlight"
import { useTypingEffect } from "@/shared/hooks/use-typing-effect"
import { LiveTicker } from "@/shared/components/ui/live-ticker"

export function HeroSection() {
  const router = useRouter()
  const { recentSearches, addSearch, removeSearch } = useSearchStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  // Typing Effect
  const placeholderText = useTypingEffect(
      ["torvalds", "shadcn", "leerob", "alexization", "your_username"],
      100,
      50,
      2500
  )

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
        inputRef.current?.blur()
        break
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && recentSearches[selectedIndex]) {
      setQuery(recentSearches[selectedIndex])
    }
  }, [selectedIndex, recentSearches])

  return (
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden pt-10 pb-20">

        <HeroSpotlight />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        <div className="container relative z-10 max-w-5xl px-6 flex flex-col items-center">

          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
          >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 transition-colors cursor-default">
            <Sparkles className="h-3.5 w-3.5" />
            <span>GitHub 활동 분석 및 전투력 측정</span>
          </span>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
          >
            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Git Ranker
            </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed">
              단순 커밋 수는 잊으세요.<br className="hidden sm:block" />
              <span className="text-foreground font-semibold">코드 품질</span>과 <span className="text-foreground font-semibold">기여도</span>로 당신의 진짜 가치를 증명하세요.
            </p>
          </motion.div>

          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-2xl"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <div className={cn(
                  "relative flex items-center rounded-2xl border-2 bg-background/80 backdrop-blur-xl shadow-2xl transition-all duration-300",
                  open ? "border-primary ring-4 ring-primary/10" : "border-border hover:border-primary/50"
              )}>
                <Search className="ml-5 h-6 w-6 text-muted-foreground" />
                <input
                    ref={inputRef}
                    className="h-16 w-full rounded-2xl bg-transparent px-4 text-lg font-medium outline-none placeholder:text-muted-foreground/50"
                    placeholder={`Search user... (e.g. ${placeholderText})`}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelectedIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setTimeout(() => setOpen(false), 200)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <div className="pr-2">
                  <Button
                      size="lg"
                      className="h-12 gap-2 rounded-xl px-6 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                      onClick={() => handleSearch(query)}
                  >
                    {/* [FIX] 버튼 텍스트 변경: 분석하기 -> 검색 */}
                    검색
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {open && mounted && recentSearches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full z-50 mt-3 w-full overflow-hidden rounded-2xl border bg-background/95 backdrop-blur-md p-2 shadow-2xl ring-1 ring-black/5"
                    >
                      <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        <span>Recent Searches</span>
                        <span className="text-[10px]">Press ESC to close</span>
                      </div>
                      {recentSearches.map((term, index) => (
                          <motion.div
                              key={term}
                              layout
                              className={cn(
                                  "group flex items-center justify-between rounded-xl px-4 py-3 transition-all cursor-pointer",
                                  selectedIndex === index
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted"
                              )}
                              onClick={() => handleSearch(term)}
                              onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                  selectedIndex === index ? "bg-primary/20" : "bg-muted group-hover:bg-background"
                              )}>
                                <History className="h-4 w-4 opacity-70" />
                              </div>
                              <span className="font-semibold text-base">{term}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-lg"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeSearch(term)
                                }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                      ))}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex gap-4"
          >
            <a
                href="https://github.com/alexization/git-ranker"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>사용 가이드</span>
            </a>
            <span className="text-muted-foreground/30">|</span>
            <a
                href="/ranking"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <TrendingUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>전체 랭킹 보기</span>
            </a>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full">
          <LiveTicker />
        </div>
      </section>
  )
}