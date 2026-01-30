"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DealsTable({ initialDeals }: { initialDeals: any[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const router = useRouter();

  async function toggleStatus(dealId: string, currentStatus: string) {
    const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    try {
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setDeals(
          deals.map((deal) =>
            deal.id === dealId ? { ...deal, status: newStatus } : deal
          )
        );
        router.refresh();
      } else {
        console.error("Failed to update status:", responseData.error);
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update deal status:", error);
      alert("Failed to update deal status");
    }
  }

  async function deleteDeal(dealId: string) {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/deals/${dealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeals(deals.filter((deal) => deal.id !== dealId));
        alert("Deal deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete deal"}`);
      }
    } catch (error) {
      console.error("Failed to delete deal:", error);
      alert("Failed to delete deal");
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Category
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
          {deals.map((deal) => (
            <tr key={deal.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">{deal.title}</p>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {deal.category?.name || "Uncategorized"}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(deal.id, deal.status)}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    deal.status === "PUBLISHED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {deal.status}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/deals/${deal.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteDeal(deal.id)}
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
