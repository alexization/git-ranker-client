"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, History, X, BookOpen, Sparkles, TrendingUp, ArrowRight } from "lucide-react"
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
  const [isFocused, setIsFocused] = useState(false) // Focus Mode State
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

  // Focus Mode Toggle Helper
  const handleFocus = () => {
    setOpen(true)
    setIsFocused(true)
  }

  const handleBlur = () => {
    // 클릭 이벤트가 발생할 시간을 주기 위해 지연 처리
    setTimeout(() => {
      setOpen(false)
      setIsFocused(false)
    }, 200)
  }

  const handleSearch = (username: string) => {
    if (!username.trim()) return
    addSearch(username)
    // 상태 초기화 후 이동
    setOpen(false)
    setIsFocused(false)
    setQuery("")
    setSelectedIndex(-1)
    inputRef.current?.blur() // 키보드 내리기
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
        setIsFocused(false)
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

        {/* --- [UX Enhancement] Focus Mode Backdrop --- */}
        {/* 검색창 Focus 시 배경을 어둡게 처리하여 시선을 집중시킴 */}
        <AnimatePresence>
          {isFocused && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                  onClick={() => {
                    setIsFocused(false)
                    setOpen(false)
                  }}
              />
          )}
        </AnimatePresence>

        <HeroSpotlight />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* z-index를 높여 Backdrop 위로 올라오게 함 */}
        <div className="container relative z-50 max-w-5xl px-6 flex flex-col items-center transition-all duration-500">

          {/* 상단 뱃지: Focus 시 자연스럽게 숨기거나 흐리게 처리 가능 (현재는 유지) */}
          <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("mb-6 transition-opacity duration-300", isFocused ? "opacity-20 blur-sm" : "opacity-100")}
          >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm hover:bg-primary/10 transition-colors cursor-default">
            <Sparkles className="h-3.5 w-3.5" />
            <span>GitHub 활동 분석 및 전투력 측정</span>
          </span>
          </motion.div>

          {/* 메인 타이틀: Focus 시 시각적 노이즈를 줄이기 위해 흐리게 처리 */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={cn("text-center transition-all duration-500", isFocused ? "opacity-10 blur-md scale-95" : "opacity-100 scale-100")}
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

          {/* --- Search Bar Container --- */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-2xl"
          >
            <div className="relative group">
              {/* Glow Effect (Animated) */}
              <div className={cn(
                  "absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 blur-xl transition-all duration-500",
                  isFocused ? "opacity-100 scale-105" : "opacity-0 group-hover:opacity-30"
              )}></div>

              <div className={cn(
                  "relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden",
                  isFocused
                      ? "bg-background border-primary/50 shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)] ring-4 ring-primary/10 scale-[1.02]"
                      : "bg-background/60 border-border/50 hover:bg-background/80 hover:border-primary/30 shadow-xl backdrop-blur-xl"
              )}>
                <div className="pl-5 pr-2">
                  <Search className={cn("h-6 w-6 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} />
                </div>
                <input
                    ref={inputRef}
                    className="h-16 w-full bg-transparent px-2 text-lg font-medium outline-none placeholder:text-muted-foreground/40 font-sans"
                    placeholder={`Search user... (e.g. ${placeholderText})`}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setSelectedIndex(-1)
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                />
                <div className="pr-2">
                  <Button
                      size="lg"
                      className={cn(
                          "h-12 gap-2 rounded-xl px-6 font-bold transition-all duration-300",
                          isFocused
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      )}
                      onClick={() => handleSearch(query)}
                  >
                    <span>검색</span>
                    {isFocused && <ArrowRight className="h-4 w-4 animate-in slide-in-from-left-2 fade-in duration-300" />}
                  </Button>
                </div>
              </div>

              {/* --- Recent Searches Dropdown --- */}
              <AnimatePresence>
                {open && mounted && recentSearches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full z-50 mt-4 w-full overflow-hidden rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/5"
                    >
                      <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span>Recent Searches</span>
                        <span className="opacity-50">ESC to close</span>
                      </div>
                      {recentSearches.map((term, index) => (
                          <motion.div
                              key={term}
                              layout
                              className={cn(
                                  "group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all cursor-pointer",
                                  selectedIndex === index
                                      ? "bg-primary/10 text-primary"
                                      : "hover:bg-muted/60"
                              )}
                              onClick={() => handleSearch(term)}
                              onMouseEnter={() => setSelectedIndex(index)}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={cn(
                                  "flex h-9 w-9 items-center justify-center rounded-lg transition-colors border",
                                  selectedIndex === index
                                      ? "bg-background border-primary/20 text-primary shadow-sm"
                                      : "bg-background border-border text-muted-foreground group-hover:border-primary/10"
                              )}>
                                <History className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-base tracking-tight">{term}</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive rounded-lg"
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

          {/* 하단 링크: Focus 시 숨김 */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 0 : 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={cn("mt-12 flex gap-4 transition-all", isFocused && "pointer-events-none")}
          >
            <a
                href="https://github.com/alexization/git-ranker"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full hover:bg-secondary/50"
            >
              <BookOpen className="h-4 w-4 transition-transform group-hover:scale-110" />
              <span>사용 가이드</span>
            </a>
            <span className="text-muted-foreground/20 py-2">|</span>
            <a
                href="/ranking"
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-4 py-2 rounded-full hover:bg-primary/5"
            >
              <TrendingUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              <span>전체 랭킹 보기</span>
            </a>
          </motion.div>
        </div>

        <div className={cn("absolute bottom-0 w-full transition-opacity duration-500", isFocused ? "opacity-20" : "opacity-100")}>
          <LiveTicker />
        </div>
      </section>
  )
}