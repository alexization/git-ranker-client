"use client"

import Link from "next/link"
import { Github, LogOut, User } from "lucide-react"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { Button } from "@/shared/components/button"
import { ThemeToggle } from "@/shared/components/theme-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { useEffect, useState } from "react"

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Hydration mismatch 방지
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = () => {
    // 로그인 페이지로 이동
    window.location.href = '/login'
  }

  const handleLogout = () => {
      // TODO: Call Logout API
      logout();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Github className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              Git Ranker
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="https://github.com/alexization/git-ranker"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              사용 가이드
            </Link>
          </nav>
        </div>
        
        {/* Mobile Logo */}
        <div className="flex flex-1 md:hidden">
            <Link href="/" className="flex items-center space-x-2">
                <Github className="h-6 w-6" />
                <span className="font-bold">Git Ranker</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
          
          {mounted && isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImage} alt={user.username} />
                    <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/users/${user.username}`}>
                        <User className="mr-2 h-4 w-4" />
                        <span>내 프로필</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLogin} size="sm">
                <Github className="mr-2 h-4 w-4" />
                로그인
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
