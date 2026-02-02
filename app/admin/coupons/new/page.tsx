"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CuelinksCampaign {
  id: number | string;
  campaign: string;
  title: string;
  description: string;
  image_url?: string;
  coupon_code?: string;
  url?: string;
  affiliate_url?: string;
}

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cuelinksCampaigns, setCuelinksCampaigns] = useState<CuelinksCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<CuelinksCampaign | null>(null);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Fetch Cuelinks campaigns on mount
  useEffect(() => {
    async function fetchCuelinksCampaigns() {
      try {
        setLoadingCampaigns(true);
        const res = await fetch("/api/cuelinks/campaigns?per_page=100");
        if (res.ok) {
          const data = await res.json();
          if (data.campaigns) {
            setCuelinksCampaigns(data.campaigns);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Cuelinks campaigns:", err);
      } finally {
        setLoadingCampaigns(false);
      }
    }

    fetchCuelinksCampaigns();
  }, []);

  // Handle Cuelinks campaign selection
  const handleCampaignSelect = (campaign: CuelinksCampaign) => {
    setSelectedCampaign(campaign);
    console.log("Selected campaign:", campaign);
    // Auto-fill form fields
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      console.log("Form found, populating fields...");
      const codeInput = form.elements.namedItem('code') as HTMLInputElement;
      const descInput = form.elements.namedItem('description') as HTMLTextAreaElement;
      const storeNameInput = form.elements.namedItem('storeName') as HTMLInputElement;
      const storeLogoInput = form.elements.namedItem('storeLogo') as HTMLInputElement;
      const affiliateUrlInput = form.elements.namedItem('affiliateUrl') as HTMLInputElement;
      
      if (codeInput && campaign.coupon_code) {
        codeInput.value = campaign.coupon_code;
        console.log("Set code:", campaign.coupon_code);
      }
      if (descInput) {
        const descValue = campaign.title || campaign.description || "";
        descInput.value = descValue;
        console.log("Set description:", descValue);
      }
      if (storeNameInput) {
        storeNameInput.value = campaign.campaign;
        console.log("Set storeName:", campaign.campaign);
      }
      if (storeLogoInput && campaign.image_url) {
        storeLogoInput.value = campaign.image_url;
        console.log("Set storeLogo:", campaign.image_url);
      }
      if (affiliateUrlInput && campaign.affiliate_url) {
        affiliateUrlInput.value = campaign.affiliate_url;
        console.log("Set affiliateUrl:", campaign.affiliate_url);
      }
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Form submission data:", JSON.stringify(data, null, 2));
    
    // Debug: Check individual fields
    console.log("storeName:", data.storeName);
    console.log("storeLogo:", data.storeLogo);
    console.log("affiliateUrl:", data.affiliateUrl);

    try {
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push("/admin/coupons");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to create coupon");
      }
    } catch (err) {
      setError("Failed to create coupon");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/coupons"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create New Coupon</h1>
            <p className="text-gray-600 mt-1">Add a new coupon code for promotions</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
        >
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Cuelinks Campaign Selector */}
          <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🔗</span>
              Import from Cuelinks
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Select a campaign from Cuelinks to auto-fill the coupon details
            </p>
            {loadingCampaigns ? (
              <div className="text-center py-4">
                <span className="text-gray-500">Loading campaigns...</span>
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                {cuelinksCampaigns.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No campaigns available. Enter details manually below.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2">
                    {cuelinksCampaigns.map((campaign) => (
                      <button
                        key={campaign.id}
                        type="button"
                        onClick={() => handleCampaignSelect(campaign)}
                        className={`flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all ${
                          selectedCampaign?.id === campaign.id
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        {campaign.image_url && (
                          <img
                            src={campaign.image_url}
                            alt={campaign.campaign}
                            className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          />
                        )}
                        <span className="truncate">{campaign.campaign}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            {selectedCampaign && (
              <div className="mt-2 text-sm text-green-600">
                ✓ Selected: {selectedCampaign.campaign}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Coupon Code */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code *
              </label>
              <input
                type="text"
                name="code"
                required
                placeholder="e.g., SAVE20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                placeholder="Describe this coupon..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Affiliate URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate URL
              </label>
              <input
                type="url"
                name="affiliateUrl"
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Store name will be auto-extracted from URL if not provided
              </p>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store/Merchant Name
              </label>
              <input
                type="text"
                name="storeName"
                placeholder="e.g., Amazon, Flipkart, Myntra"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Store Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo URL
              </label>
              <input
                type="url"
                name="storeLogo"
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                name="discountType"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount (₹)</option>
              </select>
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Value *
              </label>
              <input
                type="number"
                name="discountValue"
                required
                min="0"
                step="0.01"
                placeholder="e.g., 20"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Minimum Purchase */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Purchase (₹)
              </label>
              <input
                type="number"
                name="minPurchase"
                min="0"
                step="0.01"
                placeholder="e.g., 500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Maximum Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Discount (₹)
              </label>
              <input
                type="number"
                name="maxDiscount"
                min="0"
                step="0.01"
                placeholder="e.g., 1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                name="usageLimit"
                min="1"
                placeholder="e.g., 100 (Leave empty for unlimited)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                name="expiryDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">
                  Active (Coupon is available for use)
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
            <Link
              href="/admin/coupons"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
