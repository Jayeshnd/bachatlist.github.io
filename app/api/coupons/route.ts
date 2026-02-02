import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cache key for ISR
const CACHE_TAGS = ['coupons'];

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
      // Select only needed fields for better performance
      select: {
        id: true,
        code: true,
        description: true,
        discountType: true,
        discountValue: true,
        expiryDate: true,
        isActive: true,
        minPurchase: true,
        maxDiscount: true,
        usageLimit: true,
        usageCount: true,
        affiliateUrl: true,
        storeName: true,
        storeLogo: true,
      }
    });

    // Serialize the data to handle Decimal types
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
      affiliateUrl: coupon.affiliateUrl,
      storeName: coupon.storeName,
      storeLogo: coupon.storeLogo,
    }));

    // Return with caching headers
    return new NextResponse(JSON.stringify(serializedCoupons), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=60',
        'Vercel-Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}
