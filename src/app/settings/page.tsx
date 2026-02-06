"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, User, Trash2, ChevronRight, Shield } from "lucide-react"
import { useAuthStore, useAuthHydrated } from "@/features/auth/store/auth-store"
import { DeleteAccountModal } from "@/features/user/components/delete-account-modal"
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/avatar"
import { Button } from "@/shared/components/button"
import { Card } from "@/shared/components/card"
import { Skeleton } from "@/shared/components/skeleton"

export default function SettingsPage() {
    const router = useRouter()
    const { user, isAuthenticated } = useAuthStore()
    const hydrated = useAuthHydrated()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    useEffect(() => {
        if (hydrated && !isAuthenticated) {
            router.push('/login')
        }
    }, [hydrated, isAuthenticated, router])

    // Loading state
    if (!hydrated) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container max-w-2xl py-8 px-4">
                    <Skeleton className="h-10 w-24 mb-8" />
                    <Skeleton className="h-8 w-16 mb-6" />
                    <Skeleton className="h-32 rounded-2xl mb-8" />
                    <Skeleton className="h-8 w-24 mb-4" />
                    <Skeleton className="h-24 rounded-2xl" />
                </div>
            </div>
        )
    }

    // Not authenticated
    if (!isAuthenticated || !user) {
        return null
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="container max-w-2xl py-8 px-4">
                {/* Back button */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="gap-2 text-muted-foreground hover:text-foreground pl-0 -ml-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        뒤로가기
                    </Button>
                </motion.div>

                {/* Page title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="text-2xl font-bold text-foreground mb-8"
                >
                    설정
                </motion.h1>

                {/* Account section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mb-10"
                >
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        계정
                    </h2>
                    <Card className="p-0 overflow-hidden hover:bg-white/60 dark:hover:bg-black/20">
                        <div className="p-5">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 ring-2 ring-border/50 shadow-md">
                                    <AvatarImage src={user.profileImage} alt={user.username} />
                                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                                        {user.username.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[17px] font-semibold text-foreground truncate">
                                        {user.username}
                                    </p>
                                    <p className="text-[14px] text-muted-foreground truncate mt-0.5">
                                        {user.email || 'GitHub 계정으로 로그인됨'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.section>

                {/* Account management section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        계정 관리
                    </h2>
                    <Card className="p-0 overflow-hidden border-red-200/50 dark:border-red-800/30 hover:border-red-300 dark:hover:border-red-700/50 transition-colors">
                        <button
                            onClick={() => setDeleteModalOpen(true)}
                            className="w-full p-5 flex items-center gap-4 text-left hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors group"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                                <Trash2 className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[16px] font-semibold text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                    탈퇴하기
                                </p>
                                <p className="text-[13px] text-muted-foreground mt-0.5">
                                    계정과 모든 데이터가 영구적으로 삭제됩니다
                                </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                        </button>
                    </Card>
                </motion.section>
            </div>

            {/* Delete Account Modal */}
            <DeleteAccountModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
            />
        </div>
    )
}
