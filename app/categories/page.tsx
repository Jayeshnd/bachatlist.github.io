import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h1>
        <p className="text-gray-600 mb-8">
          Browse through our categories to find the best deals
        </p>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition transform">
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition">
                  {category.name}
                </h2>
                <p className="text-gray-600 mt-2">{category.description}</p>
                <p className="text-sm text-gray-500 mt-4">
                  {category.dealCount} deals available
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
