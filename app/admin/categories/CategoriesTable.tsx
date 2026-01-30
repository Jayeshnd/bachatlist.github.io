"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CategoriesTable({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const router = useRouter();

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setCategories(categories.filter((c) => c.id !== id));
      router.refresh();
    } catch (err) {
      alert("Failed to delete category");
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {category.icon} {category.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {category.description || "No description"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {category.dealCount} deals
              </p>
            </div>
            <div className="flex gap-2 ml-2">
              <Link
                href={`/admin/categories/${category.id}`}
                className="text-primary hover:text-primary/80 text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => deleteCategory(category.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
