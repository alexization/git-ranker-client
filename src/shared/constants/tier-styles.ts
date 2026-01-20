import { Tier } from "@/shared/types/api"

/**
 * Comprehensive tier styling system
 * Centralized to prevent duplication and ensure consistency
 */

// Full tier styles for profile pages and detailed views
export const TIER_STYLES: Record<Tier | string, {
    bgGradient: string;
    border: string;
    text: string;
    badgeBg: string;
    shadow: string;
    iconColor: string;
    overlay?: string;
}> = {
    CHALLENGER: {
        bgGradient: "from-red-500/10 via-orange-500/5 to-background",
        border: "border-red-500/30",
        text: "text-red-500",
        badgeBg: "bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-red-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(239,68,68,0.3)]",
        iconColor: "text-red-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(239,68,68,0.1)_50%,transparent_75%)]"
    },
    MASTER: {
        bgGradient: "from-purple-600/10 via-pink-600/5 to-background",
        border: "border-purple-500/30",
        text: "text-purple-500",
        badgeBg: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(168,85,247,0.3)]",
        iconColor: "text-purple-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(168,85,247,0.1)_50%,transparent_75%)]"
    },
    DIAMOND: {
        bgGradient: "from-blue-500/10 via-cyan-500/5 to-background",
        border: "border-blue-500/30",
        text: "text-blue-500",
        badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]",
        iconColor: "text-blue-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(59,130,246,0.1)_50%,transparent_75%)]"
    },
    EMERALD: {
        bgGradient: "from-emerald-500/10 via-teal-500/5 to-background",
        border: "border-emerald-500/30",
        text: "text-emerald-500",
        badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]",
        iconColor: "text-emerald-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(16,185,129,0.1)_50%,transparent_75%)]"
    },
    PLATINUM: {
        bgGradient: "from-cyan-500/10 via-sky-500/5 to-background",
        border: "border-cyan-500/30",
        text: "text-cyan-500",
        badgeBg: "bg-gradient-to-r from-cyan-500 to-sky-500 text-white shadow-cyan-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(6,182,212,0.3)]",
        iconColor: "text-cyan-500",
        overlay: "bg-[linear-gradient(110deg,transparent_25%,rgba(6,182,212,0.1)_50%,transparent_75%)]"
    },
    GOLD: {
        bgGradient: "from-yellow-400/10 via-amber-400/5 to-background",
        border: "border-yellow-500/30",
        text: "text-yellow-500",
        badgeBg: "bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-yellow-500/30",
        shadow: "shadow-[0_0_50px_-12px_rgba(234,179,8,0.3)]",
        iconColor: "text-yellow-500"
    },
    SILVER: {
        bgGradient: "from-slate-300/10 via-gray-300/5 to-background",
        border: "border-slate-400/30",
        text: "text-slate-500",
        badgeBg: "bg-gradient-to-r from-slate-400 to-gray-500 text-white shadow-slate-500/30",
        shadow: "shadow-none",
        iconColor: "text-slate-400"
    },
    BRONZE: {
        bgGradient: "from-orange-700/10 via-amber-900/5 to-background",
        border: "border-orange-700/30",
        text: "text-orange-700",
        badgeBg: "bg-gradient-to-r from-orange-600 to-amber-700 text-white shadow-orange-500/30",
        shadow: "shadow-none",
        iconColor: "text-orange-700"
    },
    IRON: {
        bgGradient: "from-stone-500/10 via-neutral-500/5 to-background",
        border: "border-stone-500/30",
        text: "text-stone-500",
        badgeBg: "bg-gradient-to-r from-stone-500 to-neutral-600 text-white shadow-stone-500/30",
        shadow: "shadow-none",
        iconColor: "text-stone-500"
    }
} as const

// Simplified tier color styles for badges and compact views
export const TIER_COLOR_STYLES: Record<Tier | string, string> = {
    CHALLENGER: "bg-red-500/10 text-red-500 border-red-500/30",
    MASTER: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    DIAMOND: "bg-sky-500/10 text-sky-500 border-sky-500/30",
    EMERALD: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    PLATINUM: "bg-cyan-500/10 text-cyan-500 border-cyan-500/30",
    GOLD: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30",
    SILVER: "bg-slate-400/10 text-slate-500 border-slate-400/30",
    BRONZE: "bg-orange-600/10 text-orange-600 border-orange-500/30",
    IRON: "bg-stone-500/10 text-stone-500 border-stone-500/30",
} as const

// Tier dot colors for mobile view and indicators
export const TIER_DOT_COLORS: Record<Tier | string, string> = {
    CHALLENGER: "bg-red-500",
    MASTER: "bg-purple-500",
    DIAMOND: "bg-sky-500",
    EMERALD: "bg-emerald-500",
    PLATINUM: "bg-cyan-500",
    GOLD: "bg-yellow-500",
    SILVER: "bg-slate-400",
    BRONZE: "bg-orange-600",
    IRON: "bg-stone-500",
} as const

// Text-only tier colors for modals and simple displays
export const TIER_TEXT_COLORS: Record<Tier | string, string> = {
    CHALLENGER: "text-red-500",
    MASTER: "text-purple-500",
    DIAMOND: "text-blue-500",
    EMERALD: "text-emerald-500",
    PLATINUM: "text-cyan-500",
    GOLD: "text-yellow-500",
    SILVER: "text-slate-500",
    BRONZE: "text-orange-500",
    IRON: "text-stone-500",
} as const

// Ordered tier list (highest to lowest)
export const TIER_ORDER: Tier[] = [
    'CHALLENGER', 'MASTER', 'DIAMOND', 'EMERALD',
    'PLATINUM', 'GOLD', 'SILVER', 'BRONZE', 'IRON'
] as const

// Helper functions
export const getTierStyle = (tier: Tier | string) =>
    TIER_STYLES[tier] || TIER_STYLES['IRON']

export const getTierColorClass = (tier: Tier | string) =>
    TIER_COLOR_STYLES[tier] || TIER_COLOR_STYLES['IRON']

export const getTierDotColor = (tier: Tier | string) =>
    TIER_DOT_COLORS[tier] || TIER_DOT_COLORS['IRON']

export const getTierTextColor = (tier: Tier | string) =>
    TIER_TEXT_COLORS[tier] || TIER_TEXT_COLORS['IRON']
