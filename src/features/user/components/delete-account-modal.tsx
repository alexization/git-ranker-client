"use client"

import { motion } from "framer-motion"
import { AlertTriangle, Loader2, X } from "lucide-react"
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
            <AlertDialogContent className="max-w-[400px] !p-0 overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-background/80 hover:bg-secondary transition-colors"
                    disabled={deleteAccountMutation.isPending}
                >
                    <X className="w-4 h-4 text-muted-foreground" />
                    <span className="sr-only">닫기</span>
                </button>

                {/* Header with gradient background */}
                <div className="relative px-5 pt-6 pb-4 bg-gradient-to-b from-red-50 to-transparent dark:from-red-950/30 dark:to-transparent">
                    <AlertDialogHeader className="space-y-3">
                        {/* Animated Warning Icon */}
                        <motion.div
                            className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center shadow-lg shadow-red-500/10"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                        >
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: [0, -8, 8, -8, 8, 0] }}
                                transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
                            >
                                <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                            </motion.div>
                        </motion.div>

                        <div className="space-y-1.5 text-center">
                            <AlertDialogTitle className="text-lg font-bold text-foreground">
                                정말 탈퇴하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                                회원 정보를 삭제하면 다음 데이터가<br />
                                모두 <span className="font-semibold text-red-500 dark:text-red-400">영구적으로 삭제</span>됩니다
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                </div>

                {/* Data list */}
                <div className="px-5 pb-3">
                    <div className="bg-secondary/50 rounded-xl p-3 border border-border/50">
                        <ul className="space-y-1.5">
                            {deletedDataList.map((item, index) => (
                                <motion.li
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
                                    className="flex items-center gap-2.5 text-[13px] text-muted-foreground"
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
                    className="mx-5 mb-3 px-3 py-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50"
                >
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 text-center flex items-center justify-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        이 작업은 되돌릴 수 없습니다
                    </p>
                </motion.div>

                {/* Footer - 취소 왼쪽, 탈퇴 오른쪽 + safe-area 하단 패딩 */}
                <AlertDialogFooter className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-1">
                    <AlertDialogCancel
                        disabled={deleteAccountMutation.isPending}
                        className="flex-1 min-w-0 h-10"
                    >
                        취소
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="flex-1 min-w-0 h-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
                        disabled={deleteAccountMutation.isPending}
                    >
                        {deleteAccountMutation.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
