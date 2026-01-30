import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import EditCouponForm from "./EditCouponForm";

export default async function EditCouponPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const coupon = await prisma.couponCode.findUnique({
    where: { id },
  });

  if (!coupon) {
    redirect("/admin/coupons");
  }

  // Sanitize coupon
  const sanitizedCoupon = {
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
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/coupons"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Coupon</h1>
            <p className="text-gray-600 mt-1">Update coupon code details</p>
          </div>
        </div>

        <EditCouponForm coupon={sanitizedCoupon} />
      </div>
    </div>
  );
}
