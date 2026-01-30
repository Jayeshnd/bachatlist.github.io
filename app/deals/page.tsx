import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, toNumber } from "@/lib/utils";

async function getDealsData(search: string, category: string) {
  try {
    const [deals, categories] = await Promise.all([
      prisma.deal.findMany({
        where: {
          status: "PUBLISHED",
          ...(search && {
            OR: [
              { title: { contains: search } },
              { description: { contains: search } },
            ],
          }),
          ...(category && { category: { slug: category } }),
        },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
    ]);
    return { deals, categories };
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return { deals: [], categories: [] };
  }
}

function DealCard({ deal }: { deal: any }) {
  const currentPrice = toNumber(deal.currentPrice);
  const originalPrice = toNumber(deal.originalPrice);
  const discount = deal.discount || (originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  return (
    <Link
      href={deal.affiliateUrl || deal.productUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {deal.primaryImage ? (
            <img
              src={deal.primaryImage}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <span className="text-6xl opacity-50">🛍️</span>
            </div>
          )}
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-lg shadow-sm">
              {discount}% OFF
            </div>
          )}
          
          {/* Badge */}
          {deal.badge && (
            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
              {deal.badge}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
              {deal.category?.name || "General"}
            </span>
            {deal.isFeatured && (
              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-primary transition-colors">
            {deal.title}
          </h3>

          {/* Description */}
          {deal.shortDesc && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {deal.shortDesc}
            </p>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(currentPrice, deal.currency || "INR")}
              </span>
              {originalPrice > currentPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(originalPrice, deal.currency || "INR")}
                </span>
              )}
            </div>

            {/* Rating */}
            {deal.rating && deal.rating > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
                <span className="text-sm text-gray-400">({deal.reviewCount || 0})</span>
              </div>
            )}

            {/* CTA Button */}
            <button className="mt-3 w-full bg-gradient-to-r from-primary to-primary/90 text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
              View Deal →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "";

  const { deals, categories } = await getDealsData(search, category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">💰</span>
              <span className="text-2xl font-bold text-gray-900">BachatList</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/deals" className="text-primary font-medium">All Deals</Link>
              <Link href="/categories" className="text-gray-600 hover:text-primary">Categories</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {search ? `Search Results for "${search}"` : category ? `${categories.find(c => c.slug === category)?.name || "Deals"}` : "All Deals"}
          </h1>
          <p className="text-gray-600 mt-1">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <form method="get" className="flex gap-3 mb-4">
            <input
              type="text"
              name="search"
              placeholder="Search deals..."
              defaultValue={search}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Search
            </button>
          </form>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Browse by Category</h3>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/deals"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  !category
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/deals?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    category === cat.slug
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat.icon} {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {search || category ? "No deals found" : "No deals available yet"}
            </h2>
            <p className="text-gray-600">
              {search || category
                ? "Try adjusting your search or filters"
                : "Check back soon for amazing deals!"}
            </p>
            {(search || category) && (
              <Link
                href="/deals"
                className="inline-block mt-4 text-primary font-medium hover:underline"
              >
                Clear filters →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} BachatList. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
