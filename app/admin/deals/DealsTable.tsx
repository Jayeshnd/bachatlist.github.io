"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function DealsTable({ initialDeals }: { initialDeals: any[] }) {
  const [deals, setDeals] = useState(initialDeals);
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Toggle single deal selection
  function toggleSelect(dealId: string) {
    const newSelected = new Set(selectedDeals);
    if (newSelected.has(dealId)) {
      newSelected.delete(dealId);
    } else {
      newSelected.add(dealId);
    }
    setSelectedDeals(newSelected);
  }

  // Select/deselect all
  function toggleSelectAll() {
    if (selectedDeals.size === deals.length) {
      setSelectedDeals(new Set());
    } else {
      setSelectedDeals(new Set(deals.map((d) => d.id)));
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
        setSelectedDeals((prev) => {
          const newSet = new Set(prev);
          newSet.delete(dealId);
          return newSet;
        });
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

  async function deleteSelectedDeals() {
    if (selectedDeals.size === 0) {
      alert("Please select deals to delete");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedDeals.size} deals?`)) {
      return;
    }

    setIsDeleting(true);
    let deleted = 0;
    let failed = 0;

    for (const dealId of selectedDeals) {
      try {
        const response = await fetch(`/api/admin/deals/${dealId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          deleted++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    }

    // Remove deleted deals from list
    setDeals(deals.filter((deal) => !selectedDeals.has(deal.id)));
    setSelectedDeals(new Set());
    setIsDeleting(false);
    router.refresh();

    alert(`Deleted: ${deleted}\nFailed: ${failed}`);
  }

  return (
    <div>
      {/* Bulk Actions Bar */}
      {selectedDeals.size > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4 flex items-center justify-between">
          <span className="text-purple-800 font-medium">
            {selectedDeals.size} deal{selectedDeals.size !== 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={deleteSelectedDeals}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin">⏳</span> Deleting...
                </>
              ) : (
                <>
                  <span>🗑️</span> Delete Selected
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                <input
                  type="checkbox"
                  checked={selectedDeals.size === deals.length && deals.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
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
                  <input
                    type="checkbox"
                    checked={selectedDeals.has(deal.id)}
                    onChange={() => toggleSelect(deal.id)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </td>
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

      {deals.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-600">No deals found</p>
        </div>
      )}
    </div>
  );
}
