"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/card"
import { Button } from "@/shared/components/button"
import { Check, Copy, Link2, Code2, ExternalLink, type LucideIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/shared/lib/utils"
import { useI18n } from "@/shared/providers/locale-provider"
import { localizePathname } from "@/shared/i18n/config"
import { getBadgeImageUrl, getPublicSiteUrl } from "@/shared/lib/public-env"

interface BadgeGeneratorProps {
    nodeId: string
    username: string
}

type CopyType = "markdown" | "html" | "link" | null
type BadgeCopyType = Exclude<CopyType, null>

interface BadgeCopyButtonProps {
    copied: CopyType
    icon: LucideIcon
    label: string
    onCopy: () => void
    type: BadgeCopyType
}

function BadgeCopyButton({ copied, icon: Icon, label, onCopy, type }: BadgeCopyButtonProps) {
    return (
        <Button
            onClick={onCopy}
            variant="ghost"
            className={cn(
                "h-10 px-4 rounded-xl font-medium text-sm transition-all duration-200",
                "bg-secondary/50 hover:bg-secondary border border-transparent",
                copied === type && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            )}
        >
            {copied === type ? (
                <Check className="w-4 h-4 mr-2" />
            ) : (
                <Icon className="w-4 h-4 mr-2" />
            )}
            {label}
        </Button>
    )
}

export function BadgeGenerator({ nodeId, username }: BadgeGeneratorProps) {
    const { t, locale } = useI18n()
    const [copied, setCopied] = useState<CopyType>(null)

    const badgeUrl = getBadgeImageUrl(nodeId)
    const profilePath = localizePathname(`/users/${encodeURIComponent(username)}`, locale)
    const profileUrl = getPublicSiteUrl(profilePath)

    const markdownCode = `[![Git Ranker](${badgeUrl})](${profileUrl})`
    const htmlCode = `<a href="${profileUrl}"><img src="${badgeUrl}" alt="Git Ranker Badge" /></a>`

    const handleCopy = async (text: string, type: BadgeCopyType) => {
        await navigator.clipboard.writeText(text)
        setCopied(type)
        toast.success(
            type === "markdown" ? t("profile.badge.copied.markdown") :
            type === "html" ? t("profile.badge.copied.html") :
            t("profile.badge.copied.link")
        )
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <Card className="rounded-[2rem] sm:rounded-[2.5rem] border-0 bg-white/60 dark:bg-black/20 backdrop-blur-xl shadow-sm overflow-hidden">
            <CardHeader className="pb-4 px-5 sm:px-8 pt-6 sm:pt-8">
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                        <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    {t("profile.badge.section.title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1.5 ml-11">
                    {t("profile.badge.section.description")}
                </CardDescription>
            </CardHeader>

            <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 space-y-5">
                {/* Badge Preview */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 sm:p-6 rounded-2xl bg-secondary/30 border border-border/50 flex items-center justify-center">
                        <a
                            href={profileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-90 transition-opacity"
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={badgeUrl}
                                alt={t("profile.badge.alt")}
                                className="max-w-full h-auto object-contain"
                            />
                        </a>
                    </div>
                </div>

                {/* Copy Buttons */}
                <div className="flex flex-wrap gap-2">
                    <BadgeCopyButton
                        copied={copied}
                        type="markdown"
                        icon={Copy}
                        label="Markdown"
                        onCopy={() => handleCopy(markdownCode, "markdown")}
                    />
                    <BadgeCopyButton
                        copied={copied}
                        type="html"
                        icon={Code2}
                        label="HTML"
                        onCopy={() => handleCopy(htmlCode, "html")}
                    />
                    <BadgeCopyButton
                        copied={copied}
                        type="link"
                        icon={Link2}
                        label={t("profile.badge.image-link")}
                        onCopy={() => handleCopy(badgeUrl, "link")}
                    />
                    <Button
                        asChild
                        variant="ghost"
                        className="h-10 px-4 rounded-xl font-medium text-sm bg-secondary/50 hover:bg-secondary"
                    >
                        <a href={badgeUrl} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {t("profile.badge.preview")}
                        </a>
                    </Button>
                </div>

                {/* Usage Hint */}
                <div className="p-3 sm:p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-400/90 leading-relaxed">
                        <span className="font-semibold">{t("profile.badge.tip.label")}</span>{" "}
                        {t("profile.badge.tip.description")}
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
