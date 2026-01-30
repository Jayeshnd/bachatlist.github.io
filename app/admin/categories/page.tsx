import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CategoriesTable } from "./CategoriesTable";

export default async function CategoriesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: {
        select: { deals: true },
      },
    },
  });

  const categoriesWithDealCount = categories.map(category => ({
    ...category,
    dealCount: category._count.deals,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Manage product categories</p>
        </div>
        <Link
          href="/admin/categories/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          ➕ New Category
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {categories.length === 0 ? (
          <p className="px-6 py-4 text-gray-600">No categories found</p>
        ) : (
          <CategoriesTable initialCategories={categoriesWithDealCount} />
        )}
      </div>
    </div>
  );
}
