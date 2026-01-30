import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/app/components/home/Hero";

async function getHomePageData() {
  try {
    const [categories, deals] = await Promise.all([
      prisma.category.findMany({
        take: 6,
        where: { isActive: true },
        orderBy: { order: "asc" },
      }),
      prisma.deal.findMany({
        take: 8,
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);
    return { categories, deals };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { categories: [], deals: [] };
  }
}

export default async function HomePage() {
  const { categories, deals } = await getHomePageData();

  // Fallback demo data if database is empty
  const demoCategories = categories.length > 0 ? categories : [
    { id: "1", icon: "📱", name: "Electronics", slug: "electronics", dealCount: 0, description: "Tech & gadgets" },
    { id: "2", icon: "👗", name: "Fashion", slug: "fashion", dealCount: 0, description: "Clothing & accessories" },
    { id: "3", icon: "🏠", name: "Home", slug: "home", dealCount: 0, description: "Home & garden" },
  ];

  const demoDeals = deals.length > 0 ? deals : [
    {
      id: "1",
      title: "Sample Deal 1",
      description: "This is a sample deal",
      discount: 30,
      originalPrice: "999",
      productUrl: "#",
      affiliateUrl: null,
      category: { name: "Electronics", slug: "electronics" },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {demoCategories.map((category: any) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center hover:scale-105 transform"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {category.dealCount} deals
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Deals</h2>
          <Link href="/deals" className="text-primary font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {demoDeals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No deals available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demoDeals.map((deal: any) => (
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
                          ₹{deal.originalPrice.toString ? deal.originalPrice.toString() : deal.originalPrice}
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
      </section>
    </div>
  );
}
