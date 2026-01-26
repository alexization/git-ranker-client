"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Loader2 } from "lucide-react"
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
import { useDeleteAccount } from "@/features/user/api/user-service"
import { useAuthStore } from "@/features/auth/store/auth-store"
import { getErrorMessage } from "@/shared/lib/api-client"
import { toast } from "sonner"

interface DeleteAccountModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const deletedDataList = [
    "사용자 정보",
    "일별 활동 증감 데이터",
    "Commit 기록",
    "Pull Request 기록",
    "Code Review 기록",
    "Issue 기록",
    "랭킹 및 티어 정보",
]

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
    const deleteAccountMutation = useDeleteAccount()
    const logout = useAuthStore((state) => state.logout)

    const handleDeleteConfirm = async () => {
        try {
            await deleteAccountMutation.mutateAsync()
            logout()
            onOpenChange(false)
            window.location.href = '/login'
        } catch (error) {
            toast.error(getErrorMessage(error, '회원탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'))
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="max-w-[400px] p-0 overflow-hidden">
                {/* Header with gradient background */}
                <div className="relative px-6 pt-8 pb-6 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/30 dark:to-transparent">
                    <AlertDialogHeader className="space-y-4">
                        {/* Animated Warning Icon */}
                        <motion.div
                            className="mx-auto w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shadow-lg shadow-red-500/10"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                            >
                                <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
                            </motion.div>
                        </motion.div>

                        <div className="space-y-2 text-center">
                            <AlertDialogTitle className="text-xl font-bold text-foreground">
                                정말 탈퇴하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-[15px] leading-relaxed text-muted-foreground">
                                회원 정보를 삭제하면 다음 데이터가<br />
                                모두 <span className="font-semibold text-red-500 dark:text-red-400">영구적으로 삭제</span>됩니다
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                </div>

                {/* Data list */}
                <div className="px-6 pb-4">
                    <div className="bg-secondary/50 rounded-2xl p-4 border border-border/50">
                        <ul className="space-y-2">
                            {deletedDataList.map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                                    className="flex items-center gap-3 text-[14px] text-muted-foreground"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 dark:bg-red-500 shrink-0" />
                                    {item}
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Warning notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                    className="mx-6 mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"
                >
                    <p className="text-[13px] font-medium text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        이 작업은 되돌릴 수 없습니다
                    </p>
                </motion.div>

                {/* Footer */}
                <AlertDialogFooter className="px-6 pb-6 pt-2">
                    <AlertDialogCancel
                        disabled={deleteAccountMutation.isPending}
                        className="flex-1 sm:flex-1"
                    >
                        취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="flex-1 sm:flex-1 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                        disabled={deleteAccountMutation.isPending}
                    >
                        {deleteAccountMutation.isPending ? (
                            <>
                                <div className="mr-2 animate-spin">
                                    <Loader2 className="h-4 w-4" />
                                </div>
                                탈퇴 중...
                            </>
                        ) : (
                            '탈퇴하기'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
