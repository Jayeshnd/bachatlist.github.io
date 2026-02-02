import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeDecimal } from "@/lib/utils";

export async function GET() {
  try {
    const couponCodes = await prisma.couponCode.findMany({
      where: {
        isActive: true,
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: new Date() } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize the data to handle Decimal types and include all fields
    const serializedCoupons = couponCodes.map((coupon) => ({
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
      applicableCategories: coupon.applicableCategories,
      applicableDeals: coupon.applicableDeals,
      affiliateUrl: coupon.affiliateUrl,
      storeName: coupon.storeName,
      storeLogo: coupon.storeLogo,
      metaTitle: coupon.metaTitle,
      metaDescription: coupon.metaDescription,
      createdAt: coupon.createdAt.toISOString(),
      updatedAt: coupon.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}
