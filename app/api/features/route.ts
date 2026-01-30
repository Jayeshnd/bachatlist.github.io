import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all active features
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get("isActive");
    const isFeatured = searchParams.get("isFeatured");
    const featureGroupId = searchParams.get("featureGroupId");

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === "true";
    }
    if (featureGroupId) {
      where.featureGroupId = featureGroupId;
    }

    // If no filters, default to active features
    if (isActive === null && isFeatured === null && !featureGroupId) {
      where.isActive = true;
    }

    const features = await prisma.feature.findMany({
      where,
      include: {
        featureGroup: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(features);
  } catch (error) {
    console.error("Failed to fetch features:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}
