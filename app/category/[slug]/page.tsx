import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getCategoryData(slug: string) {
  try {
    return await prisma.category.findUnique({
      where: { slug },
      include: { deals: { where: { status: "PUBLISHED" }, take: 20 } },
    });
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return null;
  }
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">💰</span>
            <span className="text-2xl font-bold text-gray-900">BachatList</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{category.icon}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
              <p className="text-gray-600 mt-2">{category.description}</p>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {category.deals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No deals in this category yet</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Showing {category.deals.length} deals
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.deals.map((deal) => (
                <a
                  key={deal.id}
                  href={deal.affiliateUrl || deal.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 h-40 flex items-center justify-center group-hover:scale-105 transition transform">
                    <span className="text-5xl opacity-80">🛍️</span>
                  </div>
                  <div className="p-4">
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
          </>
        )}
      </div>
    </div>
  );
}
