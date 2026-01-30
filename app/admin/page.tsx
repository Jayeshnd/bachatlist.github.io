import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch stats with error handling
  let totalDeals = 0;
  let publishedDeals = 0;
  let draftDeals = 0;
  let categories = 0;
  let totalClicks = 0;
  let dbError = false;

  try {
    const results = await Promise.all([
      prisma.deal.count(),
      prisma.deal.count({ where: { status: "PUBLISHED" } }),
      prisma.deal.count({ where: { status: "DRAFT" } }),
      prisma.category.count(),
      prisma.clickEvent.count(),
    ]);
    [totalDeals, publishedDeals, draftDeals, categories, totalClicks] = results;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    dbError = true;
  }

  const stats = [
    {
      label: "Total Deals",
      value: totalDeals,
      icon: "💰",
      color: "bg-blue-500",
      link: "/admin/deals",
    },
    {
      label: "Published",
      value: publishedDeals,
      icon: "✅",
      color: "bg-green-500",
      link: "/admin/deals",
    },
    {
      label: "Drafts",
      value: draftDeals,
      icon: "📝",
      color: "bg-yellow-500",
      link: "/admin/deals",
    },
    {
      label: "Categories",
      value: categories,
      icon: "📁",
      color: "bg-purple-500",
      link: "/admin/categories",
    },
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: "👆",
      color: "bg-pink-500",
      link: "/admin/analytics",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to BachatList Admin Panel</p>
      </div>

      {dbError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">⚠️ Database Connection Error</p>
          <p className="text-red-600 text-sm mt-1">
            Unable to connect to the database. Please check if your database server is running and accessible.
          </p>
          <p className="text-red-600 text-sm mt-2">
            Database: {process.env.DATABASE_URL?.split("@")[1] || "unknown"}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              href="/admin/deals/create"
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition"
            >
              <span className="text-2xl">➕</span>
              <span className="font-semibold">Create New Deal</span>
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="text-2xl">📁</span>
              <span className="font-semibold">Manage Categories</span>
            </Link>
            <Link
              href="/admin/affiliate"
              className="flex items-center space-x-3 p-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
            >
              <span className="text-2xl">🔗</span>
              <span className="font-semibold">Affiliate Networks</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Getting Started
          </h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start space-x-3">
              <span className="text-xl">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Create Categories</p>
                <p className="text-sm">Organize your deals by categories</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Add Deals</p>
                <p className="text-sm">Start adding deals with prices and links</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Configure Affiliate</p>
                <p className="text-sm">Setup affiliate networks for tracking</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-xl">4️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Track Performance</p>
                <p className="text-sm">Monitor clicks and conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
