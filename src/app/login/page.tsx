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
Git Ranker 서비스 이용약관

시행일: 2026년 1월 21일

제1조 (목적)
본 약관은 Git Ranker(이하 "서비스")가 제공하는 GitHub 활동 분석 및 개발자 랭킹 서비스의 이용조건과 절차, 서비스 제공자와 이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
① "서비스"란 이용자의 GitHub 공개 활동 데이터를 분석하여 점수 및 티어를 산정하고, 다른 이용자와의 순위를 제공하는 웹 서비스를 말합니다.
② "이용자"란 본 약관에 따라 서비스를 이용하는 자를 말합니다.
③ "GitHub OAuth"란 GitHub에서 제공하는 인증 방식으로, 이용자가 GitHub 계정을 통해 서비스에 로그인하는 것을 말합니다.

제3조 (약관의 효력 및 변경)
① 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
② 서비스는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며, 변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.
③ 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다. 변경된 약관의 효력 발생일 이후에도 서비스를 계속 이용할 경우 약관 변경에 동의한 것으로 간주합니다.

제4조 (서비스의 내용)
① 서비스는 GitHub OAuth를 통해 이용자의 동의 하에 다음의 공개 데이터를 수집·분석합니다:
   - 커밋(Commit) 수
   - Pull Request 생성 및 병합 수
   - 이슈(Issue) 생성 수
   - 코드 리뷰(Review) 수
② 서비스는 수집된 데이터를 기반으로 점수를 산정하고 티어를 부여하며, 전체 이용자 중 순위를 제공합니다.
③ 서비스는 이용자의 GitHub 프로필에 표시할 수 있는 배지(Badge) 이미지를 제공합니다.
④ 서비스에서 제공하는 점수, 티어, 순위는 GitHub 공개 활동 데이터만을 기반으로 하며, 이용자의 실제 개발 능력을 평가하거나 보증하지 않습니다.

제5조 (서비스 이용계약의 성립)
① 이용계약은 이용자가 본 약관에 동의하고 GitHub OAuth를 통해 로그인함으로써 성립됩니다.
② 서비스는 다음 각 호에 해당하는 경우 이용을 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다:
   - 타인의 GitHub 계정을 도용한 경우
   - 허위 정보를 기재하거나 서비스를 부정하게 이용한 경우
   - 서비스의 정상적인 운영을 방해한 경우
   - 기타 관련 법령 또는 본 약관을 위반한 경우

제6조 (이용자의 의무)
① 이용자는 본 약관 및 관련 법령을 준수하여야 합니다.
② 이용자는 다음 각 호의 행위를 하여서는 안 됩니다:
   - 타인의 GitHub 계정을 도용하거나 타인의 개인정보를 무단으로 수집하는 행위
   - 서비스에서 제공하는 정보를 허위로 변조하거나 부정하게 사용하는 행위
   - 서비스의 운영을 방해하거나 서비스에 과도한 부하를 발생시키는 행위
   - 서비스를 이용하여 타인의 명예를 훼손하거나 권리를 침해하는 행위
   - 기타 불법적이거나 부당한 행위

제7조 (서비스의 제공 및 변경)
① 서비스는 연중무휴 24시간 제공함을 원칙으로 합니다. 단, 시스템 점검 등 운영상 필요한 경우 일시적으로 서비스 제공을 중단할 수 있습니다.
② 서비스는 운영상, 기술상의 필요에 따라 제공하는 서비스의 전부 또는 일부를 변경할 수 있습니다.
③ 서비스 내용의 변경이 있는 경우 서비스 내 공지를 통해 이용자에게 안내합니다.

제8조 (서비스 이용의 제한 및 중지)
① 서비스는 다음 각 호에 해당하는 경우 서비스 제공을 제한하거나 중지할 수 있습니다:
   - 시스템 점검, 보수, 교체 등 운영상 필요한 경우
   - GitHub API 정책 변경, 장애 또는 서비스 중단으로 인해 정상적인 서비스 제공이 어려운 경우
   - 천재지변, 전쟁, 폭동 등 불가항력적 사유가 발생한 경우
   - 기타 서비스 운영에 현저한 지장을 초래하는 경우
② 제1항에 의한 서비스 중지의 경우, 서비스는 사전에 이용자에게 공지합니다. 단, 긴급하거나 불가피한 사유로 사전 공지가 어려운 경우 사후에 공지할 수 있습니다.

제9조 (이용계약의 해지)
① 이용자는 언제든지 서비스 내 탈퇴 기능 또는 고객센터를 통해 이용계약을 해지할 수 있습니다.
② 이용계약이 해지된 경우, 서비스는 관련 법령 및 개인정보처리방침에 따라 이용자의 개인정보를 처리합니다.

제10조 (면책조항)
① 서비스는 GitHub, Inc.와 제휴 관계에 있지 않으며, GitHub의 공식 서비스가 아닙니다.
② 서비스는 GitHub API를 통해 수집된 공개 데이터만을 활용하며, 데이터의 정확성이나 완전성을 보증하지 않습니다.
③ 서비스에서 제공하는 점수, 티어, 순위는 참고용이며, 이를 근거로 한 어떠한 판단이나 결정에 대해서도 서비스는 책임을 지지 않습니다.
④ 서비스는 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.
⑤ 서비스는 GitHub API 정책 변경, 장애, 서비스 중단 등 외부 요인으로 인한 서비스 중단이나 데이터 손실에 대해 책임을 지지 않습니다.
⑥ 서비스는 무료로 제공되며, 이로 인해 발생하는 어떠한 손해에 대해서도 법적 책임을 지지 않습니다.

제11조 (저작권 및 지적재산권)
① 서비스가 제작한 콘텐츠(디자인, 로고, 배지 등)에 대한 저작권 및 지적재산권은 서비스에 귀속됩니다.
② 이용자는 서비스에서 제공하는 배지를 개인 GitHub 프로필에 사용할 수 있으나, 상업적 목적으로 무단 사용하거나 변조할 수 없습니다.
③ GitHub 로고 및 상표는 GitHub, Inc.의 자산이며, 서비스는 GitHub 브랜드 가이드라인을 준수합니다.

제12조 (분쟁 해결)
① 서비스와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법원을 관할 법원으로 합니다.
② 서비스와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.

제13조 (기타)
① 본 약관에서 정하지 아니한 사항과 본 약관의 해석에 관하여는 관련 법령 및 상관례에 따릅니다.
② 서비스 이용에 관한 문의사항은 GitHub Issues(https://github.com/git-ranker/git-ranker)를 통해 접수받습니다.

부칙
본 약관은 2026년 1월 21일부터 시행됩니다.
`;

// [Content] 개인정보처리방침
const PRIVACY_POLICY = `
Git Ranker 개인정보처리방침

시행일: 2026년 1월 21일

Git Ranker(이하 "서비스")는 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.

제1조 (개인정보의 수집 및 이용 목적)
서비스는 다음의 목적을 위해 개인정보를 수집 및 이용합니다. 수집된 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행합니다.

1. 서비스 제공 및 회원 관리
   - GitHub OAuth를 통한 회원 식별 및 인증
   - 서비스 이용에 따른 본인확인
   - 회원자격 유지·관리

2. GitHub 활동 분석 서비스 제공
   - GitHub 공개 활동 데이터 수집 및 분석
   - 점수 산정, 티어 부여 및 순위 제공
   - 배지(Badge) 이미지 생성 및 제공

3. 서비스 개선 및 통계 분석
   - 서비스 이용 현황 파악 및 통계 분석
   - 서비스 개선 및 신규 기능 개발

제2조 (수집하는 개인정보의 항목 및 수집 방법)
1. 수집하는 개인정보 항목
서비스는 GitHub OAuth를 통해 이용자의 동의 하에 다음의 정보를 수집합니다:

[필수 항목]
- GitHub 사용자 고유 ID (node_id)
- GitHub 사용자명 (username)
- 프로필 이미지 URL
- 공개 저장소 활동 내역: 커밋 수, Pull Request 수, 이슈 수, 코드 리뷰 수

[선택 항목]
- 이메일 주소 (GitHub 계정 설정에 따라 공개된 경우에만 수집)

[자동 수집 항목]
- 서비스 이용 기록, 접속 로그, 접속 IP 주소

2. 개인정보 수집 방법
- GitHub OAuth 2.0을 통한 인증 및 API 연동
- 서비스 이용 과정에서 자동 생성·수집

제3조 (개인정보의 보유 및 이용 기간)
1. 서비스는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
2. 이용자가 회원 탈퇴를 요청한 경우, 개인정보는 즉시 파기됩니다.
3. 다만, 다음의 정보에 대해서는 아래의 사유로 명시한 기간 동안 보존합니다:

[관련 법령에 의한 보존]
- 서비스 이용 관련 분쟁 대비: 1년 (내부 방침)
- 접속에 관한 기록: 3개월 (통신비밀보호법)

제4조 (개인정보의 제3자 제공)
1. 서비스는 이용자의 개인정보를 제1조에서 명시한 범위 내에서만 처리하며, 이용자의 사전 동의 없이 본래의 범위를 초과하여 처리하거나 제3자에게 제공하지 않습니다.
2. 다만, 다음의 경우에는 예외로 합니다:
   - 이용자가 사전에 동의한 경우
   - 법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우

제5조 (개인정보처리의 위탁)
1. 서비스는 현재 개인정보처리업무를 외부에 위탁하고 있지 않습니다.
2. 향후 위탁 업무가 발생할 경우, 위탁받는 자와 위탁 업무의 내용을 본 개인정보처리방침에 공개하겠습니다.

제6조 (이용자 및 법정대리인의 권리·의무 및 행사방법)
1. 이용자는 서비스에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:
   - 개인정보 열람 요청
   - 개인정보 정정 요청
   - 개인정보 삭제 요청
   - 개인정보 처리정지 요청

2. 권리 행사는 GitHub Issues(https://github.com/git-ranker/git-ranker)를 통해 요청할 수 있으며, 서비스는 이에 대해 지체 없이 조치하겠습니다.

3. 이용자가 개인정보의 삭제를 요청한 경우, 서비스는 지체 없이 해당 개인정보를 파기하고 회원 탈퇴 처리합니다.

4. 이용자는 개인정보 보호 관련 권리 행사를 법정대리인이나 위임을 받은 자 등 대리인을 통해서도 할 수 있습니다.

제7조 (개인정보의 파기)
1. 파기 절차
서비스는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체 없이 해당 개인정보를 파기합니다.

2. 파기 방법
   - 전자적 파일 형태의 정보: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제
   - 종이에 출력된 개인정보: 분쇄기로 분쇄하거나 소각

제8조 (개인정보의 안전성 확보 조치)
서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:
1. 관리적 조치: 개인정보 취급자 최소화, 개인정보처리방침 수립 및 시행
2. 기술적 조치: 개인정보처리시스템에 대한 접근권한 관리, 암호화 기술 적용, 보안프로그램 설치
3. 물리적 조치: 서버 접근 통제

제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)
1. 서비스는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용할 수 있습니다.
2. 이용자는 웹브라우저 옵션 설정을 통해 쿠키 허용, 차단 등의 설정을 할 수 있습니다.
3. 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 발생할 수 있습니다.

제10조 (개인정보 보호책임자)
서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.

개인정보 보호책임자
- 문의 방법: GitHub Issues (https://github.com/git-ranker/git-ranker)

이용자는 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 위 연락처로 문의하실 수 있습니다.

제11조 (권익침해 구제방법)
이용자는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.

- 개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)
- 개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)
- 대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)
- 경찰청 사이버수사국: (국번없이) 182 (ecrm.cyber.go.kr)

제12조 (GitHub API 이용에 관한 사항)
1. 서비스는 GitHub API를 통해 이용자의 공개된 활동 데이터만을 수집합니다.
2. 서비스는 GitHub, Inc.의 API 이용약관 및 개인정보처리방침을 준수합니다.
3. 서비스는 GitHub, Inc.와 제휴 관계에 있지 않으며, GitHub의 공식 서비스가 아닙니다.
4. GitHub OAuth를 통해 부여받은 접근 권한은 서비스 제공 목적으로만 사용되며, 이용자는 언제든지 GitHub 설정(https://github.com/settings/applications)에서 접근 권한을 철회할 수 있습니다.

제13조 (개인정보처리방침의 변경)
1. 본 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 서비스 내 공지사항을 통하여 고지합니다.
2. 이용자의 권리에 중대한 변경이 있는 경우에는 최소 30일 전에 고지합니다.

부칙
본 개인정보처리방침은 2026년 1월 21일부터 시행됩니다.
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
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, damping: 25, stiffness: 300 } },
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
                            className="relative w-[calc(100%-2rem)] sm:w-full max-w-lg max-h-[75vh] sm:max-h-[80vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-background/95 backdrop-blur-sm border-b border-border">
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
                            <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <pre className="whitespace-pre-wrap font-sans text-[13px] sm:text-sm leading-relaxed text-muted-foreground bg-transparent p-0 m-0">
                                        {openModal === "terms" ? TERMS_OF_SERVICE.trim() : PRIVACY_POLICY.trim()}
                                    </pre>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="shrink-0 px-4 sm:px-6 py-3 sm:py-4 pb-4 sm:pb-4 bg-background/95 backdrop-blur-sm border-t border-border">
                                <Button
                                    onClick={() => setOpenModal(null)}
                                    className="w-full h-10 sm:h-11 font-semibold rounded-xl text-sm sm:text-base"
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
