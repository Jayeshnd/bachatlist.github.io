import { prisma } from "@/lib/prisma";
import HomeClient from "./HomeClient";

// Helper function to convert Decimal fields to numbers for serialization
function serializeDeal(deal: any) {
  return {
    ...deal,
    currentPrice: deal.currentPrice ? Number(deal.currentPrice) : 0,
    originalPrice: deal.originalPrice ? Number(deal.originalPrice) : null,
    rating: deal.rating ? Number(deal.rating) : null,
  };
}

async function getHomePageData() {
  try {
    const now = new Date();
    
    // Fetch banners (show all active banners)
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
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

    const [categories, featuredDeals, latestDeals, stores] = await Promise.all([
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
      prisma.store.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);
    
    // Serialize Decimal fields in deals
    const serializedFeaturedDeals = featuredDeals.map(serializeDeal);
    const serializedLatestDeals = latestDeals.map(serializeDeal);
    const serializedHotDeals = hotDeals.map((hotDeal) => ({
      ...hotDeal,
      deal: serializeDeal(hotDeal.deal),
    }));
    
    return { 
      categories, 
      featuredDeals: serializedFeaturedDeals, 
      latestDeals: serializedLatestDeals, 
      banners, 
      hotDeals: serializedHotDeals 
    };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { categories: [], featuredDeals: [], latestDeals: [], banners: [], hotDeals: [] };
  }
}

export default async function HomePage() {
  const data = await getHomePageData();
  return <HomeClient {...data} />;
}
