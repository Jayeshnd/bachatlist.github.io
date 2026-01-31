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

// Fallback static data when API fails
const fallbackCoupons: CouponCode[] = [
  {
    id: "1",
    code: "AMAZON500",
    description: "Get flat ₹500 off on minimum purchase of ₹2000 on Fashion items",
    discountType: "FIXED_AMOUNT",
    discountValue: 500,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    minPurchase: 2000,
    maxDiscount: null,
    usageLimit: null,
    usageCount: 1245,
    applicableCategories: null,
    applicableDeals: null,
    metaTitle: null,
    metaDescription: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/coupons");
        if (res.ok) {
          const data = await res.json();
          setCoupons(data);
        } else {
          setCoupons(fallbackCoupons);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        setCoupons(fallbackCoupons);
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

  const formatDiscount = (coupon: CouponCode) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}% OFF`;
    }
    return `₹${coupon.discountValue} OFF`;
  };

  const formatExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return "No expiry";
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Expired";
    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.ceil(days / 7)} week${days > 7 ? "s" : ""}`;
    return `${Math.ceil(days / 30)} month${days > 60 ? "s" : ""}`;
  };

  const getStoreIcon = (code: string) => {
    if (code.includes("AMAZON") || code.includes("AMZ")) return "📦";
    if (code.includes("FLIP")) return "🛒";
    if (code.includes("MYNTRA")) return "👕";
    if (code.includes("AJIO")) return "👗";
    if (code.includes("PAYTM") || code.includes("SNAP")) return "💳";
    return "🏷️";
  };

  const getStoreName = (code: string) => {
    if (code.includes("AMAZON") || code.includes("AMZ")) return "Amazon";
    if (code.includes("FLIP")) return "Flipkart";
    if (code.includes("MYNTRA")) return "Myntra";
    if (code.includes("AJIO")) return "Ajio";
    if (code.includes("PAYTM")) return "Paytm";
    if (code.includes("SNAP")) return "Snapdeal";
    return "Store";
  };

  const filteredCoupons =
    activeCategory === "All"
      ? coupons
      : coupons.filter((c) => {
          const storeName = getStoreName(c.code);
          return storeName === activeCategory;
        });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎫 Verified Coupons
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Working Coupon Codes</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse and copy verified coupon codes that actually work
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-slate-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.name
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Coupons Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {activeCategory} Coupons
          </h2>
          <span className="text-sm text-gray-500">
            {filteredCoupons.length} coupons found
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="text-gray-500 mt-4">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No coupons found in this category.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                        {getStoreIcon(coupon.code)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">{coupon.code}</h3>
                        <p className="text-xs text-slate-500">{getStoreName(coupon.code)}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                      {formatDiscount(coupon)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 text-sm mb-4">{coupon.description || "No description available"}</p>

                  {/* Terms */}
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>📦 Min: ₹{coupon.minPurchase ? Number(coupon.minPurchase) : 0}</span>
                    <span>⏰ Expires: {formatExpiry(coupon.expiryDate)}</span>
                    <span className="text-success-600 font-medium">✓ Verified</span>
                  </div>

                  {/* Code Section */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-slate-100 rounded-lg px-4 py-3 font-mono font-bold text-lg text-slate-800 text-center tracking-wider">
                      {coupon.code}
                    </div>
                    <button
                      onClick={() => copyToClipboard(coupon.code, coupon.id)}
                      className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                        copiedId === coupon.id
                          ? "bg-success-600 text-white"
                          : "bg-primary-600 text-white hover:bg-primary-700"
                      }`}
                    >
                      {copiedId === coupon.id ? "✓ Copied!" : "Copy Code"}
                    </button>
                  </div>

                  {/* Used Count */}
                  <p className="text-xs text-slate-400 mt-3 text-center">
                    {coupon.usageCount.toLocaleString()} people used this today
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How to Use */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">How to Use Coupons</h2>
            <p className="text-slate-600">Simple steps to apply coupon codes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: "🔍", title: "Find Coupon", desc: "Browse and find the best coupon for you" },
              { step: 2, icon: "📋", title: "Copy Code", desc: "Click on the coupon to copy the code" },
              { step: 3, icon: "🛒", title: "Shop", desc: "Add items to your cart" },
              { step: 4, icon: "💰", title: "Apply", desc: "Paste the code at checkout" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-success-600 font-bold text-sm mb-1">Step {item.step}</div>
                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Get More Savings!
          </h2>
          <p className="text-slate-300 mb-6">
            Join our Telegram channel for exclusive coupons and deals
          </p>
          <a
            href="/telegram"
            className="inline-flex items-center gap-2 bg-white text-slate-800 px-8 py-3 rounded-xl font-semibold hover:bg-slate-100 transition shadow-lg"
          >
            Join Telegram 🔔
          </a>
        </div>
      </section>
    </div>
  );
}
