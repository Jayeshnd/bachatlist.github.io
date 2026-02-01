"use client";

import { useState, useEffect } from "react";

interface CouponCode {
  id: string;
  code: string;
  description: string | null;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  expiryDate: string | null;
  isActive: boolean;
  minPurchase: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  applicableCategories: string | null;
  applicableDeals: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { name: "All", active: true },
  { name: "Amazon", active: false },
  { name: "Flipkart", active: false },
  { name: "Myntra", active: false },
  { name: "Ajio", active: false },
  { name: "Electronics", active: false },
  { name: "Fashion", active: false },
];

export default function CouponPage() {
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Get static fallback data without dynamic dates to avoid hydration mismatch
  const getFallbackCoupons = (): CouponCode[] => [
    {
      id: "1",
      code: "AMAZON500",
      description: "Get flat ₹500 off on minimum purchase of ₹2000 on Fashion items",
      discountType: "FIXED_AMOUNT",
      discountValue: 500,
      expiryDate: null,
      isActive: true,
      minPurchase: 2000,
      maxDiscount: null,
      usageLimit: null,
      usageCount: 1245,
      applicableCategories: null,
      applicableDeals: null,
      metaTitle: null,
      metaDescription: null,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  ];

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/coupons");
        if (res.ok) {
          const data = await res.json();
          setCoupons(data);
        } else {
          setCoupons(getFallbackCoupons());
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        setCoupons(getFallbackCoupons());
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, []);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCoupons = coupons.filter((coupon) => {
    if (activeCategory === "All") return true;
    // Simple category matching based on description
    const desc = coupon.description?.toLowerCase() || "";
    return desc.includes(activeCategory.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading coupons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-gradient-to-r from-green-600 to-green-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-2">🎫 Coupon Codes</h1>
          <p className="text-green-100 text-lg">Save money with exclusive coupon codes</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeCategory === cat.name
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-green-600">{coupons.length}</p>
              <p className="text-gray-500 text-sm">Total Coupons</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{coupons.filter((c) => c.isActive).length}</p>
              <p className="text-gray-500 text-sm">Active</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-600">{coupons.filter((c) => c.discountType === "PERCENTAGE").length}</p>
              <p className="text-gray-500 text-sm">% Off</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">{coupons.filter((c) => c.discountType === "FIXED_AMOUNT").length}</p>
              <p className="text-gray-500 text-sm">₹ Off</p>
            </div>
          </div>
        </div>

        {/* Coupons Grid */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No coupons found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                  coupon.isActive ? "border-green-100" : "border-gray-100 opacity-60"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          coupon.discountType === "PERCENTAGE"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      </span>
                      {coupon.isActive ? (
                        <span className="ml-2 inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                          Verified
                        </span>
                      ) : (
                        <span className="ml-2 inline-block px-2 py-1 bg-gray-400 text-white text-xs rounded-full">
                          Expired
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800 mb-2">
                    {coupon.description || "Special discount coupon"}
                  </h3>

                  {coupon.minPurchase && (
                    <p className="text-sm text-gray-500 mb-3">📦 Min: ₹{coupon.minPurchase}</p>
                  )}

                  {coupon.expiryDate && (
                    <p className="text-sm text-gray-500 mb-3">
                      ⏰ Expires: {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono font-bold text-lg text-gray-700">
                        {coupon.code}
                      </code>
                    </div>
                    <button
                      onClick={() => copyToClipboard(coupon.code, coupon.id)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        copiedId === coupon.id
                          ? "bg-green-600 text-white"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {copiedId === coupon.id ? "✓ Copied" : "Copy Code"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 BachatList. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Find the best deals and coupons in India</p>
        </div>
      </footer>
    </div>
  );
}
