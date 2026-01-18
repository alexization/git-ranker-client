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
    // 성능을 위한 실험적 기능 (선택 사항)
    experimental: {
        optimizePackageImports: ["lucide-react", "framer-motion"],
    },
};

export default nextConfig;