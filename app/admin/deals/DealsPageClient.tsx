"use client";

import { useState } from "react";
import Link from "next/link";
import { DealsTable } from "./DealsTable";
import { CuelinksImportButton } from "./CuelinksImportButton";

interface Deal {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string | null;
  currentPrice: number;
  originalPrice: number | null;
  discount: number | null;
  currency: string;
  rating: number | null;
  reviewCount: number | null;
  features: string | null;
  images: string;
  primaryImage: string | null;
  productUrl: string;
  affiliateUrl: string | null;
  categoryId: string;
  tags: string | null;
  status: string;
  badge: string | null;
  isFeatured: boolean;
  isExpired: boolean;
  expiresAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  views: number;
  clicks: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  category: any;
}

interface Campaign {
  id: string;
  title: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  url: string;
  couponCode: string | null;
  cashback: string | null;
  storeName: string | null;
  merchantName: string | null;
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

export default function DealsPageClient({ initialDeals }: { initialDeals: Deal[] }) {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [cuelinksLoading, setCuelinksLoading] = useState(false);
  const [cuelinksDeals, setCuelinksDeals] = useState<Campaign[]>([]);
  const [showCuelinks, setShowCuelinks] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchCuelinksDeals() {
    setCuelinksLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchTerm) params.append("search_term", searchTerm);

      const response = await fetch(`/api/cuelinks/campaigns?${params.toString()}`);
      const data = await response.json();

      if (response.ok && data.campaigns) {
        setCuelinksDeals(data.campaigns);
        setShowCuelinks(true);
      } else {
        alert("Failed to fetch Cuelinks campaigns");
      }
    } catch (error) {
      console.error("Error fetching Cuelinks:", error);
      alert("Error connecting to Cuelinks API");
    } finally {
      setCuelinksLoading(false);
    }
  }

  async function importCuelinksDeal(campaign: Campaign) {
    try {
      const response = await fetch("/api/admin/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: campaign.title,
          description: campaign.description,
          shortDesc: campaign.description?.substring(0, 150),
          url: campaign.url,
          currentPrice: 0,
          originalPrice: 0,
          status: "PUBLISHED",
          coupon: campaign.couponCode,
        }),
      });

      if (response.ok) {
        const newDeal = await response.json();
        setDeals([newDeal, ...deals]);
        alert(`Successfully imported: ${campaign.title}`);
      } else {
        const data = await response.json();
        alert(`Failed to import: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import deal");
    }
  }

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").substring(0, 200);
  }

  function getCategoriesArray(categories: any): string[] {
    if (Array.isArray(categories)) return categories;
    if (typeof categories === 'object' && categories !== null) {
      return Object.values(categories);
    }
    return [];
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage all deals and offers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowCuelinks(!showCuelinks);
              if (!showCuelinks) {
                fetchCuelinksDeals();
              }
            }}
            disabled={cuelinksLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            {cuelinksLoading ? "Loading..." : "🔗 Import from Cuelinks"}
          </button>
          <Link
            href="/admin/deals/create"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
          >
            ➕ New Deal
          </Link>
        </div>
      </div>

      {/* Cuelinks Import Section */}
      {showCuelinks && (
        <div className="mb-8 bg-purple-50 rounded-xl border border-purple-200 p-6">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-purple-900">Search & Import from Cuelinks</h2>
            <button
              onClick={() => setShowCuelinks(false)}
              className="ml-auto text-purple-600 hover:text-purple-800"
            >
              ✕ Close
            </button>
          </div>

          {/* Search Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchCuelinksDeals();
              }}
              className="flex-1 min-w-[200px]"
            >
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchCuelinksDeals();
              }}
              className="px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={fetchCuelinksDeals}
              disabled={cuelinksLoading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {cuelinksLoading ? "Searching..." : "🔍 Search"}
            </button>
          </div>

          {/* Results Count */}
          <p className="text-purple-700 mb-4">
            Found {cuelinksDeals.length} offers
          </p>

          {cuelinksDeals.length === 0 ? (
            <p className="text-purple-700">No offers found. Try adjusting your search.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Merchant</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Categories</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-purple-900">Coupon Code</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-purple-900">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {cuelinksDeals.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-purple-50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{campaign.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{stripHtml(campaign.description)}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {campaign.storeName || campaign.merchantName || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {getCategoriesArray(campaign.categories).slice(0, 2).map((cat, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {campaign.couponCode ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">
                            {campaign.couponCode}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">No Coupon</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => importCuelinksDeal(campaign)}
                          className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
                        >
                          Import
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Existing Deals */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Your Deals ({deals.length})</h2>
        </div>
        <DealsTable initialDeals={deals} />
      </div>
    </div>
  );
}
