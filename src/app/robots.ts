import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://www.git-ranker.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/oauth2/", "/auth/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
