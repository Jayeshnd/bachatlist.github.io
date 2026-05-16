"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ApiLog {
  id: string;
  networkId: string;
  type: string;
  action: string;
  status: string;
  message: string;
  createdAt: string;
}

interface AmazonStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  searches: number;
  products: number;
  avgResponseTime: number;
}

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<ApiLog[]>([]);
  const [stats, setStats] = useState<AmazonStats>({
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    searches: 0,
    products: 0,
    avgResponseTime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalytics();
    }
  }, [status]);

  async function fetchAnalytics() {
    try {
      const response = await fetch("/api/admin/analytics/amazon");
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setStats(data.stats || stats);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 rounded"></div>)}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Amazon PA-API Analytics</h1>
        <p className="text-gray-600 mt-1">Monitor Amazon affiliate API usage and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Total API Calls</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCalls}</div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Successful</div>
          <div className="text-3xl font-bold text-green-600 mt-2">{stats.successfulCalls}</div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Failed</div>
          <div className="text-3xl font-bold text-red-600 mt-2">{stats.failedCalls}</div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Searches</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">{stats.searches}</div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Product Lookups</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">{stats.products}</div>
        </div>
        
        <div className="bg-white rounded-xl border p-6">
          <div className="text-sm text-gray-500">Avg Response</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">{stats.avgResponseTime}ms</div>
        </div>
      </div>

      {/* Recent API Calls */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900">Recent API Calls</h3>
          <p className="text-sm text-gray-500 mt-1">Last 50 Amazon PA-API requests</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No Amazon API calls yet. Start using the Amazon endpoints to see analytics.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'SUCCESS' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}