import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Custom serialization that doesn't break objects
function serializeData(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  // Handle Prisma Decimal objects
  if (
    typeof data === 'object' && 
    'toString' in data && 
    typeof data.toString === 'function' &&
    data.toString !== Object.prototype.toString
  ) {
    return data.toString();
  }
  
  // Handle BigInt
  if (typeof data === 'bigint') {
    return data.toString();
  }
  
  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => serializeData(item));
  }
  
  // Handle Date objects
  if (data instanceof Date) {
    return data.toISOString();
  }
  
  // Handle plain objects (don't stringify them!)
  if (typeof data === 'object') {
    const serialized: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      serialized[key] = serializeData(val);
    }
    return serialized;
  }
  
  return data;
}

// GET a single coupon
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const coupon = await prisma.couponCode.findUnique({
      where: { id },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json(serializeData(coupon));
  } catch (error) {
    console.error("Failed to fetch coupon:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupon" },
      { status: 500 }
    );
  }
}

// PUT update a coupon
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check if trying to change code to an existing one
    if (data.code) {
      const existingCoupon = await prisma.couponCode.findFirst({
        where: {
          code: data.code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existingCoupon) {
        return NextResponse.json(
          { error: "Coupon code already exists" },
          { status: 400 }
        );
      }
    }

    // Build update data dynamically
    const updateData: any = {};

    if (data.code) updateData.code = data.code.toUpperCase();
    if (data.description !== undefined) updateData.description = data.description;
    if (data.discountType) updateData.discountType = data.discountType;
    if (data.discountValue !== undefined) {
      updateData.discountValue = parseFloat(data.discountValue);
    }
    if (data.expiryDate) {
      updateData.expiryDate = new Date(data.expiryDate);
    } else if (data.expiryDate === null) {
      updateData.expiryDate = null;
    }
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.minPurchase !== undefined) {
      updateData.minPurchase = data.minPurchase ? parseFloat(data.minPurchase) : null;
    }
    if (data.maxDiscount !== undefined) {
      updateData.maxDiscount = data.maxDiscount ? parseFloat(data.maxDiscount) : null;
    }
    if (data.usageLimit !== undefined) {
      updateData.usageLimit = data.usageLimit ? parseInt(data.usageLimit) : null;
    }
    if (data.usageCount !== undefined) {
      updateData.usageCount = parseInt(data.usageCount);
    }
    if (data.applicableCategories !== undefined) {
      updateData.applicableCategories = data.applicableCategories
        ? JSON.stringify(data.applicableCategories)
        : null;
    }
    if (data.applicableDeals !== undefined) {
      updateData.applicableDeals = data.applicableDeals
        ? JSON.stringify(data.applicableDeals)
        : null;
    }
    if (data.metaTitle !== undefined) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription;

    const coupon = await prisma.couponCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(serializeData(coupon));
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE a coupon
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.couponCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
