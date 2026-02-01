"use client";

import { useState } from "react";

// ============================================
// TYPES
// ============================================

interface NetworkConfig {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyName: string;
  authType: "token" | "bearer";
  enabled: boolean;
  endpoints: EndpointConfig[];
}

interface EndpointConfig {
  id: string;
  name: string;
  method: "GET" | "POST";
  path: string;
  params: string[];
}

// ============================================
// INITIAL DATA (from API_CONFIGS)
// ============================================

const DEFAULT_NETWORKS: NetworkConfig[] = [
  {
    id: "cuelinks",
    name: "Cuelinks",
    baseUrl: "https://www.cuelinks.com/api/v2",
    apiKeyName: "CUELINKS_API_KEY",
    authType: "token",
    enabled: true,
    endpoints: [
      { id: "campaigns", name: "Campaigns", method: "GET", path: "/campaigns.json", params: ["page", "per_page", "search_term", "category", "country_id"] },
      { id: "clicks", name: "CPC Clicks", method: "GET", path: "/cpc_clicks.json", params: ["campaign_id", "redirect_url", "sub_id_1"] },
      { id: "categories", name: "Categories", method: "GET", path: "/categories.json", params: [] },
    ],
  },
  {
    id: "vcommission",
    name: "VCommission",
    baseUrl: "https://api.vcommission.com",
    apiKeyName: "VCOMMISSION_API_KEY",
    authType: "bearer",
    enabled: true,
    endpoints: [
      { id: "campaigns", name: "Campaigns", method: "GET", path: "/offers/campaigns", params: ["page", "limit", "category"] },
      { id: "reports", name: "Reports", method: "GET", path: "/reports", params: ["from_date", "to_date", "offer_id"] },
      { id: "clicks", name: "Clicks", method: "GET", path: "/reports/clicks", params: ["from_date", "to_date", "offer_id"] },
    ],
  },
];

// ============================================
// COMPONENTS
// ============================================

function NetworkCard({ network, onToggle, onTest, onDelete }: {
  network: NetworkConfig;
  onToggle: () => void;
  onTest: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-xl border ${network.enabled ? "border-green-200" : "border-gray-200"} overflow-hidden`}>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${network.enabled ? "bg-green-500" : "bg-gray-300"}`} />
          <div>
            <h3 className="font-semibold text-gray-900">{network.name}</h3>
            <p className="text-sm text-gray-500">{network.baseUrl}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {network.endpoints.length} endpoints
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className={`w-5 h-5 transition ${expanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">API Key Env:</p>
              <code className="text-xs bg-gray-200 px-2 py-1 rounded">{network.apiKeyName}</code>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Auth:</p>
              <span className={`text-xs px-2 py-1 rounded ${
                network.authType === "token" 
                  ? "bg-purple-100 text-purple-700" 
                  : "bg-blue-100 text-blue-700"
              }`}>
                {network.authType === "token" ? "Token token=xxx" : "Bearer token"}
              </span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700">Available Endpoints:</p>
            {network.endpoints.map((ep) => (
              <div key={ep.id} className="bg-white p-3 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {ep.method}
                  </span>
                  <span className="text-sm font-mono text-gray-700">{ep.path}</span>
                </div>
                {ep.params.length > 0 && (
                  <p className="text-xs text-gray-500">Params: {ep.params.join(", ")}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTest}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Test Connection
            </button>
            <button
              onClick={onToggle}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                network.enabled
                  ? "bg-red-100 text-red-700 hover:bg-red-200"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              {network.enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AddNetworkForm({ onAdd }: { onAdd: (network: NetworkConfig) => void }) {
  const [form, setForm] = useState({
    id: "",
    name: "",
    baseUrl: "",
    apiKeyName: "",
    authType: "bearer" as "token" | "bearer",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: form.id.toLowerCase(),
      name: form.name,
      baseUrl: form.baseUrl,
      apiKeyName: form.apiKeyName || `${form.id.toUpperCase()}_API_KEY`,
      authType: form.authType,
      enabled: true,
      endpoints: [],
    });
    setForm({ id: "", name: "", baseUrl: "", apiKeyName: "", authType: "bearer" });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Add New Affiliate Network</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Network ID</label>
          <input
            type="text"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            placeholder="e.g., vcommission"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Display Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., VCommission"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Base URL</label>
          <input
            type="url"
            value={form.baseUrl}
            onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
            placeholder="e.g., https://api.vcommission.com/v2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Env Var Name (optional)</label>
          <input
            type="text"
            value={form.apiKeyName}
            onChange={(e) => setForm({ ...form, apiKeyName: e.target.value })}
            placeholder="VCOMMISSION_API_KEY"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Auth Type</label>
          <select
            value={form.authType}
            onChange={(e) => setForm({ ...form, authType: e.target.value as "token" | "bearer" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="bearer">Bearer Token (most APIs)</option>
            <option value="token">Token token=xxx (Cuelinks)</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      >
        Add Network
      </button>
    </form>
  );
}

function ApiTester({ networks }: { networks: NetworkConfig[] }) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]?.id || "");
  const [selectedEndpoint, setSelectedEndpoint] = useState("");
  const [params, setParams] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentNetwork = networks.find((n) => n.id === selectedNetwork);
  const currentEndpoint = currentNetwork?.endpoints.find((e) => e.id === selectedEndpoint);

  const handleTest = async () => {
    if (!currentNetwork || !currentEndpoint) return;

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const url = new URL(`/api/affiliate/${currentNetwork.id}/${currentEndpoint.id}`, window.location.origin);
      if (params) {
        params.split(",").forEach((p) => {
          const [key, value] = p.split("=");
          if (key && value) url.searchParams.set(key.trim(), value.trim());
        });
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Request failed");
      } else {
        setResponse(data);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">API Tester</h3>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Network</label>
          <select
            value={selectedNetwork}
            onChange={(e) => {
              setSelectedNetwork(e.target.value);
              setSelectedEndpoint("");
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            {networks.filter((n) => n.enabled).map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Endpoint</label>
          <select
            value={selectedEndpoint}
            onChange={(e) => setSelectedEndpoint(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">Select endpoint</option>
            {currentNetwork?.endpoints.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Params (key=value,...)</label>
          <input
            type="text"
            value={params}
            onChange={(e) => setParams(e.target.value)}
            placeholder="page=1, category=shopping"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <button
        onClick={handleTest}
        disabled={loading || !selectedEndpoint}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test API"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Response:</p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================

export default function AffiliateNetworksPage() {
  const [networks, setNetworks] = useState<NetworkConfig[]>(DEFAULT_NETWORKS);
  const [activeTab, setActiveTab] = useState<"networks" | "test">("networks");

  const handleToggle = (id: string) => {
    setNetworks((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const handleTest = async (id: string) => {
    console.log(`Testing network: ${id}`);
    // This would open a modal or navigate to test
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this network?")) {
      setNetworks((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleAddNetwork = (network: NetworkConfig) => {
    setNetworks((prev) => [...prev, network]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Networks</h1>
          <p className="text-gray-600">Manage your affiliate API integrations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("networks")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === "networks"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Networks
          </button>
          <button
            onClick={() => setActiveTab("test")}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition ${
              activeTab === "test"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            API Tester
          </button>
        </div>

        {activeTab === "networks" ? (
          <div className="space-y-6">
            <div className="grid gap-4">
              {networks.map((network) => (
                <NetworkCard
                  key={network.id}
                  network={network}
                  onToggle={() => handleToggle(network.id)}
                  onTest={() => handleTest(network.id)}
                  onDelete={() => handleDelete(network.id)}
                />
              ))}
            </div>
            <AddNetworkForm onAdd={handleAddNetwork} />
          </div>
        ) : (
          <ApiTester networks={networks} />
        )}
      </div>
    </div>
  );
}
