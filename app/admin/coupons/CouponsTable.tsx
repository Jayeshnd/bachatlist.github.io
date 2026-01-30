"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function CouponsTable({ initialCoupons }: { initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const router = useRouter();

  async function toggleStatus(couponId: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setCoupons(
          coupons.map((coupon) =>
            coupon.id === couponId ? { ...coupon, isActive: !currentStatus } : coupon
          )
        );
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to update status"}`);
      }
    } catch (error) {
      console.error("Failed to update coupon status:", error);
      alert("Failed to update coupon status");
    }
  }

  async function deleteCoupon(couponId: string) {
    if (!window.confirm("Are you sure you want to delete this coupon?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCoupons(coupons.filter((coupon) => coupon.id !== couponId));
        alert("Coupon deleted successfully");
        router.refresh();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error || "Failed to delete coupon"}`);
      }
    } catch (error) {
      console.error("Failed to delete coupon:", error);
      alert("Failed to delete coupon");
    }
  }

  function formatDiscount(coupon: any) {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }
    return `₹${coupon.discountValue}`;
  }

  function isExpired(expiryDate: string | null) {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Code
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Discount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Expiry
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {coupons.map((coupon) => (
            <tr key={coupon.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <p className="font-mono font-bold text-gray-900">{coupon.code}</p>
                  {coupon.description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {coupon.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="font-semibold text-green-600">
                  {formatDiscount(coupon)}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600">
                {coupon.usageCount}
                {coupon.usageLimit && ` / ${coupon.usageLimit}`}
              </td>
              <td className="px-6 py-4">
                {coupon.expiryDate ? (
                  <span
                    className={`text-sm ${
                      isExpired(coupon.expiryDate)
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {new Date(coupon.expiryDate).toLocaleDateString()}
                    {isExpired(coupon.expiryDate) && " (Expired)"}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No expiry</span>
                )}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition ${
                    coupon.isActive && !isExpired(coupon.expiryDate)
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </button>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/coupons/${coupon.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
