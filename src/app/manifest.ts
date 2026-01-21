import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Git Ranker - 개발자 전투력 측정",
        short_name: "Git Ranker",
        description: "GitHub 활동 기반 개발자 전투력 측정 및 티어 랭킹 서비스",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#09090b",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/icon",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "/apple-icon",
                sizes: "180x180",
                type: "image/png",
            },
        ],
        categories: ["developer-tools", "productivity"],
        lang: "ko-KR",
    }
}
