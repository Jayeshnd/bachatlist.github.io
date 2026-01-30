import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET: Get current Amazon configuration
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await prisma.amazonConfig.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!config) {
      return NextResponse.json({ error: "No Amazon configuration found" }, { status: 404 });
    }

    // Don't expose secret keys
    const { accessKey, secretKey, ...safeConfig } = config;

    return NextResponse.json({
      ...safeConfig,
      hasKeys: !!(accessKey && secretKey),
    });
  } catch (error) {
    console.error("Error fetching Amazon config:", error);
    return NextResponse.json(
      { error: "Failed to fetch Amazon configuration" },
      { status: 500 }
    );
  }
}

// POST: Create or update Amazon configuration
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { associateTag, accessKey, secretKey, region, marketplace, isActive } = body;

    // Validate required fields
    if (!associateTag || !accessKey || !secretKey) {
      return NextResponse.json(
        { error: "Missing required fields: associateTag, accessKey, secretKey" },
        { status: 400 }
      );
    }

    // Check if config exists, update or create
    const existingConfig = await prisma.amazonConfig.findFirst();

    if (existingConfig) {
      const config = await prisma.amazonConfig.update({
        where: { id: existingConfig.id },
        data: {
          associateTag,
          accessKey,
          secretKey,
          region: region || "in",
          marketplace: marketplace || "IN",
          isActive: isActive ?? true,
        },
      });

      return NextResponse.json({
        id: config.id,
        associateTag: config.associateTag,
        region: config.region,
        marketplace: config.marketplace,
        isActive: config.isActive,
        message: "Amazon configuration updated successfully",
      });
    } else {
      const config = await prisma.amazonConfig.create({
        data: {
          associateTag,
          accessKey,
          secretKey,
          region: region || "in",
          marketplace: marketplace || "IN",
          isActive: isActive ?? true,
        },
      });

      return NextResponse.json({
        id: config.id,
        associateTag: config.associateTag,
        region: config.region,
        marketplace: config.marketplace,
        isActive: config.isActive,
        message: "Amazon configuration created successfully",
      });
    }
  } catch (error) {
    console.error("Error saving Amazon config:", error);
    return NextResponse.json(
      { error: "Failed to save Amazon configuration" },
      { status: 500 }
    );
  }
}

// DELETE: Delete Amazon configuration
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const config = await prisma.amazonConfig.findFirst();
    if (!config) {
      return NextResponse.json({ error: "No Amazon configuration found" }, { status: 404 });
    }

    await prisma.amazonConfig.delete({
      where: { id: config.id },
    });

    return NextResponse.json({ message: "Amazon configuration deleted successfully" });
  } catch (error) {
    console.error("Error deleting Amazon config:", error);
    return NextResponse.json(
      { error: "Failed to delete Amazon configuration" },
      { status: 500 }
    );
  }
}
