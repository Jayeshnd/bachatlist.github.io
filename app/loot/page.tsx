"use client";

import Link from "next/link";
import { useState } from "react";

const lootDeals = [
  {
    id: 1,
    title: "OnePlus Nord CE 3 Lite 5G",
    shortDesc: "8GB RAM, 128GB Storage",
    currentPrice: 14999,
    originalPrice: 19999,
    discount: 25,
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "HOT",
    rating: 4.3,
    reviewCount: 1245,
    urgency: "high",
  },
  {
    id: 2,
    title: "boAt Rockerz 550 Wireless Headphone",
    shortDesc: "Over Ear Bluetooth Headphones",
    currentPrice: 1299,
    originalPrice: 3990,
    discount: 67,
    image: "https://m.media-amazon.com/images/I/61Nr0k0jvOL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "LOOT",
    rating: 4.5,
    reviewCount: 8921,
    urgency: "high",
  },
  {
    id: 3,
    title: "Puma Men's T-Shirt",
    shortDesc: "Regular Fit Cotton Blend",
    currentPrice: 599,
    originalPrice: 1599,
    discount: 62,
    image: "https://m.media-amazon.com/images/I/61QrVT-8rGL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "LIMITED",
    rating: 4.2,
    reviewCount: 2341,
    urgency: "medium",
  },
  {
    id: 4,
    title: "Samsung Galaxy M14 5G",
    shortDesc: "6GB RAM, 128GB Storage",
    currentPrice: 12499,
    originalPrice: 17999,
    discount: 31,
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "HOT",
    rating: 4.4,
    reviewCount: 3421,
    urgency: "high",
  },
  {
    id: 5,
    title: "Crocs Unisex-Adult Clogs",
    shortDesc: "Classic Comfort Water Shoes",
    currentPrice: 1699,
    originalPrice: 3499,
    discount: 51,
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "LOOT",
    rating: 4.6,
    reviewCount: 5678,
    urgency: "high",
  },
  {
    id: 6,
    title: "Noise Pulse 2 Max Smartwatch",
    shortDesc: "Bluetooth Calling, 1.83\" Display",
    currentPrice: 1799,
    originalPrice: 4999,
    discount: 64,
    image: "https://m.media-amazon.com/images/I/61Nr0k0jvOL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "DEAL",
    rating: 4.3,
    reviewCount: 4567,
    urgency: "medium",
  },
  {
    id: 7,
    title: "Wildcraft Backpack 25L",
    shortDesc: "Waterproof Laptop Backpack",
    currentPrice: 1499,
    originalPrice: 3999,
    discount: 62,
    image: "https://m.media-amazon.com/images/I/61QrVT-8rGL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "LOOT",
    rating: 4.4,
    reviewCount: 1234,
    urgency: "high",
  },
  {
    id: 8,
    title: "Amul Butter 500g Pack",
    shortDesc: "Pure Salted Butter",
    currentPrice: 265,
    originalPrice: 340,
    discount: 22,
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    store: "Amazon",
    badge: "ESSENTIAL",
    rating: 4.7,
    reviewCount: 8901,
    urgency: "low",
  },
];

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function LootDealCard({ deal }: { deal: typeof lootDeals[0] }) {
  const urgencyColors = {
    high: "bg-red-500 animate-pulse",
    medium: "bg-orange-500",
    low: "bg-yellow-500",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group relative">
      {/* Urgent Badge */}
      {deal.urgency === "high" && (
        <div className={`absolute top-3 left-3 ${urgencyColors[deal.urgency as keyof typeof urgencyColors]} text-white text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1`}>
          <span>⚡</span> HOT
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        {deal.discount}% OFF
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        {/* Store Badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
            📦 {deal.store}
          </span>
          {deal.badge && deal.urgency !== "high" && (
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
              {deal.badge}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
          {deal.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">{deal.shortDesc}</p>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(deal.currentPrice)}</span>
            <span className="text-sm text-gray-400 line-through">{formatPrice(deal.originalPrice)}</span>
          </div>

          <div className="flex items-center gap-1 mt-2">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
            <span className="text-xs text-gray-400">({deal.reviewCount})</span>
          </div>
        </div>

        <a
          href="#"
          className="mt-3 block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          Grab Now →
        </a>
      </div>
    </div>
  );
}

export default function LootPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-3">
            🔥 Limited Time Offers
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Loot Deals</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Best prices you'll find anywhere! These deals sell out fast, so hurry up!
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {["all", "hot", "loot", "electronics", "fashion"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  filter === filterOption
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {filterOption === "all" ? "🔥 All Deals" : filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Hot Loot Deals</h2>
          <span className="text-sm text-gray-500">{lootDeals.length} deals found</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {lootDeals.map((deal) => (
            <LootDealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Don't Miss Out!</h2>
          <p className="text-white/80 mb-6">Join our Telegram channel for instant loot alerts</p>
          <Link
            href="/telegram"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Join Telegram 🔔
          </Link>
        </div>
      </section>
    </div>
  );
}
