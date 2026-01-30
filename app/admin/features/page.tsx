"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FeaturesTable } from "./FeaturesTable";

interface Feature {
  id: string;
  title: string;
  icon: string | null;
  description: string;
  order: number;
  isActive: boolean;
  isFeatured: boolean;
  color: string | null;
  backgroundColor: string | null;
  featureGroupId: string | null;
}

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatures() {
      try {
        const response = await fetch("/api/admin/features");
        if (response.ok) {
          const data = await response.json();
          setFeatures(data);
        } else {
          setError("Failed to load features");
        }
      } catch (err) {
        console.error("Failed to fetch features:", err);
        setError("Failed to load features");
      } finally {
        setLoading(false);
      }
    }

    fetchFeatures();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Features</h1>
          <p className="text-gray-600 mt-1">Manage site features</p>
        </div>
        <Link
          href="/admin/features/new"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Feature
        </Link>
      </div>

      {/* Features Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Features</h2>
        </div>

        {features.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No features yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first feature to get started
            </p>
            <Link
              href="/admin/features/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Feature
            </Link>
          </div>
        ) : (
          <FeaturesTable initialFeatures={features} />
        )}
      </div>
    </div>
  );
}
