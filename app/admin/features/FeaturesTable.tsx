"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Feature {
  id: string;
  title: string;
  icon: string | null;
  description: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  color: string | null;
  backgroundColor: string | null;
}

interface FeaturesTableProps {
  initialFeatures: Feature[];
}

export function FeaturesTable({ initialFeatures }: FeaturesTableProps) {
  const [features, setFeatures] = useState(initialFeatures);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleStatus(featureId: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setFeatures(
          features.map((feature) =>
            feature.id === featureId ? { ...feature, isActive: newStatus } : feature
          )
        );
        router.refresh();
      } else {
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update feature status:", error);
      alert("Failed to update feature status");
    } finally {
      setLoading(false);
    }
  }

  async function deleteFeature(featureId: string) {
    if (!window.confirm("Are you sure you want to delete this feature?")) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFeatures(features.filter((feature) => feature.id !== featureId));
        alert("Feature deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete feature"}`);
      }
    } catch (error) {
      console.error("Failed to delete feature:", error);
      alert("Failed to delete feature");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Icon
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Description
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Order
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {features.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <span className="text-2xl">{feature.icon || "📌"}</span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {feature.isFeatured && (
                    <span className="text-yellow-500" title="Featured">
                      ⭐
                    </span>
                  )}
                  <p className="font-medium text-gray-900">{feature.title}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                {feature.description}
              </td>
              <td className="px-6 py-4 text-gray-600">{feature.order}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(feature.id, feature.isActive)}
                  disabled={loading}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    feature.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {feature.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/features/${feature.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteFeature(feature.id)}
                    disabled={loading}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
