"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { formatPrice, toNumber } from "@/lib/utils";

function formatPriceINR(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function LootDealCard({ deal }: { deal: any }) {
  const currentPrice = toNumber(deal.currentPrice);
  const originalPrice = toNumber(deal.originalPrice);
  const discount = deal.discount || (originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group relative">
      {/* Urgent Badge */}
      {discount > 50 && (
        <div className="absolute top-3 left-3 bg-red-500 animate-pulse text-white text-xs font-bold px-2 py-1 rounded-md z-10 flex items-center gap-1">
          <span>⚡</span> HOT
        </div>
      )}

      {/* Discount Badge */}
      <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
        {discount}% OFF
      </div>

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {deal.primaryImage ? (
          <img
            src={deal.primaryImage}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-4xl opacity-50">🛍️</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Coupon Badge */}
        {deal.coupon && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
              🎁 {deal.coupon}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
          {deal.title}
        </h3>

        {deal.shortDesc && (
          <p className="text-xs text-gray-500 mt-1">{deal.shortDesc}</p>
        )}

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPriceINR(currentPrice)}</span>
            {originalPrice > currentPrice && (
              <span className="text-sm text-gray-400 line-through">{formatPriceINR(originalPrice)}</span>
            )}
          </div>

          {deal.rating && deal.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
              <span className="text-xs text-gray-400">({deal.reviewCount || 0})</span>
            </div>
          )}
        </div>

        <a
          href={deal.affiliateUrl || deal.productUrl || "#"}
          className="mt-3 block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition"
        >
          Grab Now →
        </a>
      </div>
    </div>
  );
}

// Carousel Component
function LootCarousel({ deals }: { deals: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % deals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [deals.length]);

  if (deals.length === 0) return null;

  const currentDeal = deals[currentIndex];
  const currentPrice = toNumber(currentDeal.currentPrice);
  const originalPrice = toNumber(currentDeal.originalPrice);
  const discount = currentDeal.discount || (originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-2xl mb-8">
      {deals.map((deal, index) => (
        <div
          key={deal.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0">
            {deal.primaryImage ? (
              <img
                src={deal.primaryImage}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-400/30 to-orange-500/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/50 to-transparent" />
          </div>

          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <span className="inline-block bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full mb-4">
                🔥 {discount}% OFF - LOOT DEAL
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3">
                {deal.title}
              </h2>
              {deal.shortDesc && (
                <p className="text-gray-200 text-base mb-4 line-clamp-2">
                  {deal.shortDesc}
                </p>
              )}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-white">
                  {formatPriceINR(currentPrice)}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPriceINR(originalPrice)}
                  </span>
                )}
              </div>
              <a
                href={deal.affiliateUrl || deal.productUrl || "#"}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg"
              >
                Grab Now ⚡
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Carousel Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LootPage() {
  const [lootDeals, setLootDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLootDeals() {
      try {
        const response = await fetch("/api/deals/loot");
        if (response.ok) {
          const data = await response.json();
          setLootDeals(data);
        }
      } catch (error) {
        console.error("Failed to fetch loot deals:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLootDeals();
  }, []);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : lootDeals.length > 0 ? (
          <>
            {/* Carousel for Top Loot Deals */}
            <LootCarousel deals={lootDeals.slice(0, 5)} />

            {/* All Loot Deals Grid */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">🔥 All Loot Deals</h2>
                <span className="text-sm text-gray-500">{lootDeals.length} deals found</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {lootDeals.map((deal) => (
                  <LootDealCard key={deal.id} deal={deal} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Loot Deals Available</h2>
            <p className="text-gray-600">Check back soon for amazing loot deals!</p>
          </div>
        )}
      </div>

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
