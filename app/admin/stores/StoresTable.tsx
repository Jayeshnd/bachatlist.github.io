"use client";

import { useState } from "react";
import Link from "next/link";

interface Store {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  logo: string | null;
  color: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StoresTableProps {
  stores: Store[];
}

export default function StoresTable({ stores }: StoresTableProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this store?")) return;

    setLoading(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/stores/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete store");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  const toggleActive = async (store: Store) => {
    setLoading(store.id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/stores/${store.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !store.isActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update store");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          {error}
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Store
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stores.map((store) => (
            <tr key={store.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {store.order}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {store.icon && (
                    <span className="text-2xl mr-3">{store.icon}</span>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {store.name}
                    </div>
                    {store.logo && (
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="h-8 w-auto mt-1"
                      />
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {store.slug}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    store.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {store.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                  href={`/admin/stores/${store.id}`}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleActive(store)}
                  disabled={loading === store.id}
                  className="text-blue-600 hover:text-blue-900 mr-4 disabled:opacity-50"
                >
                  {loading === store.id
                    ? "..."
                    : store.isActive
                    ? "Deactivate"
                    : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  disabled={loading === store.id}
                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                >
                  {loading === store.id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {stores.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No stores found. Create your first store!
        </div>
      )}
    </div>
  );
}
