import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login", "/auth"],
    },
    sitemap: "https://bachatlist.com/sitemap.xml",
  };
}
