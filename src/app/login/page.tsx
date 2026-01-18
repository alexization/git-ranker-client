"use client"

import {motion} from "framer-motion"
import { Activity, Github, ShieldCheck, Trophy } from "lucide-react"
import {Button} from "@/shared/components/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/shared/components/card"
import {Avatar, AvatarFallback, AvatarImage} from "@/shared/components/avatar"
import {cn} from "@/shared/lib/utils"

export default function LoginPage() {
    const handleGithubLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/github`
    }

    const containerVariants = {
        hidden: {opacity: 0, scale: 0.95}, visible: {
            opacity: 1, scale: 1, transition: {
                duration: 0.5, staggerChildren: 0.1,
            }
        }
    }

    const itemVariants = {
        hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0}
    }

    // 가상의 유저 아바타 데이터 (Social Proof용)
    const users = [{src: "https://github.com/shadcn.png", fallback: "CN"}, {
        src: "https://github.com/vercel.png",
        fallback: "VC"
    }, {src: "https://github.com/react.png", fallback: "RC"}, {
        src: "https://github.com/tailwindlabs.png",
        fallback: "TW"
    },]

    return (<div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden">
        {/* Dynamic Background - [FIX] 색감을 더 선명하게 조정 (opacity 20/10 -> 30/20) */}
        <div className="absolute inset-0 -z-10">
            <div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[100px] animate-pulse"/>
            <div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000"/>
        </div>

        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
        >
            <Card className="border-white/20 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center space-y-2 pb-8">
                    <motion.div variants={itemVariants}
                                className="mx-auto bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-primary"/>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardTitle
                            className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            Git Ranker 시작하기
                        </CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <CardDescription className="text-base">
                            당신의 개발 여정을 증명할 시간입니다.
                        </CardDescription>
                    </motion.div>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Value Props */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600">
                                <Trophy className="w-5 h-5"/>
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold block text-foreground">객관적인 실력 지표</span>
                                <span className="text-muted-foreground">내 코딩 실력을 티어로 확인하세요.</span>
                            </div>
                        </div>
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/50">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
                                <Activity className="w-5 h-5"/>
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold block text-foreground">성장 그래프 분석</span>
                                <span className="text-muted-foreground">활동 데이터를 시각화하여 보여줍니다.</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div variants={itemVariants} className="flex flex-col items-center gap-2">
                        <div className="flex -space-x-3">
                            {users.map((u, i) => (<Avatar key={i} className="border-2 border-background w-8 h-8">
                                <AvatarImage src={u.src}/>
                                <AvatarFallback>{u.fallback}</AvatarFallback>
                            </Avatar>))}
                            <div
                                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground">
                                +3k
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            이미 <span className="font-bold text-primary">3,000+</span>명의 개발자가 함께하고 있습니다.
                        </p>
                    </motion.div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4 pb-8">
                    <motion.div variants={itemVariants} className="w-full">
                        <Button
                            className={cn("w-full h-12 text-base font-bold shadow-lg transition-all active:scale-[0.98]", "bg-[#24292F] hover:bg-[#24292F]/90 text-white", // GitHub Brand Color
                                "dark:bg-white dark:text-[#24292F] dark:hover:bg-gray-100" // Dark mode inversion for better visibility
                            )}
                            onClick={handleGithubLogin}
                        >
                            <Github className="mr-2 h-5 w-5 fill-current"/>
                            GitHub로 계속하기
                        </Button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="text-center">
                        <p className="text-[10px] text-muted-foreground/60 px-4">
                            로그인 시 <span
                            className="underline decoration-muted-foreground/30 cursor-pointer hover:text-muted-foreground">이용약관</span> 및 <span
                            className="underline decoration-muted-foreground/30 cursor-pointer hover:text-muted-foreground">개인정보처리방침</span>에
                            동의하게 됩니다.
                            <br/>Git Ranker는 Public 데이터만 수집하며 코드는 저장하지 않습니다.
                        </p>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    </div>)
}