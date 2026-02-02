import Link from "next/link";
import { prisma } from "@/lib/prisma";

const defaultCategories = [
  { name: "Food & Dining", slug: "food", icon: "🍔", count: 45, description: "Restaurants, food delivery, and grocery deals" },
  { name: "Shopping", slug: "shopping", icon: "🛍️", count: 120, description: "General shopping deals and offers" },
  { name: "Travel", slug: "travel", icon: "✈️", count: 35, description: "Flights, hotels, and travel packages" },
  { name: "Entertainment", slug: "entertainment", icon: "🎬", count: 28, description: "Movies, events, and entertainment" },
  { name: "Health & Beauty", slug: "health", icon: "💄", count: 67, description: "Skincare, makeup, and health products" },
  { name: "Electronics", slug: "electronics", icon: "💻", count: 89, description: "Gadgets, laptops, and electronics" },
  { name: "Fashion", slug: "fashion", icon: "👗", count: 156, description: "Clothing, shoes, and accessories" },
  { name: "Home & Kitchen", slug: "home-kitchen", icon: "🏠", count: 72, description: "Home appliances and kitchen tools" },
  { name: "Books & Media", slug: "books", icon: "📚", count: 34, description: "Books, movies, and music" },
  { name: "Sports & Fitness", slug: "sports", icon: "⚽", count: 45, description: "Sports equipment and fitness gear" },
  { name: "Recharge & Bills", slug: "recharge", icon: "📱", count: 23, description: "Mobile recharge and bill payments" },
  { name: "Kids & Baby", slug: "kids", icon: "🧸", count: 38, description: "Kids products and baby care" },
];

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    
    // Calculate deal count per category (mock for now)
    const categoriesWithCounts = categories.map(cat => ({
      ...cat,
      count: Math.floor(Math.random() * 100) + 10, // Mock count
    }));
    
    return categoriesWithCounts.length > 0 ? categoriesWithCounts : defaultCategories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return defaultCategories;
  }
}

export const metadata = {
  title: "Categories - BachatList",
  description: "Browse deals and coupons by category",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Categories</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Browse deals and coupons by category
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/deals?category=${category.slug}`}
              className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-center border border-gray-100 hover:border-green-200"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{category.count} deals</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/deals?category=fashion"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <span className="text-3xl">👗</span>
              <div>
                <h3 className="font-semibold text-gray-900">Fashion</h3>
                <p className="text-sm text-gray-500">Clothing, shoes, accessories</p>
              </div>
            </Link>
            <Link
              href="/deals?category=electronics"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <span className="text-3xl">💻</span>
              <div>
                <h3 className="font-semibold text-gray-900">Electronics</h3>
                <p className="text-sm text-gray-500">Gadgets, phones, laptops</p>
              </div>
            </Link>
            <Link
              href="/deals?category=home-kitchen"
              className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors"
            >
              <span className="text-3xl">🏠</span>
              <div>
                <h3 className="font-semibold text-gray-900">Home & Kitchen</h3>
                <p className="text-sm text-gray-500">Appliances, furniture</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Can't Find What You're Looking For?</h2>
          <p className="text-white/80 mb-6">Let us know and we'll help you find the best deals!</p>
          <Link
            href="/contact"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Contact Us 📧
          </Link>
        </div>
      </section>
    </div>
  );
}
