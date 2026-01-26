"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AffiliateNetworksPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const networks = [
    { name: "Amazon Associates", icon: "🛒", status: "Connected" },
    { name: "Flipkart Affiliate", icon: "🏪", status: "Disconnected" },
    { name: "MyntraAffiliate", icon: "👗", status: "Disconnected" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Affiliate Networks</h1>
        <p className="text-gray-600 mt-1">Manage your affiliate connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {networks.map((network) => (
          <div
            key={network.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{network.icon}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  network.status === "Connected"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {network.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{network.name}</h3>
            <p className="text-sm text-gray-600 mt-2">
              {network.status === "Connected"
                ? "Active and earning"
                : "Not connected yet"}
            </p>
            <button className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition text-sm">
              {network.status === "Connected" ? "Disconnect" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
