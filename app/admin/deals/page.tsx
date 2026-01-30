import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { toNumber, formatPrice } from "@/lib/utils";
import { DealsTable } from "./DealsTable";

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
    rating: deal.rating,
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

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage all deals and offers</p>
        </div>
        <Link
          href="/admin/deals/create"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Deal
        </Link>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Deals</h2>
        </div>

        {sanitizedDeals.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals yet</h3>
            <p className="text-gray-600 mb-4">Create your first deal to get started</p>
            <Link
              href="/admin/deals/create"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Deal
            </Link>
          </div>
        ) : (
          <DealsTable initialDeals={sanitizedDeals} />
        )}
      </div>
    </div>
  );
}
