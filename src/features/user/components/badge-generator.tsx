"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card"
import { Input } from "@/shared/components/input"

interface BadgeGeneratorProps {
  nodeId: string
}

export function BadgeGenerator({ nodeId }: BadgeGeneratorProps) {
  const badgeUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://www.git-ranker.com/api/v1'}/badges/${nodeId}`
  const markdown = `[![Git Ranker](${badgeUrl})](https://www.git-ranker.com)`

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown)
    toast.success("배지 코드가 복사되었습니다!", {
        description: "GitHub 프로필 README.md에 붙여넣으세요."
    })
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Get Your Badge</CardTitle>
        <CardDescription>
          GitHub 프로필에 실시간 전투력 배지를 달아보세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
                <div className="flex items-center space-x-2">
                    <Input readOnly value={markdown} className="font-mono text-xs" />
                    <Button onClick={handleCopy} size="icon" variant="outline">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-md bg-muted/50 min-w-[300px] h-[150px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={badgeUrl} alt="Git Ranker Badge" className="max-w-full h-auto" />
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
