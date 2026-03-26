import { MetadataRoute } from "next";
import { publicBaseUrl } from "@/shared/lib/public-env";

const BASE_URL = publicBaseUrl;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/oauth2/",
        "/auth/",
        "/en/oauth2/",
        "/ko/oauth2/",
        "/en/auth/",
        "/ko/auth/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
