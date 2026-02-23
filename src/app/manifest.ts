import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Git Ranker - Developer Impact Score",
        short_name: "Git Ranker",
        description: "Developer impact and tier ranking service based on GitHub activity",
        start_url: "/",
        display: "standalone",
        background_color: "#09090b",
        theme_color: "#09090b",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "16x16 32x32 48x48",
                type: "image/x-icon",
            },
        ],
        categories: ["developer-tools", "productivity"],
        lang: "en-US",
    }
}
