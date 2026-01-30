"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AddDealForm({ availableDeals }: { availableDeals: any[] }) {
  const router = useRouter();
  const [selectedDealId, setSelectedDealId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAddDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDealId) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/hot-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: selectedDealId }),
      });

      if (response.ok) {
        setSelectedDealId("");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to add deal to hot deals");
      }
    } catch (error) {
      console.error("Failed to add deal:", error);
      alert("Failed to add deal to hot deals");
    } finally {
      setLoading(false);
    }
  }

  if (availableDeals.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>All published deals are already in the hot deals list!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleAddDeal} className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Deal
        </label>
        <select
          value={selectedDealId}
          onChange={(e) => setSelectedDealId(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        >
          <option value="">Select a deal...</option>
          {availableDeals.map((deal) => (
            <option key={deal.id} value={deal.id}>
              {deal.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={!selectedDealId || loading}
        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add to Hot Deals"}
      </button>
    </form>
  );
}
