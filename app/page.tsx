import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

async function getHomePageData() {
  try {
    const now = new Date();
    
    // Fetch banners with date filtering
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { position: "asc" },
    });

    // Fetch hot deals with date filtering
    const hotDeals = await prisma.hotDeal.findMany({
      where: {
        isActive: true,
        showOnHomepage: true,
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } },
            ],
          },
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      include: {
        deal: {
          include: { category: true },
        },
      },
      orderBy: { order: "asc" },
    });

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
    
    return { categories, featuredDeals, latestDeals, banners, hotDeals };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { categories: [], featuredDeals: [], latestDeals: [], banners: [], hotDeals: [] };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();
  return <HomeClient {...data} />;
}
