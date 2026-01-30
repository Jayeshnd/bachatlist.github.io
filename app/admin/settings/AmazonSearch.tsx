'use client';

import { useState } from 'react';

interface Product {
  asin: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  rating: number;
  reviews: number;
  url: string;
}

interface AmazonSearchProps {
  onProductSelect?: (product: Product) => void;
}

export default function AmazonSearch({ onProductSelect }: AmazonSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock products for demo
    const mockProducts: Product[] = [
      {
        asin: 'B09V3KXJPB',
        title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case',
        price: 189.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/80',
        rating: 4.7,
        reviews: 12453,
        url: 'https://amazon.com/dp/B09V3KXJPB',
      },
      {
        asin: 'B09G9HD4DQ',
        title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
        price: 348.00,
        currency: 'USD',
        image: 'https://via.placeholder.com/80',
        rating: 4.6,
        reviews: 8234,
        url: 'https://amazon.com/dp/B09G9HD4DQ',
      },
      {
        asin: 'B0B4R1C3DH',
        title: 'Samsung Galaxy Watch 5 Pro 45mm GPS Smartwatch',
        price: 299.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/80',
        rating: 4.5,
        reviews: 5621,
        url: 'https://amazon.com/dp/B0B4R1C3DH',
      },
      {
        asin: 'B0C4Y8D7KL',
        title: 'Kindle Paperwhite Signature Edition 16 GB',
        price: 179.99,
        currency: 'USD',
        image: 'https://via.placeholder.com/80',
        rating: 4.8,
        reviews: 3456,
        url: 'https://amazon.com/dp/B0C4Y8D7KL',
      },
    ];
    
    setProducts(mockProducts);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search Amazon Products
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search by product name or ASIN"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      {searched && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <span className="animate-spin text-2xl">🔍</span>
              <p className="text-gray-500 mt-2">Searching Amazon...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <span className="text-2xl">📦</span>
              <p className="text-gray-500 mt-2">No products found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {products.map((product) => (
                <div
                  key={product.asin}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⭐ {product.rating} ({product.reviews.toLocaleString()} reviews)
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">ASIN: {product.asin}</p>
                  </div>
                  <button
                    onClick={() => onProductSelect?.(product)}
                    className="px-3 py-1 text-sm bg-secondary text-white rounded hover:bg-secondary/90 transition"
                  >
                    Import
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Import by ASIN */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Import by ASIN</h4>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter ASIN (e.g., B09V3KXJPB)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition">
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
