"use client";

import { useState, useEffect, useCallback } from "react";

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
  affiliateUrl?: string | null;
  // Store/Merchant Info
  storeName: string | null;
  storeLogo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { name: "All", icon: "🏷️" },
  { name: "Amazon", icon: "📦" },
  { name: "Flipkart", icon: "🛒" },
  { name: "Myntra", icon: "👗" },
  { name: "Ajio", icon: "👔" },
  { name: "Fashion", icon: "🛍️" },
  { name: "Electronics", icon: "💻" },
  { name: "Beauty", icon: "💄" },
  { name: "Food", icon: "🍔" },
  { name: "Travel", icon: "✈️" },
  { name: "Recharge", icon: "📱" },
  { name: "Home", icon: "🏠" },
];

// Skeleton loader component
function CouponSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-20 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="p-5 space-y-4">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}

export default function CouponPage() {
  const [coupons, setCoupons] = useState<CouponCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Strip HTML tags from description
  const stripHtml = useCallback((html: string | null): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }, []);

  // Get categories array from coupon
  const getCouponCategories = useCallback((coupon: CouponCode): string[] => {
    const desc = stripHtml(coupon.description).toLowerCase();
    const couponCode = coupon.code.toLowerCase();
    const categories: string[] = [];

    if (desc.includes("amazon") || couponCode.includes("amazon")) categories.push("Amazon");
    if (desc.includes("flipkart") || couponCode.includes("flipkart")) categories.push("Flipkart");
    if (desc.includes("myntra") || couponCode.includes("myntra")) categories.push("Myntra");
    if (desc.includes("ajio") || couponCode.includes("ajio")) categories.push("Ajio");
    if (desc.includes("fashion") || desc.includes("clothing") || desc.includes("wear")) categories.push("Fashion");
    if (desc.includes("electronics") || desc.includes("laptop") || desc.includes("phone")) categories.push("Electronics");
    if (desc.includes("beauty") || desc.includes("makeup") || desc.includes("skincare")) categories.push("Beauty");
    if (desc.includes("food") || desc.includes("grocery") || desc.includes("restaurant")) categories.push("Food");
    if (desc.includes("travel") || desc.includes("flight") || desc.includes("hotel")) categories.push("Travel");
    if (desc.includes("recharge") || desc.includes("mobile") || desc.includes("phone")) categories.push("Recharge");
    if (desc.includes("home") || desc.includes("kitchen") || desc.includes("furniture")) categories.push("Home");

    return categories.length > 0 ? categories : ["General"];
  }, [stripHtml]);

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesCategory = activeCategory === "All" || getCouponCategories(coupon).includes(activeCategory);
    const matchesSearch = searchTerm === "" || 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stripHtml(coupon.description).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats
  // Removed stats cards section - keeping only for reference
  // const stats = {
  //   total: coupons.length,
  //   active: coupons.filter((c) => c.isActive).length,
  //   percentage: coupons.filter((c) => c.discountType === "PERCENTAGE").length,
  //   fixed: coupons.filter((c) => c.discountType === "FIXED_AMOUNT").length,
  // };

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await fetch("/api/coupons");
        if (res.ok) {
          const data = await res.json();
          setCoupons(data);
        }
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, []);

  const copyToClipboard = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Skeleton */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="h-12 bg-white/20 rounded-lg w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-white/20 rounded w-64 mx-auto animate-pulse"></div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Categories Skeleton */}

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <CouponSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <span className="text-6xl filter drop-shadow-lg">🎫</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-3 tracking-tight">
            Coupon Codes
          </h1>
          <p className="text-green-100 text-lg md:text-xl text-center">
            Unlock exclusive discounts and save big on every purchase
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for stores or coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-700 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl text-lg transition-all"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" className="w-full h-auto fill-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeCategory === cat.name
                  ? "bg-green-600 text-white shadow-lg shadow-green-600/30"
                  : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200 hover:border-green-200"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* View Toggle & Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-green-600">{filteredCoupons.length}</span> coupons found
            {activeCategory !== "All" && <span> in <span className="font-semibold">{activeCategory}</span></span>}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Coupons */}
        {filteredCoupons.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-7xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No coupons found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or category filter</p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSearchTerm("");
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Coupons
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  coupon.isActive ? "border-green-100" : "border-gray-100 opacity-60"
                }`}
              >
                {/* Discount Badge */}
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  <div className="relative text-center">
                    <span className="inline-block px-5 py-2 bg-white rounded-full text-2xl font-bold text-green-600 shadow-lg">
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Merchant/Store Info */}
                  {(coupon.storeName || coupon.storeLogo) && (
                    <div className="flex items-center gap-2 mb-3">
                      {coupon.storeLogo && (
                        <img
                          src={coupon.storeLogo}
                          alt={coupon.storeName || "Store"}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      {coupon.storeName && (
                        <span className="text-sm font-medium text-gray-600">
                          {coupon.storeName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <h3 className="font-semibold text-gray-800 mb-3 text-lg leading-relaxed line-clamp-2">
                    {stripHtml(coupon.description) || "Special discount coupon"}
                  </h3>

                  {/* Terms */}
                  <div className="space-y-2 mb-4">
                    {coupon.minPurchase && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">📦</span>
                        <span>Min. Order: ₹{coupon.minPurchase.toLocaleString()}</span>
                      </div>
                    )}
                    {coupon.maxDiscount && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">💰</span>
                        <span>Max Discount: ₹{coupon.maxDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    {coupon.expiryDate && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">⏰</span>
                        <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    )}
                    {coupon.usageCount > 0 && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">👥</span>
                        <span>Used {coupon.usageCount.toLocaleString()} times</span>
                      </div>
                    )}
                  </div>

                  {/* Verified Badge */}
                  {coupon.isActive && (
                    <div className="flex items-center justify-center mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <span className="mr-1">✓</span> Verified
                      </span>
                    </div>
                  )}

                  {/* Code Copy */}
                  <div className="relative mb-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2 border-2 border-dashed border-gray-200">
                      <code className="flex-1 text-center font-mono font-bold text-lg text-gray-700 truncate px-2">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code, coupon.id)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all whitespace-nowrap ${
                          copiedId === coupon.id
                            ? "bg-green-600 text-white"
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                        }`}
                      >
                        {copiedId === coupon.id ? "✓ Copied!" : "Copy Code"}
                      </button>
                    </div>
                  </div>

                  {/* Visit Store Button */}
                  {coupon.affiliateUrl && (
                    <a
                      href={coupon.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition shadow-lg hover:shadow-xl mb-3"
                    >
                      🏪 Visit Store & Get Deal
                    </a>
                  )}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    Powered by BachatList • Terms apply
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${
                  coupon.isActive ? "border-green-100" : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Discount Badge */}
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white flex items-center justify-center md:w-40">
                    <div className="text-center">
                      <span className="block text-3xl font-bold">
                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                      </span>
                      <span className="text-sm opacity-90">OFF</span>
                    </div>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        {/* Merchant/Store Info */}
                        {(coupon.storeName || coupon.storeLogo) && (
                          <div className="flex items-center gap-2 mb-2">
                            {coupon.storeLogo && (
                              <img
                                src={coupon.storeLogo}
                                alt={coupon.storeName || "Store"}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                            )}
                            {coupon.storeName && (
                              <span className="text-sm font-medium text-gray-600">
                                {coupon.storeName}
                              </span>
                            )}
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                          {stripHtml(coupon.description) || "Special discount coupon"}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                          {coupon.minPurchase && <span>📦 Min ₹{coupon.minPurchase.toLocaleString()}</span>}
                          {coupon.expiryDate && <span>⏰ {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}</span>}
                          {coupon.isActive && <span className="text-green-600">✓ Verified</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-2">
                          <code className="font-mono font-bold text-lg text-gray-700">{coupon.code}</code>
                          <button
                            onClick={() => copyToClipboard(coupon.code, coupon.id)}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                              copiedId === coupon.id
                                ? "bg-green-600 text-white"
                                : "bg-green-600 text-white hover:bg-green-700"
                            }`}
                          >
                            {copiedId === coupon.id ? "✓" : "Copy"}
                          </button>
                        </div>
                        {coupon.affiliateUrl && (
                          <a
                            href={coupon.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                          >
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-16 mt-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">💰 Save More Every Day!</h2>
          <p className="text-green-100 text-lg mb-8">Subscribe to get the latest coupons and deals delivered to your inbox</p>
          <div className="flex flex-wrap justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-full text-gray-700 w-full md:w-80 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl"
            />
            <button className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 BachatList. All rights reserved.</p>
          <p className="text-gray-500 text-sm mt-2">Find the best deals and coupons in India</p>
        </div>
      </footer>
    </div>
  );
}
