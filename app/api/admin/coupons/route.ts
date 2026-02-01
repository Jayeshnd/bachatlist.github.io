import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all coupon codes
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      applicableCategories: coupon.applicableCategories,
      applicableDeals: coupon.applicableDeals,
      metaTitle: coupon.metaTitle,
      metaDescription: coupon.metaDescription,
      createdAt: coupon.createdAt.toISOString(),
      updatedAt: coupon.updatedAt.toISOString(),
    }));

    return NextResponse.json(sanitizedCoupons);
  } catch (error) {
    console.error("Failed to fetch coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST create new coupon code
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.code) {
      return NextResponse.json(
        { error: "Coupon code is required" },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existingCoupon = await prisma.couponCode.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existingCoupon) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 400 }
      );
    }

    // Log the data being sent for debugging
    console.log("Creating coupon with data:", JSON.stringify(data, null, 2));

    // Create coupon
    const coupon = await prisma.couponCode.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description || null,
        discountType: (data.discountType || "PERCENTAGE").toUpperCase(),
        discountValue: String(typeof data.discountValue === 'number' ? data.discountValue : parseFloat(data.discountValue || '0')),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isActive: data.isActive === "on" || data.isActive === true,
        minPurchase: data.minPurchase ? String(typeof data.minPurchase === 'number' ? data.minPurchase : parseFloat(data.minPurchase)) : null,
        maxDiscount: data.maxDiscount ? String(typeof data.maxDiscount === 'number' ? data.maxDiscount : parseFloat(data.maxDiscount)) : null,
        usageLimit: data.usageLimit ? (typeof data.usageLimit === 'number' ? data.usageLimit : parseInt(data.usageLimit)) : null,
        applicableCategories: data.applicableCategories
          ? JSON.stringify(data.applicableCategories)
          : null,
        applicableDeals: data.applicableDeals
          ? JSON.stringify(data.applicableDeals)
          : null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    });

    // Return sanitized coupon
    return NextResponse.json({
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
      metaTitle: coupon.metaTitle,
      metaDescription: coupon.metaDescription,
      createdAt: coupon.createdAt.toISOString(),
      updatedAt: coupon.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create coupon:", error);
    return NextResponse.json(
      { error: "Failed to create coupon", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
