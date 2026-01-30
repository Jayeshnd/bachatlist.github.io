import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all features
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

// POST create new feature
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description) {
      return NextResponse.json(
        { error: "Missing required fields: title and description" },
        { status: 400 }
      );
    }

    const feature = await prisma.feature.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon || null,
        image: data.image || null,
        linkUrl: data.linkUrl || null,
        linkText: data.linkText || null,
        order: data.order || 0,
        isActive: data.isActive !== false,
        isFeatured: data.isFeatured || false,
        color: data.color || null,
        backgroundColor: data.backgroundColor || null,
        featureGroupId: data.featureGroupId || null,
      },
      include: {
        featureGroup: true,
      },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("Failed to create feature:", error);
    return NextResponse.json(
      { error: "Failed to create feature" },
      { status: 500 }
    );
  }
}
