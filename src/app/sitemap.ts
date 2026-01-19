import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://www.git-ranker.com"
    const currentDate = new Date().toISOString()

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/ranking`,
            lastModified: currentDate,
            changeFrequency: "hourly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: currentDate,
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ]

    return staticRoutes
}
