"use client";

import { useState } from "react";

const coupons = [
  {
    id: 1,
    code: "AMAZON500",
    title: "Flat ₹500 Off on Fashion",
    description: "Get flat ₹500 off on minimum purchase of ₹2000 on Fashion items",
    store: "Amazon",
    category: "Fashion",
    discount: "₹500 OFF",
    minOrder: 2000,
    expiringIn: "2 days",
    verified: true,
    usedToday: 1245,
  },
  {
    id: 2,
    code: "FLIP20",
    title: "20% Off on Electronics",
    description: "Get 20% off on all Electronics items. Maximum discount ₹2000",
    store: "Flipkart",
    category: "Electronics",
    discount: "20% OFF",
    minOrder: 1000,
    expiringIn: "5 days",
    verified: true,
    usedToday: 892,
  },
  {
    id: 3,
    code: "MYNTRA150",
    title: "Flat ₹150 Off on Orders Above ₹799",
    description: "Valid on all prepaid orders. First time users get extra 10%",
    store: "Myntra",
    category: "Fashion",
    discount: "₹150 OFF",
    minOrder: 799,
    expiringIn: "1 week",
    verified: true,
    usedToday: 2103,
  },
  {
    id: 4,
    code: "AJIO500",
    title: "₹500 Off on ₹1999+",
    description: "Flat ₹500 off on orders above ₹1999. Applicable on all categories",
    store: "Ajio",
    category: "Fashion",
    discount: "₹500 OFF",
    minOrder: 1999,
    expiringIn: "3 days",
    verified: true,
    usedToday: 567,
  },
  {
    id: 5,
    code: "PAYTM500",
    title: "₹500 Cashback on Shopping",
    description: "Get ₹500 cashback on shopping above ₹3000. Valid once per user",
    store: "Paytm",
    category: "Shopping",
    discount: "₹500 CASHBACK",
    minOrder: 3000,
    expiringIn: "Today",
    verified: true,
    usedToday: 3421,
  },
  {
    id: 6,
    code: "SNAPDEAL100",
    title: "Flat ₹100 Off on ₹500+",
    description: "Valid on all products. No minimum size restriction",
    store: "Snapdeal",
    category: "General",
    discount: "₹100 OFF",
    minOrder: 500,
    expiringIn: "4 days",
    verified: true,
    usedToday: 789,
  },
  {
    id: 7,
    code: "AMZPRIME10",
    title: "10% Off for Prime Members",
    description: "Exclusive 10% discount on selected items for Prime members",
    store: "Amazon",
    category: "All Categories",
    discount: "10% OFF",
    minOrder: 0,
    expiringIn: "2 weeks",
    verified: true,
    usedToday: 1567,
  },
  {
    id: 8,
    code: "FLIPBIG500",
    title: "₹500 Off on ₹2500+",
    description: "Flat ₹500 off on minimum order of ₹2500. Valid during sale events",
    store: "Flipkart",
    category: "General",
    discount: "₹500 OFF",
    minOrder: 2500,
    expiringIn: "1 month",
    verified: true,
    usedToday: 234,
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const copyToClipboard = (code: string, id: number) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCoupons =
    activeCategory === "All"
      ? coupons
      : coupons.filter(
          (c) =>
            c.store === activeCategory ||
            c.category === activeCategory ||
            c.category.includes(activeCategory)
        );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            🎫 Verified Coupons
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Working Coupon Codes</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Browse and copy verified coupon codes that actually work
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.name
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                      {coupon.store === "Amazon"
                        ? "📦"
                        : coupon.store === "Flipkart"
                        ? "🛒"
                        : coupon.store === "Myntra"
                        ? "👕"
                        : coupon.store === "Ajio"
                        ? "👗"
                        : "💳"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{coupon.title}</h3>
                      <p className="text-xs text-gray-500">{coupon.store}</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                    {coupon.discount}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>

                {/* Terms */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span>📦 Min: ₹{coupon.minOrder}</span>
                  <span>⏰ Expires: {coupon.expiringIn}</span>
                  {coupon.verified && (
                    <span className="text-green-600">✓ Verified</span>
                  )}
                </div>

                {/* Code Section */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-lg px-4 py-3 font-mono font-bold text-lg text-gray-800 text-center tracking-wider">
                    {coupon.code}
                  </div>
                  <button
                    onClick={() => copyToClipboard(coupon.code, coupon.id)}
                    className={`flex-1 py-3 rounded-lg font-semibold text-sm transition ${
                      copiedId === coupon.id
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90"
                    }`}
                  >
                    {copiedId === coupon.id ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>

                {/* Used Count */}
                <p className="text-xs text-gray-400 mt-3 text-center">
                  {coupon.usedToday.toLocaleString()} people used this today
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">How to Use Coupons</h2>
            <p className="text-gray-600">Simple steps to apply coupon codes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, icon: "🔍", title: "Find Coupon", desc: "Browse and find the best coupon for you" },
              { step: 2, icon: "📋", title: "Copy Code", desc: "Click on the coupon to copy the code" },
              { step: 3, icon: "🛒", title: "Shop", desc: "Add items to your cart" },
              { step: 4, icon: "💰", title: "Apply", desc: "Paste the code at checkout" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-green-600 font-bold text-sm mb-1">Step {item.step}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Get More Savings!
          </h2>
          <p className="text-white/80 mb-6">
            Join our Telegram channel for exclusive coupons and deals
          </p>
          <a
            href="/telegram"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Join Telegram 🔔
          </a>
        </div>
      </section>
    </div>
  );
}
