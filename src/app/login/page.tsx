"use client"

import { Github } from "lucide-react"
import { Button } from "@/shared/components/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/card"

export default function LoginPage() {
  const handleGithubLogin = () => {
    // 백엔드 OAuth2 엔드포인트로 이동
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/oauth2/authorization/github`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Git Ranker 로그인</CardTitle>
          <CardDescription>
            GitHub 계정으로 간편하게 시작하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">👋 서비스 소개</p>
            <p>
              Git Ranker는 개발자의 GitHub 활동을 분석하여 전투력을 측정하고, 
              동기 부여를 제공하는 게이미피케이션 서비스입니다.
            </p>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
             <p className="font-medium text-foreground">🔒 수집 데이터 안내</p>
             <ul className="list-disc pl-5 space-y-1">
                <li>Public Profile (Username, Avatar)</li>
                <li>Public Activity Data (Commit, Issue, PR, Review)</li>
             </ul>
             <p className="text-xs mt-2 text-muted-foreground/80">
                * Private Repository의 활동이나 소스 코드는 절대 수집하지 않습니다.
             </p>
          </div>

          <div className="rounded-md bg-secondary p-4 text-xs text-secondary-foreground">
            로그인 시 <span className="font-semibold underline">개인정보 처리방침</span> 및 <span className="font-semibold underline">이용약관</span>에 동의하는 것으로 간주합니다.
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full h-12 text-base" 
            onClick={handleGithubLogin}
          >
            <Github className="mr-2 h-5 w-5" />
            GitHub로 계속하기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
