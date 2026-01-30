import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CouponsTable } from "./CouponsTable";

export default async function CouponsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const coupons = await prisma.couponCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Sanitize coupons to remove Decimal objects
  const sanitizedCoupons = coupons.map((coupon) => ({
    id: coupon.id,
    code: coupon.code,
    description: coupon.description,
    discountType: coupon.discountType,
    discountValue: parseFloat(coupon.discountValue.toString()),
    expiryDate: coupon.expiryDate?.toISOString() || null,
    isActive: coupon.isActive,
    minPurchase: coupon.minPurchase ? parseFloat(coupon.minPurchase.toString()) : null,
    maxDiscount: coupon.maxDiscount ? parseFloat(coupon.maxDiscount.toString()) : null,
    usageLimit: coupon.usageLimit,
    usageCount: coupon.usageCount,
    createdAt: coupon.createdAt.toISOString(),
    updatedAt: coupon.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupon Codes</h1>
          <p className="text-gray-600 mt-1">Manage all coupon codes and promotions</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Coupon
        </Link>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Coupons</h2>
        </div>

        {sanitizedCoupons.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No coupons yet</h3>
            <p className="text-gray-600 mb-4">Create your first coupon code to get started</p>
            <Link
              href="/admin/coupons/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Coupon
            </Link>
          </div>
        ) : (
          <CouponsTable initialCoupons={sanitizedCoupons} />
        )}
      </div>
    </div>
  );
}
