import type { Metadata } from "next";
import CuelinksCampaigns from "@/app/components/CuelinksCampaigns";

export const metadata: Metadata = {
  title: "Cuelinks Deals - BachatList",
  description: "Discover the best deals and cashback offers from Cuelinks",
};

export default function CuelinksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💰 Cuelinks Deals
          </h1>
          <p className="text-white/90 text-lg">
            Discover amazing deals with cashback rewards from top brands
          </p>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Latest Campaigns
          </h2>
          <p className="text-gray-600">
            Browse through our collection of exclusive deals and cashback offers
          </p>
        </div>

        <CuelinksCampaigns />
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Find a Deal</h3>
              <p className="text-gray-600 text-sm">
                Browse through our collection of deals and choose one that interests you
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Shop Online</h3>
              <p className="text-gray-600 text-sm">
                Click on the deal and make your purchase on the merchant's website
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💵</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Earn Cashback</h3>
              <p className="text-gray-600 text-sm">
                Get cashback credited to your account automatically
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
