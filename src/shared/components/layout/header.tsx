"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, Trophy, Loader2, DoorOpen } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { useLogout } from "@/features/auth/api/auth-service"
import { Button } from "@/shared/components/button"
import { ThemeToggle } from "@/shared/components/theme-toggle"
import { GithubIcon } from "@/shared/components/icons/github-icon"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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
import { useEffect, useState } from "react"
import { cn } from "@/shared/lib/utils"

export function Header() {
    const { user, isAuthenticated } = useAuthStore()
    const logoutMutation = useLogout()
    const router = useRouter()
    const [mounted, setMounted] = useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        setMounted(true)
    }, [])

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
                    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                        <GithubIcon className="h-8 w-8 text-foreground" />
                        <span className="text-xl font-bold tracking-tight text-foreground">
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
                            <Trophy className="h-4 w-4" />
                            Ranking
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <Link href="/ranking" className="md:hidden p-2 text-muted-foreground hover:text-primary">
                        <Trophy className="h-5 w-5" />
                    </Link>

                    <ThemeToggle />

                    {mounted && isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10 ring-2 ring-background">
                                        <AvatarImage src={user.profileImage} alt={user.username} />
                                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-semibold leading-none">{user.username}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={`/users/${user.username}`} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>내 프로필</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogoutClick} className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>로그아웃</span>
                                </DropdownMenuItem>
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
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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