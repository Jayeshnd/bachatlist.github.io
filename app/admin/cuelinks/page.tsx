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
    setLoading(true);
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
          currentPrice: 0,
          originalPrice: 0,
          productUrl: campaign.url,
          affiliateUrl: campaign.url,
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

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">💰 Cuelinks Offers</h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">💰 Cuelinks Offers</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <button
          onClick={fetchCampaigns}
          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">💰 Cuelinks Offers</h1>
        <button
          onClick={fetchCampaigns}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search offers (e.g., amazon, flipkart)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setLoading(true);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <p className="text-gray-600 mb-4">
        Showing {campaigns.length} offers
        {selectedCategory && ` in ${CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
        {searchTerm && ` for "${searchTerm}"`}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">No offers available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition"
            >
              <div className="h-48 bg-gray-100 relative">
                {campaign.imageUrl ? (
                  <img
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                {campaign.couponCode && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {campaign.couponCode}
                  </div>
                )}
                {campaign.categoryName && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {campaign.categoryName}
                  </div>
                )}
              </div>

              <div className="p-4">
                {campaign.storeName && (
                  <p className="text-xs text-gray-500 mb-1">{campaign.storeName}</p>
                )}
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {campaign.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {campaign.description}
                </p>

                {campaign.cashback && (
                  <div className="mb-3">
                    <span className="text-sm font-medium text-green-600">
                      💰 {campaign.cashback}
                    </span>
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={campaign.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-100 text-gray-700 text-center py-2 rounded-lg text-sm font-medium hover:bg-gray-200"
                  >
                    View Offer
                  </a>
                  <button
                    onClick={() => handleImportCampaign(campaign)}
                    disabled={importing === campaign.id}
                    className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  >
                    {importing === campaign.id ? "Importing..." : "Import"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
