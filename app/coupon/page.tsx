"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

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
  storeName: string | null;
  storeLogo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  name: string;
  icon: string;
}

// Coupon Reveal Modal Component
function CouponRevealModal({
  coupon,
  isOpen,
  onClose,
  onCopy,
  copiedId
}: {
  coupon: CouponCode | null;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (code: string, id: string) => void;
  copiedId: string | null;
}) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedCode, setRevealedCode] = useState("");

  if (!isOpen || !coupon) return null;

  // Extract store name from affiliate URL if storeName is null
  const getStoreNameFromUrl = (url: string | null | undefined): string => {
    if (!url) return "Store";
    try {
      const decodedUrl = decodeURIComponent(url);
      const urlMatch = decodedUrl.match(/url=https?:\/\/[^/]+\/([^/?#]+)/i);
      if (urlMatch) {
        const domain = urlMatch[1];
        return domain.charAt(0).toUpperCase() + domain.slice(1).replace(/-/g, " ");
      }
      const urlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : 'https://' + decodedUrl);
      const hostname = urlObj.hostname.replace('www.', '');
      return hostname.charAt(0).toUpperCase() + hostname.slice(1).replace(/\.[a-z]+$/i, '').replace(/-/g, ' ');
    } catch {
      return "Store";
    }
  };

  // Get store name - from coupon or extract from URL
  const storeName = coupon.storeName || getStoreNameFromUrl(coupon.affiliateUrl);

  const handleReveal = () => {
    setIsRevealed(true);
    setRevealedCode(coupon.code);
  };

  const handleCopy = () => {
    onCopy(coupon.code, coupon.id);
  };

  const handleClose = () => {
    setIsRevealed(false);
    setRevealedCode("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />
      
      {/* Modal Content - couponzguru style */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full overflow-hidden">
        {/* Header */}
        <div className="bg-orange-500 p-3 text-center">
          <span className="text-white font-bold text-sm">GET THIS COUPON</span>
        </div>

        {/* Store Name and Logo */}
        <div className="p-3 text-center">
          {coupon.storeLogo ? (
            <div className="relative w-16 h-10 mx-auto mb-1">
              <Image 
                src={coupon.storeLogo} 
                alt={`${storeName} logo`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="h-10 w-10 mx-auto mb-1 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {storeName.charAt(0)}
            </div>
          )}
          <p className="font-semibold text-gray-800 text-sm">{storeName}</p>
        </div>

        {/* Discount & Description - Smaller */}
        <div className="px-3 pb-2 text-center">
          <span className="text-xl font-bold text-orange-500">
            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
          </span>
          {coupon.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {coupon.description.replace(/<[^>]*>/g, " ").trim().substring(0, 80)}...
            </p>
          )}
        </div>

        {/* Coupon Code Section */}
        <div className="p-4">
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold transition-colors"
            >
              Show Coupon
            </button>
          ) : (
            <div className="space-y-3">
              <div className="border-2 border-dashed border-orange-500 rounded p-3 text-center bg-orange-50">
                <span className="font-mono text-xl font-bold text-gray-800 tracking-wider">
                  {revealedCode}
                </span>
              </div>
              {coupon.affiliateUrl ? (
                <a
                  href={coupon.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  COPY CODE & GET DEAL ↗
                </a>
              ) : (
                <button
                  onClick={handleCopy}
                  className={`w-full py-3 rounded font-bold transition-colors flex items-center justify-center gap-2 ${
                    copiedId === coupon.id
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {copiedId === coupon.id ? "✓ COPIED!" : "COPY CODE & GET DEAL"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-2 right-2 text-white hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Footer */}
        <div className="bg-gray-100 p-2 text-center">
          <span className="text-xs text-gray-500">Powered by BachatList</span>
        </div>
      </div>
    </div>
  );
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
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse min-w-[280px] max-w-[320px] flex-shrink-0">
      <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

// Enhanced Coupon Card Component (based on the HTML example)
function EnhancedCouponCard({ 
  coupon, 
  onCopy, 
  copiedId,
  onReveal
}: { 
  coupon: CouponCode; 
  onCopy: (code: string, id: string) => void;
  copiedId: string | null;
  onReveal: (coupon: CouponCode) => void;
}) {
  const stripHtml = useCallback((html: string | null): string => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  }, []);

  // Extract store name from affiliate URL if storeName is null
  const getStoreNameFromUrl = (url: string | null | undefined): string => {
    if (!url) return "Store";
    try {
      // Handle URLs that might be wrapped in redirect services
      const decodedUrl = decodeURIComponent(url);
      const urlMatch = decodedUrl.match(/url=https?:\/\/[^/]+\/([^/?#]+)/i);
      if (urlMatch) {
        const domain = urlMatch[1];
        // Format the store name
        return domain.charAt(0).toUpperCase() + domain.slice(1).replace(/-/g, " ");
      }
      const urlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : 'https://' + decodedUrl);
      const hostname = urlObj.hostname.replace('www.', '');
      return hostname.charAt(0).toUpperCase() + hostname.slice(1).replace(/\.[a-z]+$/i, '').replace(/-/g, ' ');
    } catch {
      return "Store";
    }
  };

  // Get store name - from coupon or extract from URL
  const storeName = coupon.storeName || getStoreNameFromUrl(coupon.affiliateUrl);
  
  return (
    <div 
      className="offer-card-wrapper bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[320px] flex-shrink-0"
      data-section="Offers"
      data-tab="coupons-slider"
    >
      {/* Hidden data attributes for tracking */}
      <span style={{ display: 'none' }} data-offer-key="couponType" data-offer-value="coupon"></span>
      <span style={{ display: 'none' }} data-offer-key="validationType" data-offer-value=""></span>
      <span style={{ display: 'none' }} data-offer-key="storeName" data-offer-value={storeName}></span>
      <span style={{ display: 'none' }} data-offer-key="id" data-offer-value={coupon.id}></span>
      <span style={{ display: 'none' }} data-offer-key="storeId" data-offer-value={storeName.toLowerCase()}></span>
      <span style={{ display: 'none' }} data-offer-key="offerTitle" data-offer-value={stripHtml(coupon.description) || coupon.code}></span>

      <div className="upper-block p-4">
        {/* Store Logo Section */}
        {coupon.storeLogo ? (
          <div 
            className="img-wrapper offer-store-logo mb-3" 
            data-store-name={storeName}
            data-offer-key="storeImage"
            data-offer-value={coupon.storeLogo}
          >
            <span className="store-logo-cta inline-block relative w-12 h-8">
              <Image 
                src={coupon.storeLogo} 
                alt={`${storeName} coupons`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
                loading="lazy"
                decoding="async"
              />
            </span>
          </div>
        ) : (
          <div 
            className="img-wrapper offer-store-logo mb-3" 
            data-store-name={storeName}
            data-offer-key="storeImage"
          >
            <span className="store-logo-cta inline-block">
              <span className="text-2xl">🏷️</span>
            </span>
          </div>
        )}

        {/* Offer Title */}
        <div 
          className="title text-lg font-semibold text-gray-800 mb-2"
          data-offer-key="offerCrux"
          data-offer-value={stripHtml(coupon.description) || `${coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}`}
        >
          {stripHtml(coupon.description) || `${coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}`}
        </div>

        {/* Discount Badge */}
        <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-lg font-bold shadow-lg mb-3">
          {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
        </div>

        {/* Terms */}
        <div className="text-xs text-gray-500 mb-3 space-y-1">
          {coupon.minPurchase && (
            <div className="flex items-center gap-1">
              <span>📦</span>
              <span>Min: ₹{coupon.minPurchase.toLocaleString()}</span>
            </div>
          )}
          {coupon.expiryDate && (
            <div className="flex items-center gap-1">
              <span>⏰</span>
              <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}</span>
            </div>
          )}
        </div>

        {/* Verified Badge */}
        {coupon.isActive && (
          <div className="flex items-center justify-center mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <span className="mr-1">✓</span> Verified
            </span>
          </div>
        )}
      </div>

      {/* CTA Button Section */}
      <div 
        className="cta-button-wrapper get-offer-code p-4 pt-0"
        data-offer-key="couponCode"
        data-offer-value={coupon.code}
        data-gtm-offer-type="coupon"
      >
        <button
          className={`offer-get-code-link coupon-btn w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ${
            copiedId === coupon.id
              ? "bg-green-600 text-white"
              : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:shadow-lg transform hover:-translate-y-0.5"
          }`}
          onClick={() => onReveal(coupon)}
          data-offer-key="offerGetCodeBtnText"
          data-offer-value="& GET CODE"
          data-id={coupon.id}
        >
          <div className="p1-code font-mono inline flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{copiedId === coupon.id ? "✓ Copied!" : "Show Coupon"}</span>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Powered by BachatList • Terms apply
        </p>
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
  const [viewMode, setViewMode] = useState<"slider" | "grid" | "list">("slider");
  const [revealModal, setRevealModal] = useState<{
    isOpen: boolean;
    coupon: CouponCode | null;
  }>({
    isOpen: false,
    coupon: null,
  });

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

  // Show all coupons together (both with and without affiliate URL)
  const allCouponCards = filteredCoupons;

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

  const handleRevealCoupon = (coupon: CouponCode) => {
    setRevealModal({ isOpen: true, coupon });
  };

  const handleCloseModal = () => {
    setRevealModal({ isOpen: false, coupon: null });
  };

  // Slider navigation
  const scrollContainer = useCallback((direction: 'left' | 'right', containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }, []);

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
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          {/* Slider Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"></div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(4)].map((_, i) => (
                <CouponSkeleton key={i} />
              ))}
            </div>
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
              onClick={() => setViewMode("slider")}
              className={`p-2 rounded-lg transition-all ${viewMode === "slider" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              title="Slider View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* No Results */}
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
        ) : (
          <>
            {/* Slider View */}
            {viewMode === "slider" && (
              <div className="space-y-8">
                {/* All Coupons Slider */}
                {allCouponCards.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span>🎫</span> All Coupons
                      </h2>
                      <div className="flex gap-2">
                        <button
                          onClick={() => scrollContainer('left', 'all-coupons-slider')}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => scrollContainer('right', 'all-coupons-slider')}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <ul className="generic-cd-slider-ul flex gap-4 overflow-x-auto pb-4 scroll-smooth" id="all-coupons-slider">
                      {allCouponCards.map((coupon) => (
                        <li key={coupon.id} className="generic-cd-slider-li flex-shrink-0">
                          <EnhancedCouponCard 
                            coupon={coupon} 
                            onCopy={copyToClipboard}
                            copiedId={copiedId}
                            onReveal={handleRevealCoupon}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => (
                  <EnhancedCouponCard 
                    key={coupon.id} 
                    coupon={coupon} 
                    onCopy={copyToClipboard}
                    copiedId={copiedId}
                    onReveal={handleRevealCoupon}
                  />
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredCoupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg ${
                      coupon.isActive ? "" : "opacity-60"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Discount Badge */}
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white flex items-center justify-center md:w-32">
                        <div className="text-center">
                          <span className="block text-2xl font-bold">
                            {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                          </span>
                          <span className="text-sm opacity-90">OFF</span>
                        </div>
                      </div>

                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            {/* Store Info */}
                            {(coupon.storeName || coupon.storeLogo) && (
                              <div className="flex items-center gap-2 mb-2">
                                {coupon.storeLogo && (
                                  <img
                                    src={coupon.storeLogo}
                                    alt={coupon.storeName || "Store"}
                                    className="h-6 w-auto object-contain"
                                  />
                                )}
                                {coupon.storeName && (
                                  <span className="text-sm font-medium text-gray-600">
                                    {coupon.storeName}
                                  </span>
                                )}
                              </div>
                            )}
                            <h3 className="font-semibold text-gray-800 mb-2">
                              {stripHtml(coupon.description) || "Special discount"}
                            </h3>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                              {coupon.minPurchase && <span>📦 Min ₹{coupon.minPurchase.toLocaleString()}</span>}
                              {coupon.expiryDate && <span>⏰ {new Date(coupon.expiryDate).toLocaleDateString("en-IN")}</span>}
                              {coupon.isActive && <span className="text-green-600">✓ Verified</span>}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex items-center gap-3">
                            {!coupon.affiliateUrl ? (
                              <button
                                onClick={() => handleRevealCoupon(coupon)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Reveal Code
                              </button>
                            ) : (
                              <a
                                href={coupon.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold text-sm hover:from-green-600 hover:to-green-700 transition"
                              >
                                Get Deal
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
          </>
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
              className="px-6 py-3 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg w-80"
            />
            <button className="px-8 py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Coupon Reveal Modal */}
      <CouponRevealModal
        coupon={revealModal.coupon}
        isOpen={revealModal.isOpen}
        onClose={handleCloseModal}
        onCopy={copyToClipboard}
        copiedId={copiedId}
      />
    </div>
  );
}
