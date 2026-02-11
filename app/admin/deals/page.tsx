import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toNumber, formatPrice } from "@/lib/utils";
import DealsPageClient from "./DealsPageClient";

export default async function DealsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  // Sanitize deals to remove Decimal objects and convert to plain objects
  const sanitizedDeals = deals.map((deal) => ({
    id: deal.id,
    title: deal.title,
    slug: deal.slug,
    description: deal.description,
    shortDesc: deal.shortDesc,
    currentPrice: toNumber(deal.currentPrice),
    originalPrice: toNumber(deal.originalPrice),
    discount: deal.discount,
    currency: deal.currency,
    rating: toNumber(deal.rating),
    reviewCount: deal.reviewCount,
    features: deal.features,
    images: deal.images,
    primaryImage: deal.primaryImage,
    productUrl: deal.productUrl,
    affiliateUrl: deal.affiliateUrl,
    categoryId: deal.categoryId,
    tags: deal.tags,
    status: deal.status,
    badge: deal.badge,
    isFeatured: deal.isFeatured,
    isExpired: deal.isExpired,
    expiresAt: deal.expiresAt?.toISOString() || null,
    metaTitle: deal.metaTitle,
    metaDescription: deal.metaDescription,
    views: deal.views,
    clicks: deal.clicks,
    authorId: deal.authorId,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
    publishedAt: deal.publishedAt?.toISOString() || null,
    category: deal.category,
  }));

  return <DealsPageClient initialDeals={sanitizedDeals} />;
}
