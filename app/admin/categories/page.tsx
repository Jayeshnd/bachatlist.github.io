"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Are you sure?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete");
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      alert("Failed to delete category");
    }
  }

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

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <p className="px-6 py-4 text-gray-600">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="px-6 py-4 text-gray-600">No categories found</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
