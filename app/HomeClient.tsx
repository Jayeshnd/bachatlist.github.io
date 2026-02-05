"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice, toNumber } from "@/lib/utils";
import { BannerSlider } from "@/components/BannerSlider";

// Stores/Brands Component
function StoresRow({ stores }: { stores: { name: string; icon: string; logo?: string }[] }) {
  return (
    <div className="bg-white border-b border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Brands</p>
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {stores.map((store, index) => (
            <Link
              key={index}
              href={`/deals?store=${(store.name || '').toLowerCase()}`}
              className="flex flex-col items-center gap-2 min-w-fit group"
            >
              <div className="w-18 h-18 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-4xl group-hover:shadow-md group-hover:border-primary-200 group-hover:-translate-y-1 transition-all duration-300">
                {store.logo ? (
                  <img 
                    src={store.logo} 
                    alt={store.name || 'Store'}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  store.icon
                )}
              </div>
              <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors">{store.name}</span>
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
    <div className="relative w-full h-[350px] md:h-[400px] overflow-hidden rounded-2xl shadow-xl">
      {deals.map((deal, index) => (
        <div
          key={deal.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
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
              <div className="w-full h-full bg-gradient-to-br from-slate-400/30 to-slate-600/30" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
          </div>

          <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {deal.discount && (
                <span className="inline-flex items-center gap-2 bg-red-500 text-white text-lg font-bold px-4 py-2 rounded-full mb-4 shadow-lg shadow-red-500/30">
                  <span>🔥</span> {deal.discount}% OFF
                </span>
              )}
              <span className="inline-block text-primary-300 font-semibold text-sm uppercase tracking-wider">
                {deal.category?.name || "Featured Deal"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-3 leading-tight">
                {deal.title}
              </h2>
              {deal.shortDesc && (
                <p className="text-slate-200 text-base mb-5 line-clamp-2">
                  {deal.shortDesc}
                </p>
              )}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-bold text-white">
                  {formatPrice(toNumber(deal.currentPrice), deal.currency || "INR")}
                </span>
                {deal.originalPrice && toNumber(deal.originalPrice) > toNumber(deal.currentPrice) && (
                  <span className="text-xl text-slate-400 line-through">
                    {formatPrice(toNumber(deal.originalPrice), deal.currency || "INR")}
                  </span>
                )}
              </div>
              <a
                href={deal.affiliateUrl || deal.productUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
              >
                Get Deal
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
        {deals.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-8" : "bg-white/40 hover:bg-white/60"
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
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 h-full flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {deal.primaryImage ? (
          <img
            src={deal.primaryImage}
            alt={deal.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <span className="text-6xl opacity-40">🛍️</span>
          </div>
        )}
        
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {discount}% OFF
          </div>
        )}
        
        {deal.badge && (
          <div className="absolute top-3 right-3 bg-primary-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
            {deal.badge}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
            {deal.category?.name || "General"}
          </span>
        </div>

        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
          {deal.title}
        </h3>

        {deal.shortDesc && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {deal.shortDesc}
          </p>
        )}

        <div className="flex-1" />

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-900">
              {formatPrice(currentPrice, deal.currency || "INR")}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(originalPrice, deal.currency || "INR")}
              </span>
            )}
          </div>

          {deal.rating && deal.rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <span className="text-amber-400 text-sm">★</span>
              <span className="text-sm font-medium text-slate-700">{deal.rating}</span>
              <span className="text-xs text-slate-400">({deal.reviewCount || 0})</span>
            </div>
          )}

          <button className="mt-3 w-full bg-slate-900 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-primary-600 transition-colors flex items-center justify-center gap-2">
            View Deal
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
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
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 text-center border border-slate-200 hover:border-primary-200 hover:-translate-y-1 group"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 group-hover:bg-primary-50 transition-colors">
        {category.icon || "📦"}
      </div>
      <h3 className="font-semibold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{category.name}</h3>
      <p className="text-xs text-slate-500 mt-1">{category.dealCount || 0} deals</p>
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
          console.log("[DEBUG] Stores API response:", data);
          setStores(data || []);
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
    <div className="min-h-screen bg-slate-50">
      {/* Banner Slider */}
      {banners && banners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BannerSlider banners={banners} autoPlay={true} autoPlayInterval={5000} />
        </section>
      )}

      {/* Stores/Brands Row */}
      {storesLoading ? (
        <div className="bg-white border-b border-slate-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 overflow-x-auto pb-2 scrollbar-hide">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-fit animate-pulse">
                  <div className="w-16 h-16 bg-slate-200 rounded-xl" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : stores.length > 0 ? (
        <div className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Top Brands</p>
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
              {stores.map((store, index) => (
                <Link
                  key={index}
                  href={`/deals?store=${(store.name || '').toLowerCase()}`}
                  className="flex flex-col items-center gap-2 min-w-fit group"
                >
                  <div className="w-18 h-18 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-4xl group-hover:shadow-md group-hover:border-primary-200 group-hover:-translate-y-1 transition-all duration-300">
                    {store.logo ? (
                      <img 
                        src={store.logo} 
                        alt={store.name || 'Store'}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      store.icon
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-primary-600 transition-colors">{store.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Hot Deals Section (if available) */}
      {hotDeals && hotDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="text-red-500">🔥</span> Hot Deals
            </h2>
            <Link href="/deals" className="text-primary-600 font-medium hover:underline text-sm flex items-center gap-1">
              View All <span>→</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Shop by Category</h2>
          <Link href="/categories" className="text-primary-600 font-medium hover:underline text-sm flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category: any) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Latest Deals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-primary-600">⚡</span> Latest Deals
          </h2>
          <Link href="/deals" className="text-primary-600 font-medium hover:underline text-sm flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>

        {latestDeals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🎁</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No deals available yet</h3>
            <p className="text-slate-500">Check back soon for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {latestDeals.map((deal: any) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-slate-800 to-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Saving Today!</h2>
          <p className="text-slate-300 mb-8 text-lg">Browse thousands of deals and find your perfect match</p>
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-slate-100 transition shadow-lg hover:shadow-xl"
          >
            Explore Deals
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
