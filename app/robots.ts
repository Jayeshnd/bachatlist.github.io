import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/login", "/auth"],
    },
    sitemap: "https://www.bachatlist.com/sitemap.xml",
  };
}
