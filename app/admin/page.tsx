import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch stats
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
      icon: "🏷️",
      color: "from-blue-500 to-blue-600",
      link: "/admin/deals",
    },
    {
      label: "Published",
      value: publishedDeals,
      icon: "✅",
      color: "from-green-500 to-green-600",
      link: "/admin/deals?status=published",
    },
    {
      label: "Drafts",
      value: draftDeals,
      icon: "📝",
      color: "from-yellow-500 to-yellow-600",
      link: "/admin/deals?status=draft",
    },
    {
      label: "Categories",
      value: categories,
      icon: "📁",
      color: "from-purple-500 to-purple-600",
      link: "/admin/categories",
    },
    {
      label: "Total Clicks",
      value: totalClicks,
      icon: "👆",
      color: "from-pink-500 to-pink-600",
      link: "/admin/analytics",
    },
  ];

  const quickActions = [
    {
      label: "Create New Deal",
      icon: "➕",
      href: "/admin/deals/create",
      color: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    },
    {
      label: "Manage Categories",
      icon: "📁",
      href: "/admin/categories",
      color: "bg-gray-100 text-gray-900",
    },
    {
      label: "Affiliate Networks",
      icon: "🔗",
      href: "/admin/affiliate",
      color: "bg-gray-100 text-gray-900",
    },
    {
      label: "View Analytics",
      icon: "📊",
      href: "/admin/analytics",
      color: "bg-gray-100 text-gray-900",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to BachatList Admin Panel</p>
      </div>

      {dbError && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">⚠️ Database Connection Error</p>
          <p className="text-red-600 text-sm mt-1">
            Unable to connect to the database. Please check if your database server is running and accessible.
          </p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.link}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center gap-3 p-4 rounded-lg transition ${action.color} hover:opacity-90`}
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Getting Started
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Create Categories</p>
                <p className="text-sm text-gray-600">Organize your deals by categories</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Add Deals</p>
                <p className="text-sm text-gray-600">Start adding deals with prices and links</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Configure Affiliate</p>
                <p className="text-sm text-gray-600">Setup affiliate networks for tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xl">4️⃣</span>
              <div>
                <p className="font-semibold text-gray-900">Track Performance</p>
                <p className="text-sm text-gray-600">Monitor clicks and conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
