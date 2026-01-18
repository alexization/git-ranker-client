import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.git-ranker.com";
  
  // 정적 페이지 리스트
  const routes = ["", "/ranking"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
