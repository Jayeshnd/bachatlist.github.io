import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper function to extract store name from affiliate URL
function extractStoreNameFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    // Handle URLs that might be wrapped in redirect services
    const decodedUrl = decodeURIComponent(url);
    
    // Try to extract from url= parameter (common in redirect services)
    const urlMatch = decodedUrl.match(/url=https?:\/\/([^/]+)/i);
    if (urlMatch) {
      const hostname = urlMatch[1].split('?')[0].split('/')[0]; // Get hostname without path or query
      return hostname.replace('www.', '').split('.').slice(0, -1).join(' ')
        .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    // Try to extract from direct URL
    const urlObj = new URL(decodedUrl.startsWith('http') ? decodedUrl : 'https://' + decodedUrl);
    const hostname = urlObj.hostname.replace('www.', '');
    // Remove TLD (.com, .in, .co, etc.)
    const storeName = hostname.split('.').slice(0, -1).join(' ')
      .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return storeName || "Store";
  } catch {
    return null;
  }
}

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
        affiliateUrl: data.affiliateUrl || null,
        
        // Store/Merchant Info from Cuelinks or manual entry
        // Auto-extract store name from affiliate URL if not provided
        storeName: data.storeName || extractStoreNameFromUrl(data.affiliateUrl) || null,
        storeLogo: data.storeLogo || null,
        
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
      affiliateUrl: coupon.affiliateUrl,
      storeName: coupon.storeName,
      storeLogo: coupon.storeLogo,
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
