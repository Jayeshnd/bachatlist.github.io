import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BannersTable } from "./BannersTable";

export default async function BannersPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const banners = await prisma.banner.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
          <p className="text-gray-600 mt-1">Manage homepage banner slider</p>
        </div>
        <Link
          href="/admin/banners/new"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Banner
        </Link>
      </div>

      {/* Banners Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Banners</h2>
        </div>

        {banners.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🖼️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No banners yet</h3>
            <p className="text-gray-600 mb-4">Create your first banner to get started</p>
            <Link
              href="/admin/banners/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Banner
            </Link>
          </div>
        ) : (
          <BannersTable initialBanners={banners} />
        )}
      </div>
    </div>
  );
}
