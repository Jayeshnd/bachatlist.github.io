"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HotDealsTable({ initialHotDeals }: { initialHotDeals: any[] }) {
  const [hotDeals, setHotDeals] = useState(initialHotDeals);
  const router = useRouter();

  async function toggleStatus(hotDealId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/hot-deals/${hotDealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setHotDeals(
          hotDeals.map((hd) =>
            hd.id === hotDealId ? { ...hd, isActive: !currentStatus } : hd
          )
        );
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Failed to update hot deal status:", error);
      alert("Failed to update hot deal status");
    }
  }

  async function toggleHomepage(hotDealId: string, currentValue: boolean) {
    try {
      const response = await fetch(`/api/admin/hot-deals/${hotDealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHomepage: !currentValue }),
      });

      if (response.ok) {
        setHotDeals(
          hotDeals.map((hd) =>
            hd.id === hotDealId ? { ...hd, showOnHomepage: !currentValue } : hd
          )
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update homepage setting:", error);
    }
  }

  async function toggleLootPage(hotDealId: string, currentValue: boolean) {
    try {
      const response = await fetch(`/api/admin/hot-deals/${hotDealId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnLootPage: !currentValue }),
      });

      if (response.ok) {
        setHotDeals(
          hotDeals.map((hd) =>
            hd.id === hotDealId ? { ...hd, showOnLootPage: !currentValue } : hd
          )
        );
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update loot page setting:", error);
    }
  }

  async function removeFromHotDeals(hotDealId: string) {
    if (!window.confirm("Remove this deal from hot deals?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/hot-deals/${hotDealId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setHotDeals(hotDeals.filter((hd) => hd.id !== hotDealId));
        alert("Deal removed from hot deals");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to remove deal");
      }
    } catch (error) {
      console.error("Failed to remove deal:", error);
      alert("Failed to remove deal from hot deals");
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return;

    const newHotDeals = [...hotDeals];
    [newHotDeals[index - 1], newHotDeals[index]] = [
      newHotDeals[index],
      newHotDeals[index - 1],
    ];

    // Update order values
    newHotDeals.forEach((hd, i) => {
      hd.order = i;
    });

    setHotDeals(newHotDeals);

    // Save to server
    await fetch("/api/admin/hot-deals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotDeals: newHotDeals.map((hd) => ({ id: hd.id, order: hd.order })),
      }),
    });

    router.refresh();
  }

  async function moveDown(index: number) {
    if (index === hotDeals.length - 1) return;

    const newHotDeals = [...hotDeals];
    [newHotDeals[index], newHotDeals[index + 1]] = [
      newHotDeals[index + 1],
      newHotDeals[index],
    ];

    // Update order values
    newHotDeals.forEach((hd, i) => {
      hd.order = i;
    });

    setHotDeals(newHotDeals);

    // Save to server
    await fetch("/api/admin/hot-deals", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotDeals: newHotDeals.map((hd) => ({ id: hd.id, order: hd.order })),
      }),
    });

    router.refresh();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Order
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Deal
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Display
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
          {hotDeals.map((hotDeal, index) => (
            <tr key={hotDeal.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{hotDeal.order + 1}</span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveDown(index)}
                      disabled={index === hotDeals.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {hotDeal.customTitle || hotDeal.deal.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {hotDeal.deal.category?.name || "Uncategorized"}
                  </p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleHomepage(hotDeal.id, hotDeal.showOnHomepage)}
                    className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition ${
                      hotDeal.showOnHomepage
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    onClick={() => toggleLootPage(hotDeal.id, hotDeal.showOnLootPage)}
                    className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition ${
                      hotDeal.showOnLootPage
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    Loot
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(hotDeal.id, hotDeal.isActive)}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    hotDeal.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {hotDeal.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => removeFromHotDeals(hotDeal.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
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
