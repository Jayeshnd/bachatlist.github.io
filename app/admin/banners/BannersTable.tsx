"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function BannersTable({ initialBanners }: { initialBanners: any[] }) {
  const [banners, setBanners] = useState(initialBanners);
  const router = useRouter();

  async function toggleStatus(bannerId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setBanners(
          banners.map((banner) =>
            banner.id === bannerId ? { ...banner, isActive: !currentStatus } : banner
          )
        );
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update banner status:", error);
      alert("Failed to update banner status");
    }
  }

  async function deleteBanner(bannerId: string) {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBanners(banners.filter((banner) => banner.id !== bannerId));
        alert("Banner deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete banner"}`);
      }
    } catch (error) {
      console.error("Failed to delete banner:", error);
      alert("Failed to delete banner");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Banner
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Position
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
          {banners.map((banner) => (
            <tr key={banner.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="w-20 h-12 rounded-lg overflow-hidden bg-gray-100">
                  {banner.imageUrl ? (
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || "Banner"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      🖼️
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{banner.title || "No title"}</p>
                {banner.subtitle && (
                  <p className="text-sm text-gray-500 truncate max-w-xs">
                    {banner.subtitle}
                  </p>
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">{banner.position}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(banner.id, banner.isActive)}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    banner.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {banner.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/banners/${banner.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteBanner(banner.id)}
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
