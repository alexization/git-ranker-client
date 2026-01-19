"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, History, X, BookOpen, TrendingUp, ArrowRight, User } from "lucide-react"
import { useSearchStore } from "../store/search-store"
import { Button } from "@/shared/components/button"
import { cn } from "@/shared/lib/utils"
// [Change] 기존 HeroSpotlight 대신 새로 만든 HeatmapBackground 사용
import { HeatmapBackground } from "@/shared/components/ui/heatmap-background"
import { useTypingEffect } from "@/shared/hooks/use-typing-effect"
import { LiveTicker } from "@/shared/components/ui/live-ticker"

// [Add] UX 개선을 위한 추천 검색어 (Quick Chips)
const FAMOUS_DEVS = [
  { name: "torvalds", label: "Linux Creator" },
  { name: "shadcn", label: "UI Master" },
  { name: "leerob", label: "Vercel VP" },
];

export function HeroSection() {
  const router = useRouter()
  const { recentSearches, addSearch, removeSearch } = useSearchStore()
  const [open, setOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")
  const [mounted, setMounted] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const placeholderText = useTypingEffect(
      ["torvalds", "shadcn", "leerob", "alexization"],
      100, 50, 2500
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleFocus = () => {
    setOpen(true)
    setIsFocused(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setOpen(false)
      setIsFocused(false)
    }, 200)
  }

  const handleSearch = (username: string) => {
    if (!username.trim()) return
    addSearch(username)
    setOpen(false)
    setIsFocused(false)
    setQuery("")
    setSelectedIndex(-1)
    inputRef.current?.blur()
    router.push(`/users/${username}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter') handleSearch(query)
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => prev < recentSearches.length - 1 ? prev + 1 : prev)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) handleSearch(recentSearches[selectedIndex])
        else handleSearch(query)
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

        {/* [Change] Focus Mode Backdrop - optimized: removed backdrop-blur for better perf on low-spec devices */}
        <AnimatePresence>
          {isFocused && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-background/90"
                  onClick={() => {
                    setIsFocused(false)
                    setOpen(false)
                  }}
              />
          )}
        </AnimatePresence>

        {/* [Change] 새로운 히트맵 배경 적용 */}
        <HeatmapBackground />

        <div className="container relative z-50 max-w-5xl px-6 flex flex-col items-center transition-all duration-500">

          {/* Main Title Area */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={cn("text-center mb-10", isFocused && "opacity-20 blur-sm scale-95")}
          >
            <h1 className="mb-6 text-6xl font-extrabold tracking-tight sm:text-7xl md:text-8xl">
            <span className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
              Git Ranker
            </span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground leading-relaxed">
              <span className="text-foreground font-bold">코드 품질</span>과 <span className="text-foreground font-bold">기여도</span>로 증명하는<br/>
              진정한 개발자 전투력 측정 서비스
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative mx-auto w-full max-w-2xl"
          >
            <div className={cn(
                "relative flex items-center rounded-2xl border transition-all duration-300 overflow-hidden bg-background/80 backdrop-blur-sm shadow-2xl",
                isFocused ? "border-primary ring-4 ring-primary/10 scale-105" : "border-border/50 hover:border-primary/50"
            )}>
              <div className="pl-5 pr-2">
                <Search className={cn("h-6 w-6 transition-colors", isFocused ? "text-primary" : "text-muted-foreground")} />
              </div>
              <input
                  ref={inputRef}
                  className="h-16 w-full bg-transparent px-2 text-lg font-medium outline-none placeholder:text-muted-foreground/40 font-sans"
                  placeholder={`GitHub 유저 검색... (e.g. ${placeholderText})`}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setSelectedIndex(-1)
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  autoComplete="off"
                  spellCheck="false"
              />
              <div className="pr-2">
                <Button
                    size="lg"
                    className="h-12 rounded-xl px-6 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                    onClick={() => handleSearch(query)}
                >
                  검색
                </Button>
              </div>
            </div>

            {/* Recent Searches Dropdown */}
            <AnimatePresence>
              {open && mounted && recentSearches.length > 0 && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-background/95 backdrop-blur-sm p-2 shadow-xl"
                  >
                    <div className="flex items-center justify-between px-3 py-2 text-[11px] font-bold text-muted-foreground uppercase">
                      <span>최근 검색 기록</span>
                    </div>
                    {recentSearches.map((term, index) => (
                        <div
                            key={term}
                            className={cn(
                                "group flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer transition-colors",
                                selectedIndex === index ? "bg-primary/10 text-primary" : "hover:bg-muted"
                            )}
                            onClick={() => handleSearch(term)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="flex items-center gap-3">
                            <History className="h-4 w-4 opacity-50" />
                            <span className="font-medium">{term}</span>
                          </div>
                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100"
                              onClick={(e) => { e.stopPropagation(); removeSearch(term); }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                    ))}
                  </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* [Add] Quick Chips (추천 검색어) - UX 강화 포인트 */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 0 : 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
          >
            <span className="text-xs font-semibold text-muted-foreground self-center mr-1">Trending:</span>
            {FAMOUS_DEVS.map((dev) => (
                <button
                    key={dev.name}
                    onClick={() => handleSearch(dev.name)}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all text-xs font-medium text-foreground/80 hover:text-primary active:scale-95"
                >
                  <User className="w-3 h-3 opacity-50" />
                  {dev.name}
                  {/* <span className="opacity-40 text-[10px]">· {dev.label}</span> */}
                </button>
            ))}
          </motion.div>

          {/* Footer Links */}
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isFocused ? 0 : 1 }}
              transition={{ delay: 0.4 }}
              className={cn("mt-12 flex gap-6", isFocused && "pointer-events-none")}
          >
            <a href="https://github.com/alexization/git-ranker" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-4 w-4" /> 사용 가이드
            </a>
            <a href="/ranking" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              <TrendingUp className="h-4 w-4" /> 전체 랭킹
            </a>
          </motion.div>
        </div>

        {/* Live Ticker */}
        <div className={cn("absolute bottom-0 w-full transition-opacity duration-500", isFocused ? "opacity-0" : "opacity-100")}>
          <LiveTicker />
        </div>
      </section>
  )
}