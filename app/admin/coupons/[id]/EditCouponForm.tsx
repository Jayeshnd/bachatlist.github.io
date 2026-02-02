"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditCouponForm({ coupon }: { coupon: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Helper to extract store name from URL
  const extractStoreNameFromUrl = (url: string): string => {
    if (!url) return "";
    try {
      const decodedUrl = decodeURIComponent(url);
      const urlMatch = decodedUrl.match(/url=https?:\/\/([^/]+)/i);
      if (urlMatch) {
        const hostname = urlMatch[1].split('?')[0].split('/')[0];
        return hostname.replace('www.', '').split('.').slice(0, -1).join(' ')
          .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }
      const urlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : 'https://' + decodedUrl);
      const hostname = urlObj.hostname.replace('www.', '');
      return hostname.split('.').slice(0, -1).join(' ')
        .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } catch {
      return "";
    }
  };

  // Handle auto-extract store name from URL
  const handleAffiliateUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const storeNameInput = document.querySelector('input[name="storeName"]') as HTMLInputElement;
    if (storeNameInput && !storeNameInput.value) {
      storeNameInput.value = extractStoreNameFromUrl(url);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        router.push("/admin/coupons");
        router.refresh();
      } else {
        setError(responseData.error || "Failed to update coupon");
      }
    } catch (err) {
      setError("Failed to update coupon");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
    >
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

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
            defaultValue={coupon.code}
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
            defaultValue={coupon.description || ""}
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
            defaultValue={coupon.affiliateUrl || ""}
            placeholder="https://..."
            onChange={handleAffiliateUrlChange}
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
            defaultValue={coupon.storeName || ""}
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
            defaultValue={coupon.storeLogo || ""}
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
            defaultValue={coupon.discountType}
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
            defaultValue={coupon.discountValue}
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
            defaultValue={coupon.minPurchase || ""}
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
            defaultValue={coupon.maxDiscount || ""}
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
            defaultValue={coupon.usageLimit || ""}
            placeholder="e.g., 100 (Leave empty for unlimited)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Usage Count (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Times Used
          </label>
          <input
            type="text"
            value={coupon.usageCount}
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
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
            defaultValue={
              coupon.expiryDate
                ? new Date(coupon.expiryDate).toISOString().split("T")[0]
                : ""
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Active Status */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={coupon.isActive}
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
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
