"use client";

import { useEffect, useState } from "react";

interface AmazonConfig {
  id: string;
  associateTag: string;
  accessKey: string;
  secretKey: string;
  region: string;
  marketplace: string;
  isActive: boolean;
}

export default function AmazonConfigPage() {
  const [config, setConfig] = useState<Partial<AmazonConfig>>({
    region: "in",
    marketplace: "IN",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchConfig();
  }, []);

  async function fetchConfig() {
    try {
      const response = await fetch("/api/admin/amazon-config");
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (err) {
      console.error("Failed to fetch config:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/admin/amazon-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error("Failed to save configuration");

      const saved = await response.json();
      setConfig(saved);
      setSuccess("Configuration saved successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Amazon PA-API Configuration</h1>
        <p className="text-gray-600 mt-1">Configure your Amazon affiliate API credentials</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Associate Tag
            </label>
            <input
              type="text"
              value={config.associateTag || ""}
              onChange={(e) => setConfig({ ...config, associateTag: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your-tag-21"
            />
            <p className="text-xs text-gray-500 mt-1">Your Amazon affiliate tag</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Key
            </label>
            <input
              type="text"
              value={config.accessKey || ""}
              onChange={(e) => setConfig({ ...config, accessKey: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="AKIA..."
            />
            <p className="text-xs text-gray-500 mt-1">AWS Access Key ID from PA-API</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secret Key
            </label>
            <input
              type="password"
              value={config.secretKey || ""}
              onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********************"
            />
            <p className="text-xs text-gray-500 mt-1">AWS Secret Key from PA-API</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                value={config.region || "in"}
                onChange={(e) => setConfig({ ...config, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="in">India (in)</option>
                <option value="com">US (com)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marketplace
              </label>
              <select
                value={config.marketplace || "IN"}
                onChange={(e) => setConfig({ ...config, marketplace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="IN">India</option>
                <option value="US">US</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}