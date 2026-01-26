"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnalyticsPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Track performance and user engagement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Deals</h3>
          <p className="text-gray-600 text-center py-8">
            Coming soon...
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">User Activity</h3>
          <p className="text-gray-600 text-center py-8">
            Coming soon...
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Traffic</h3>
          <p className="text-gray-600 text-center py-8">
            Coming soon...
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue</h3>
          <p className="text-gray-600 text-center py-8">
            Coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}
