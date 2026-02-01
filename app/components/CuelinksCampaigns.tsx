"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface CuelinksCampaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  url: string;
  couponCode: string | null;
  cashback: string | null;
}

export default function CuelinksCampaigns() {
  const [campaigns, setCampaigns] = useState<CuelinksCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch("/api/cuelinks/campaigns");
        const data = await response.json();

        if (response.ok) {
          setCampaigns(data);
        } else {
          setError(data.error || "Failed to load campaigns");
        }
      } catch (err) {
        setError("Failed to connect to Cuelinks API");
        console.error("Cuelinks fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No campaigns available at the moment.</p>
        <p className="text-sm text-gray-400 mt-2">Check back later for amazing deals!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-48 bg-gray-100">
            {campaign.imageUrl ? (
              <img
                src={campaign.imageUrl}
                alt={campaign.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
            {campaign.couponCode && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {campaign.couponCode}
              </div>
            )}
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
              {campaign.name}
            </h3>
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {campaign.description}
            </p>

            {campaign.categories && campaign.categories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {campaign.categories.slice(0, 3).map((cat) => (
                  <span
                    key={cat}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {campaign.cashback && (
              <div className="mb-3">
                <span className="text-sm font-medium text-green-600">
                  💰 {campaign.cashback} Cashback
                </span>
              </div>
            )}

            <a
              href={campaign.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-primary to-secondary text-white text-center py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Get Deal
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
