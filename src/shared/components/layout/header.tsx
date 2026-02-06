"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, Flame, Loader2, DoorOpen, Settings } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore, useAuthHydrated } from "@/features/auth/store/auth-store"
import { useLogout } from "@/features/auth/api/auth-service"
import { Button } from "@/shared/components/button"
import { ThemeToggle } from "@/shared/components/theme-toggle"
import { GithubIcon } from "@/shared/components/icons/github-icon"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/avatar"
import { useState } from "react"
import { cn } from "@/shared/lib/utils"

export function Header() {
    const { user, isAuthenticated } = useAuthStore()
    const hydrated = useAuthHydrated()
    const logoutMutation = useLogout()
    const router = useRouter()
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const pathname = usePathname()

    const handleLogin = () => {
        window.location.href = '/login'
    }

    const handleLogoutClick = () => {
        setShowLogoutDialog(true)
    }

    const handleLogoutConfirm = async () => {
        await logoutMutation.mutateAsync()
        setShowLogoutDialog(false)
        router.push('/')
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-7xl items-center justify-between px-6">

                {/* Left Side: Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <GithubIcon className="h-6 w-6 text-foreground" />
                        <span className="text-base font-bold tracking-tight text-foreground">
              Git Ranker
            </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/ranking"
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-1.5",
                                pathname === "/ranking" ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            <Flame className="h-4 w-4" />
                            Ranking
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/ranking"
                        className="md:hidden p-2 text-muted-foreground hover:text-primary"
                        aria-label="랭킹 페이지로 이동"
                    >
                        <Flame className="h-5 w-5" />
                    </Link>

                    <ThemeToggle />

                    {!hydrated ? (
                        <div className="w-8 h-8" />
                    ) : isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-3 transition-all duration-200 hover:bg-secondary/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                    <Avatar className="h-8 w-8 ring-2 ring-border/50">
                                        <AvatarImage src={user.profileImage} alt={user.username} />
                                        <AvatarFallback className="text-xs font-medium">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[100px] truncate">
                                        {user.username}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-72 p-0 rounded-2xl shadow-xl border-border/50 overflow-hidden"
                                align="end"
                                sideOffset={8}
                                forceMount
                            >
                                {/* User Info Section */}
                                <div className="p-4 bg-gradient-to-br from-secondary/50 to-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                                            <AvatarImage src={user.profileImage} alt={user.username} />
                                            <AvatarFallback className="text-sm font-semibold">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[15px] font-semibold text-foreground truncate">{user.username}</p>
                                            <p className="text-[13px] text-muted-foreground truncate mt-0.5">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Items */}
                                <div className="p-2 space-y-1">
                                    <DropdownMenuItem asChild className="rounded-xl h-11 px-3 cursor-pointer transition-colors duration-150">
                                        <Link href={`/users/${user.username}`} className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                                <User className="h-4 w-4 text-primary" />
                                            </div>
                                            <span className="text-[14px] font-medium">내 프로필</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild className="rounded-xl h-11 px-3 cursor-pointer transition-colors duration-150">
                                        <Link href="/settings" className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                                <Settings className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            <span className="text-[14px] font-medium">설정</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                {/* Logout Section */}
                                <div className="p-2 pt-0">
                                    <div className="h-px bg-border/60 mx-2 mb-2" />
                                    <DropdownMenuItem
                                        onClick={handleLogoutClick}
                                        className="rounded-xl h-11 px-3 cursor-pointer transition-colors duration-150 text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/10">
                                                <LogOut className="h-4 w-4" />
                                            </div>
                                            <span className="text-[14px] font-medium">로그아웃</span>
                                        </div>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        // [FIX] GitHub 공식 컬러 적용 + Outline 스타일로 위화감 제거
                        <Button
                            onClick={handleLogin}
                            variant="outline"
                            className="gap-2 border-primary/20 hover:bg-secondary active:scale-95 transition-all"
                        >
                            <GithubIcon className="h-4 w-4" />
                            로그인
                        </Button>
                    )}
                </div>
            </div>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="max-w-[340px] p-6">
                    <AlertDialogHeader className="space-y-4">
                        {/* Animated Icon */}
                        <motion.div
                            className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                        >
                            <motion.div
                                initial={{ x: 0 }}
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                            >
                                <DoorOpen className="w-8 h-8 text-red-500 dark:text-red-400" />
                            </motion.div>
                        </motion.div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-xl font-bold">
                                로그아웃 할까요?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[15px] leading-relaxed">
                                다음에 다시 로그인하면<br />
                                언제든지 돌아올 수 있어요
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-2">
                        <AlertDialogCancel
                            disabled={logoutMutation.isPending}
                            className="flex-1 sm:flex-1"
                        >
                            취소
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogoutConfirm}
                            className="flex-1 sm:flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                            disabled={logoutMutation.isPending}
                        >
                            {logoutMutation.isPending ? (
                                <>
                                    {/* Wrap SVG in div for hardware-accelerated animation */}
                                    <div className="mr-2 animate-spin">
                                        <Loader2 className="h-4 w-4" />
                                    </div>
                                    로그아웃 중...
                                </>
                            ) : (
                                '로그아웃'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    )
}