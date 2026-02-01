import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CouponsPageClient from "./CouponsPageClient";

export default async function CouponsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const coupons = await prisma.couponCode.findMany({
    orderBy: { createdAt: "desc" },
  });

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

  return <CouponsPageClient initialCoupons={sanitizedCoupons} />;
}
