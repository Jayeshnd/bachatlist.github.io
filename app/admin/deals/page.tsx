"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DealsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Check auth and redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch deals on mount
  useEffect(() => {
    if (status === "authenticated") {
      fetchDeals();
    }
  }, [status]);

  async function fetchDeals() {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/deals");
      const data = await response.json();
      setDeals(data);
    } catch (error) {
      console.error("Failed to fetch deals:", error);
    } finally {
      setLoading(false);
    }
  }

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
        // Update local state
        setDeals(
          deals.map((deal) =>
            deal.id === dealId ? { ...deal, status: newStatus } : deal
          )
        );
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
        // Update local state to remove the deal
        setDeals(deals.filter((deal) => deal.id !== dealId));
        alert("Deal deleted successfully");
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage all deals and offers</p>
        </div>
        <Link
          href="/admin/deals/create"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          ➕ New Deal
        </Link>
      </div>

      {/* Deals Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Deals</h2>
        </div>

        {loading ? (
          <p className="px-6 py-4 text-gray-600">Loading...</p>
        ) : deals.length === 0 ? (
          <p className="px-6 py-4 text-gray-600">No deals found</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}
