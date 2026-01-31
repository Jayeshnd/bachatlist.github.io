"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, toNumber } from "@/lib/utils";
import { BannerSlider } from "@/components/BannerSlider";

// Stores/Brands Component
function StoresRow({ stores }: { stores: { name: string; icon: string; logo?: string }[] }) {
  return (
    <div className="bg-white border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-hide">
          {stores.map((store, index) => (
            <Link
              key={index}
              href={`/deals?store=${store.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 min-w-fit hover:opacity-80 transition"
            >
              <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition">
                {store.icon}
              </div>
              <span className="text-sm font-medium text-gray-700">{store.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Featured Deals Slider Component
function FeaturedDealsSlider({ deals }: { deals: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % deals.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [deals.length]);

  if (deals.length === 0) return null;

  return (
    <div className="relative w-full h-[350px] md:h-[400px] overflow-hidden rounded-2xl">
      {deals.map((deal, index) => (
        <div
          key={deal.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
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
              <div className="w-full h-full bg-gradient-to-br from-green-400/20 to-emerald-500/20" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/50 to-transparent" />
          </div>

          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {deal.discount && (
                <span className="inline-block bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full mb-4">
                  🔥 {deal.discount}% OFF
                </span>
              )}
              <span className="text-green-400 font-semibold text-sm uppercase tracking-wide">
                {deal.category?.name || "Featured Deal"}
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
                  {formatPrice(toNumber(deal.currentPrice), deal.currency || "INR")}
                </span>
                {deal.originalPrice && toNumber(deal.originalPrice) > toNumber(deal.currentPrice) && (
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(toNumber(deal.originalPrice), deal.currency || "INR")}
                  </span>
                )}
              </div>
              <a
                href={deal.affiliateUrl || deal.productUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
              >
                Get Deal
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Deal Card Component
function DealCard({ deal }: { deal: any }) {
  const currentPrice = toNumber(deal.currentPrice);
  const originalPrice = toNumber(deal.originalPrice);
  const discount = deal.discount || (originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  return (
    <Link
      href={deal.affiliateUrl || deal.productUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {deal.primaryImage ? (
          <img
            src={deal.primaryImage}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <span className="text-6xl opacity-50">🛍️</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            {discount}% OFF
          </div>
        )}
        
        {deal.badge && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
            {deal.badge}
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
            {deal.category?.name || "General"}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
          {deal.title}
        </h3>

        {deal.shortDesc && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {deal.shortDesc}
          </p>
        )}

        <div className="flex-1" />

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(currentPrice, deal.currency || "INR")}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice, deal.currency || "INR")}
              </span>
            )}
          </div>

          {deal.rating && deal.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm font-medium text-gray-700">{deal.rating}</span>
              <span className="text-xs text-gray-400">({deal.reviewCount || 0})</span>
            </div>
          )}

          <button className="mt-3 w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition">
            View Deal →
          </button>
        </div>
      </div>
    </Link>
  );
}

// Category Card
function CategoryCard({ category }: { category: any }) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-center border border-gray-100 hover:border-green-200"
    >
      <div className="text-4xl mb-3">{category.icon || "📦"}</div>
      <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
      <p className="text-xs text-gray-500 mt-1">{category.dealCount || 0} deals</p>
    </Link>
  );
}

export default function HomeClient({ featuredDeals, categories, latestDeals, banners, hotDeals }: any) {
  // Flipshope-style stores list - now fetched from API
  const [stores, setStores] = useState<{ name: string; icon: string; logo?: string }[]>([]);
  const [storesLoading, setStoresLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/stores");
        if (response.ok) {
          const data = await response.json();
          setStores(data.stores || []);
        }
      } catch (error) {
        console.error("Failed to fetch stores:", error);
      } finally {
        setStoresLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Slider */}
      {banners && banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BannerSlider banners={banners} autoPlay={true} autoPlayInterval={5000} />
        </section>
      )}

      {/* Stores/Brands Row */}
      {storesLoading ? (
        <div className="bg-white border-b border-gray-100 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-fit animate-pulse">
                  <div className="w-16 h-16 bg-gray-200 rounded-xl" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : stores.length > 0 ? (
        <StoresRow stores={stores} />
      ) : null}

      {/* Hot Deals Section (if available) */}
      {hotDeals && hotDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🔥 Hot Deals</h2>
            <Link href="/loot" className="text-green-600 font-medium hover:underline text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {hotDeals.slice(0, 5).map((hotDeal: any) => (
              <DealCard key={hotDeal.id} deal={{ ...hotDeal.deal, customBadge: hotDeal.customBadge }} />
            ))}
          </div>
        </section>
      )}

      {/* Hero Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FeaturedDealsSlider deals={featuredDeals} />
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link href="/categories" className="text-green-600 font-medium hover:underline text-sm">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category: any) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Latest Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Deals</h2>
          <Link href="/deals" className="text-green-600 font-medium hover:underline text-sm">
            View All →
          </Link>
        </div>

        {latestDeals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals available yet</h3>
            <p className="text-gray-600">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {latestDeals.map((deal: any) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-gray-900 mb-1">Verified Deals</h3>
              <p className="text-sm text-gray-600">100% verified offers</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="font-bold text-gray-900 mb-1">Best Prices</h3>
              <p className="text-sm text-gray-600">Lowest prices guaranteed</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-bold text-gray-900 mb-1">Fast Updates</h3>
              <p className="text-sm text-gray-600">Daily new deals</p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="font-bold text-gray-900 mb-1">Secure</h3>
              <p className="text-sm text-gray-600">Safe transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Start Saving Today!</h2>
          <p className="text-white/80 mb-6">Browse thousands of deals and find your perfect match</p>
          <Link
            href="/deals"
            className="inline-block bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Explore Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
