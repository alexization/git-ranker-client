"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Search, History, X } from "lucide-react"
import { useSearchStore } from "../store/search-store"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/components/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/popover"
import { Button } from "@/shared/components/button"

export function HeroSection() {
  const router = useRouter()
  const { recentSearches, addSearch, removeSearch } = useSearchStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (username: string) => {
    if (!username.trim()) return
    addSearch(username)
    setOpen(false)
    router.push(`/users/${username}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query)
    }
  }

  return (
    <section className="relative flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50"></div>
      
      <div className="container max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-primary">Git Ranker</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            코드의 품질로 증명하는 개발자 전투력 측정기
            <br />
            당신의 기여도를 입체적으로 분석해드립니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto max-w-lg w-full relative"
        >
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="relative group">
                <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary to-blue-600 opacity-30 blur transition duration-1000 group-hover:opacity-70 group-hover:duration-200"></div>
                <div className="relative flex items-center w-full rounded-lg border bg-background px-3 h-14 shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring">
                  <Search className="mr-2 h-5 w-5 text-muted-foreground" />
                  <input
                    className="flex h-full w-full rounded-md bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                    placeholder="GitHub Username 입력..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onClick={() => setOpen(true)}
                  />
                  <Button 
                    size="sm" 
                    className="ml-2"
                    onClick={() => handleSearch(query)}
                  >
                    검색
                  </Button>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <Command>
                <CommandList>
                  {mounted && recentSearches.length > 0 && !query && (
                    <CommandGroup heading="최근 검색어">
                      {recentSearches.map((term) => (
                        <CommandItem
                          key={term}
                          value={term}
                          onSelect={() => handleSearch(term)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center">
                            <History className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>{term}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSearch(term)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {query && (
                    <CommandGroup heading="검색">
                       <CommandItem onSelect={() => handleSearch(query)} className="cursor-pointer">
                          <Search className="mr-2 h-4 w-4" />
                          <span>"{query}" 검색하기</span>
                       </CommandItem>
                    </CommandGroup>
                  )}
                  {mounted && recentSearches.length === 0 && !query && (
                     <CommandEmpty>최근 검색 기록이 없습니다.</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    </section>
  )
}
