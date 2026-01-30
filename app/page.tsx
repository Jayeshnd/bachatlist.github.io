import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

async function getHomePageData() {
  try {
    const [categories, featuredDeals, latestDeals] = await Promise.all([
      prisma.category.findMany({
        take: 6,
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.deal.findMany({
        take: 5,
        where: { status: "PUBLISHED", isFeatured: true },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      prisma.deal.findMany({
        take: 8,
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);
    return { categories, featuredDeals, latestDeals };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { categories: [], featuredDeals: [], latestDeals: [] };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();
  return <HomeClient {...data} />;
}
