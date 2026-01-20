"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Zap, Rocket, GitCommit, X, ScrollText, Shield } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/card"
import { cn } from "@/shared/lib/utils"
import { LiveTicker, TickerUpdate } from "@/shared/components/ui/live-ticker"
import { GithubIcon } from "@/shared/components/icons/github-icon"

// [Data] Action 필드 제거 (User + Tier)
const MOCK_LIVE_UPDATES: TickerUpdate[] = [
    { user: "new_challenger", tier: "CHALLENGER" },
    { user: "frontend_master", tier: "DIAMOND" },
    { user: "backend_pro", tier: "PLATINUM" },
    { user: "opensource_L", tier: "GOLD" },
    { user: "junior_dev", tier: "SILVER" },
    { user: "fullstack_JS", tier: "EMERALD" },
];

// [Content] 이용약관
const TERMS_OF_SERVICE = `
제1조 (목적)
본 약관은 Git Ranker(이하 "서비스")가 제공하는 개발자 활동 분석 및 랭킹 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.

제2조 (서비스의 내용)
1. 서비스는 GitHub 계정 연동을 통해 사용자의 공개된 활동 데이터를 분석합니다.
2. 분석 항목에는 커밋, Pull Request, 이슈, 코드 리뷰 등이 포함됩니다.
3. 분석 결과를 바탕으로 티어(등급)를 산정하고 전체 사용자 중 순위를 제공합니다.

제3조 (이용자의 의무)
1. 이용자는 타인의 GitHub 계정을 도용하여 서비스를 이용할 수 없습니다.
2. 서비스를 통해 제공받은 정보를 허위로 변조하거나 부정하게 사용할 수 없습니다.
3. 서비스의 정상적인 운영을 방해하는 행위를 할 수 없습니다.

제4조 (서비스 이용의 제한)
1. 다음 각 호에 해당하는 경우 서비스 이용이 제한될 수 있습니다:
   - 타인의 명예를 손상시키거나 불이익을 주는 행위
   - 서비스의 안정적 운영을 방해하는 행위
   - 기타 관련 법령에 위배되는 행위

제5조 (면책조항)
1. 서비스는 GitHub API를 통해 수집된 공개 데이터만을 활용합니다.
2. 데이터 분석 결과는 참고용이며, 실제 개발 능력을 절대적으로 평가하지 않습니다.
3. GitHub API 정책 변경 등 외부 요인으로 인한 서비스 중단에 대해 책임지지 않습니다.

제6조 (약관의 변경)
1. 본 약관은 서비스 운영상 필요한 경우 변경될 수 있습니다.
2. 변경된 약관은 서비스 내 공지를 통해 효력이 발생합니다.
`;

// [Content] 개인정보처리방침
const PRIVACY_POLICY = `
1. 개인정보의 수집 및 이용 목적
Git Ranker는 다음의 목적을 위해 개인정보를 수집 및 이용합니다:
- 서비스 제공 및 회원 식별
- GitHub 활동 데이터 분석 및 티어 산정
- 서비스 개선 및 통계 분석

2. 수집하는 개인정보 항목
GitHub OAuth를 통해 다음 정보를 수집합니다:
- GitHub 사용자명 (username)
- 프로필 이미지 URL
- 이메일 주소 (선택적, GitHub 설정에 따름)
- 공개된 저장소 활동 내역 (커밋, PR, 이슈, 리뷰 등)

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 보유하며, 탈퇴 요청 시 즉시 파기합니다.
- 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.

4. 개인정보의 제3자 제공
- Git Ranker는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
- 단, 법령에 의한 요청이 있는 경우는 예외로 합니다.

5. 개인정보의 파기 절차 및 방법
- 회원 탈퇴 시 수집된 개인정보는 지체 없이 파기됩니다.
- 전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제합니다.

6. 이용자의 권리
이용자는 언제든지 다음의 권리를 행사할 수 있습니다:
- 개인정보 열람 요청
- 개인정보 정정 요청
- 개인정보 삭제 요청 (회원 탈퇴)
- 개인정보 처리 정지 요청

7. 개인정보 보호책임자
- 서비스 관련 개인정보 문의는 GitHub Issues를 통해 접수받습니다.

8. 개인정보 처리방침의 변경
- 본 방침은 시행일로부터 적용되며, 변경 시 서비스 내 공지합니다.
`;

type ModalType = "terms" | "privacy" | null;

export default function LoginPage() {
    const [openModal, setOpenModal] = useState<ModalType>(null)

    const handleGithubLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`
    }

    const containerVariants = {
        hidden: {opacity: 0, scale: 0.95},
        visible: {
            opacity: 1, scale: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0}
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
        exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
    }

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    }

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
                <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-[100px] animate-pulse"/>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse delay-1000"/>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-md"
                >
                    <Card className="border-white/20 bg-white/70 dark:bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="text-center space-y-2 pb-6 pt-10">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                                className="mx-auto mb-4"
                            >
                                <div className="w-20 h-20 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                                    <motion.div
                                        initial={{ rotate: -45, y: 0 }}
                                        animate={{
                                            rotate: -45,
                                            y: [0, -6, 0]
                                        }}
                                        transition={{
                                            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                                        }}
                                    >
                                        <Rocket className="w-10 h-10 text-primary" />
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                    Check Your Tier
                                </CardTitle>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <CardDescription className="text-base font-medium leading-relaxed">
                                    내 깃허브 활동은 상위 몇 %일까요?<br/>
                                    <span className="text-primary font-bold">3초</span>만에 분석 결과를 확인하세요.
                                </CardDescription>
                            </motion.div>
                        </CardHeader>

                        <CardContent className="space-y-6 px-0 pb-2">
                            {/* LiveTicker: 유저와 티어만 깔끔하게 노출 */}
                            <motion.div variants={itemVariants} className="relative w-full">
                                <div className="opacity-90 hover:opacity-100 transition-opacity">
                                    <LiveTicker updates={MOCK_LIVE_UPDATES} />
                                </div>
                            </motion.div>

                            <div className="px-8 space-y-3">
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                                        <GitCommit className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground">활동 정밀 분석</span>
                                        <span className="text-xs text-muted-foreground">커밋, PR, 리뷰 등 기여도 기반 산정</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/50 hover:bg-secondary/60 transition-colors">
                                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-foreground">실시간 랭킹</span>
                                        <span className="text-xs text-muted-foreground">전체 개발자 중 나의 전투력 순위</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 pb-10 px-8 pt-4">
                            <motion.div variants={itemVariants} className="w-full">
                                <Button
                                    className={cn(
                                        "w-full h-14 text-[15px] font-bold rounded-xl shadow-xl transition-all active:scale-[0.98] relative overflow-hidden group",
                                        "bg-[#24292F] hover:bg-[#24292F]/90 text-white",
                                        "dark:bg-white dark:text-[#24292F] dark:hover:bg-gray-100"
                                    )}
                                    onClick={handleGithubLogin}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                                    <GithubIcon className="mr-2 h-5 w-5" />
                                    GitHub으로 시작하기
                                </Button>
                            </motion.div>

                            <motion.div variants={itemVariants} className="text-center">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    로그인 시{" "}
                                    <button
                                        onClick={() => setOpenModal("terms")}
                                        className="text-primary font-semibold hover:underline underline-offset-2 transition-colors"
                                    >
                                        이용약관
                                    </button>
                                    {" "}및{" "}
                                    <button
                                        onClick={() => setOpenModal("privacy")}
                                        className="text-primary font-semibold hover:underline underline-offset-2 transition-colors"
                                    >
                                        개인정보처리방침
                                    </button>
                                    에 동의하게 됩니다.
                                </p>
                            </motion.div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {openModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Backdrop */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setOpenModal(null)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="relative w-full max-w-lg max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "p-2 rounded-xl",
                                        openModal === "terms"
                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                                    )}>
                                        {openModal === "terms" ? (
                                            <ScrollText className="w-5 h-5" />
                                        ) : (
                                            <Shield className="w-5 h-5" />
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold">
                                        {openModal === "terms" ? "이용약관" : "개인정보처리방침"}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setOpenModal(null)}
                                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted-foreground bg-transparent p-0 m-0">
                                        {openModal === "terms" ? TERMS_OF_SERVICE.trim() : PRIVACY_POLICY.trim()}
                                    </pre>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="sticky bottom-0 px-6 py-4 bg-background/95 backdrop-blur-sm border-t border-border">
                                <Button
                                    onClick={() => setOpenModal(null)}
                                    className="w-full h-11 font-semibold rounded-xl"
                                >
                                    확인
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
