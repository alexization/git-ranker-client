import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'github.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
    // 성능을 위한 실험적 기능 - Barrel imports 최적화
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "framer-motion",
            "@radix-ui/react-avatar",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-tabs",
            "recharts",
            "sonner",
        ],
    },
};

export default nextConfig;