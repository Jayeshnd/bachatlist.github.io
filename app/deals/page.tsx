import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">💰</span>
            <span className="text-2xl font-bold text-gray-900">BachatList</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Deals</h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="space-y-4">
            <div>
              <form method="get" className="flex gap-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search deals..."
                  defaultValue={search}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  Search
                </button>
              </form>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Filter by Category</h3>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/deals"
                  className={`px-4 py-2 rounded-lg transition ${
                    !category
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  All
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/deals?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                    className={`px-4 py-2 rounded-lg transition ${
                      category === cat.slug
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {search || category
                ? "No deals found matching your search"
                : "No deals available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <a
                key={deal.id}
                href={deal.affiliateUrl || deal.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
              >
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 h-40 flex items-center justify-center group-hover:scale-105 transition transform overflow-hidden">
                  {deal.primaryImage ? (
                    <img
                      src={deal.primaryImage}
                      alt={deal.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl opacity-80">🛍️</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-primary font-semibold uppercase">
                    {deal.category.name}
                  </p>
                  <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 group-hover:text-primary transition">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {deal.description}
                  </p>

                  {deal.discount && (
                    <div className="mt-4 flex items-end gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {deal.discount}% off
                      </span>
                      {deal.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{deal.originalPrice.toString()}
                        </span>
                      )}
                    </div>
                  )}

                  <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                    View Deal
                  </button>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
