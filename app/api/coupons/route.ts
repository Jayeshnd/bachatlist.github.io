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

    // Serialize the data to handle Decimal types
    const serializedCoupons = couponCodes.map(serializeDecimal);

    return NextResponse.json(serializedCoupons);
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}
