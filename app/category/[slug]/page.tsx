import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, toNumber } from "@/lib/utils";

async function getCategoryData(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: { deals: { where: { status: "PUBLISHED" }, take: 20, include: { category: true } } },
    });
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
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
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-primary transition-colors">
            {deal.title}
          </h3>

          {/* Short Description */}
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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

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
              <Link href="/deals" className="text-gray-600 hover:text-primary">All Deals</Link>
              <Link href="/categories" className="text-gray-600 hover:text-primary">Categories</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6">
            <span className="text-7xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600 mt-2 text-lg">{category.description}</p>
              )}
              <p className="text-gray-500 mt-2">
                {category.deals.length} deal{category.deals.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {category.deals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No deals in this category yet</h2>
            <p className="text-gray-600 mb-4">Check back soon for amazing deals!</p>
            <Link href="/deals" className="text-primary font-medium hover:underline">
              Browse all deals →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.deals.map((deal) => (
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
