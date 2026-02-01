"use client";

import { useState, useEffect } from "react";

interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  url: string;
  couponCode: string | null;
  cashback: string | null;
  storeName: string | null;
  categoryName: string | null;
}

const CATEGORIES = [
  { id: "", name: "All Offers" },
  { id: "shopping", name: "🛒 Shopping" },
  { id: "travel", name: "✈️ Travel" },
  { id: "food", name: "🍔 Food" },
  { id: "recharge", name: "📱 Recharge" },
  { id: "fashion", name: "👗 Fashion" },
  { id: "electronics", name: "💻 Electronics" },
  { id: "beauty", name: "💄 Beauty" },
  { id: "fitness", name: "💪 Fitness" },
];

export default function CuelinksAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [selectedCategory]);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchTerm) params.append("search_term", searchTerm);

      const response = await fetch(`/api/cuelinks/campaigns?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setCampaigns(data.campaigns || []);
      } else {
        setError(data.error || "Failed to fetch campaigns");
      }
    } catch (err) {
      setError("Failed to connect to Cuelinks API");
      console.error("Cuelinks fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchCampaigns();
  }

  async function handleImportCampaign(campaign: Campaign) {
    setImporting(campaign.id);
    try {
      const response = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: campaign.name,
          description: campaign.description,
          shortDesc: campaign.description?.substring(0, 150),
          url: campaign.url,
          currentPrice: 0,
          originalPrice: 0,
          categoryId: "default",
          status: "DRAFT",
          coupon: campaign.couponCode,
        }),
      });

      if (response.ok) {
        alert(`Successfully imported "${campaign.name}" as a draft deal!`);
      } else {
        const data = await response.json();
        alert(`Failed to import: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      alert("Failed to import campaign");
      console.error("Import error:", err);
    } finally {
      setImporting(null);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cuelinks Offers</h1>
          <p className="text-gray-600 mt-1">Browse and import offers from Cuelinks</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">{campaigns.length} offers</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </form>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setLoading(true);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => {
              setLoading(true);
              fetchCampaigns();
            }}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Table View - Cuelinks Style */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading offers from Cuelinks...</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No offers found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Merchant</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categories</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Coupon Code</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Valid Till</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="max-w-md">
                        <p className="font-medium text-gray-900 line-clamp-1">{campaign.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{campaign.description?.replace(/<[^>]*>/g, "").substring(0, 100)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {campaign.storeName || campaign.categoryName || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {campaign.categories?.slice(0, 2).map((cat, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {cat}
                          </span>
                        ))}
                        {campaign.categories && campaign.categories.length > 2 && (
                          <span className="text-xs text-gray-500">+{campaign.categories.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {campaign.couponCode ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          {campaign.couponCode}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No Coupon Required</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">2026-12-31</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleImportCampaign(campaign)}
                        disabled={importing === campaign.id}
                        className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 disabled:opacity-50"
                      >
                        {importing === campaign.id ? "Importing..." : "Import"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Info */}
      {!loading && campaigns.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {campaigns.length} offers from Cuelinks
        </div>
      )}
    </div>
  );
}
