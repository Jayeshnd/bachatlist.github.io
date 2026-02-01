"use client";

import { useState } from "react";
import Link from "next/link";
import { CouponsTable } from "./CouponsTable";

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  expiryDate: string | null;
  isActive: boolean;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Campaign {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  categories: string[];
  url: string;
  couponCode: string | null;
  cashback: string | null;
}

export default function CouponsPageClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [cuelinksLoading, setCuelinksLoading] = useState(false);
  const [cuelinksCoupons, setCuelinksCoupons] = useState<Campaign[]>([]);
  const [showCuelinks, setShowCuelinks] = useState(false);

  async function fetchCuelinksCoupons() {
    setCuelinksLoading(true);
    try {
      const response = await fetch("/api/cuelinks/campaigns");
      const data = await response.json();

      if (response.ok && data.campaigns) {
        const couponCampaigns = data.campaigns.filter((c: Campaign) => c.couponCode);
        setCuelinksCoupons(couponCampaigns);
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

  async function importCuelinksCoupon(campaign: Campaign) {
    try {
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: campaign.couponCode,
          description: campaign.description?.substring(0, 300) || "Imported from Cuelinks",
          discountType: "percentage",
          discountValue: campaign.cashback ? parseFloat(campaign.cashback.replace(/[^0-9.]/g, "")) : 10,
          isActive: true,
        }),
      });

      if (response.ok) {
        const newCoupon = await response.json();
        setCoupons([newCoupon, ...coupons]);
        alert(`Successfully imported coupon: ${campaign.couponCode}`);
      } else {
        const data = await response.json();
        alert(`Failed to import: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Import error:", error);
      alert("Failed to import coupon");
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Codes</h1>
          <p className="text-gray-600 mt-1">Manage all coupon codes and promotions</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCuelinksCoupons}
            disabled={cuelinksLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-purple-500/25 disabled:opacity-50"
          >
            {cuelinksLoading ? "Loading..." : "Import from Cuelinks"}
          </button>
          <Link
            href="/admin/coupons/new"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
          >
            New Coupon
          </Link>
        </div>
      </div>

      {showCuelinks && (
        <div className="mb-8 bg-purple-50 rounded-xl border border-purple-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-900">Cuelinks Available Coupons</h2>
            <button
              onClick={() => setShowCuelinks(false)}
              className="text-purple-600 hover:text-purple-800"
            >
              Close
            </button>
          </div>

          {cuelinksCoupons.length === 0 ? (
            <p className="text-purple-700">No coupons available from Cuelinks.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cuelinksCoupons.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                      {campaign.couponCode}
                    </span>
                    {campaign.cashback && (
                      <span className="text-sm text-gray-500">{campaign.cashback}</span>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{campaign.description}</p>
                  <button
                    onClick={() => importCuelinksCoupon(campaign)}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                  >
                    Import Coupon
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Coupons</h2>
        </div>

        {coupons.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons yet</h3>
            <p className="text-gray-600 mb-4">Create your first coupon code or import from Cuelinks</p>
            <Link
              href="/admin/coupons/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Coupon
            </Link>
          </div>
        ) : (
          <CouponsTable initialCoupons={coupons} />
        )}
      </div>
    </div>
  );
}
