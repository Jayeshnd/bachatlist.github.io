import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET a single feature
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

    const feature = await prisma.feature.findUnique({
      where: { id },
      include: {
        featureGroup: true,
      },
    });

    if (!feature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    return NextResponse.json(feature);
  } catch (error) {
    console.error("Failed to fetch feature:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature" },
      { status: 500 }
    );
  }
}

// PUT update a feature
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

    // Check if feature exists
    const existingFeature = await prisma.feature.findUnique({
      where: { id },
    });

    if (!existingFeature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    // Build update data dynamically
    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    if (data.icon !== undefined) {
      updateData.icon = data.icon;
    }

    if (data.image !== undefined) {
      updateData.image = data.image;
    }

    if (data.linkUrl !== undefined) {
      updateData.linkUrl = data.linkUrl;
    }

    if (data.linkText !== undefined) {
      updateData.linkText = data.linkText;
    }

    if (data.order !== undefined) {
      updateData.order = data.order;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }

    if (data.color !== undefined) {
      updateData.color = data.color;
    }

    if (data.backgroundColor !== undefined) {
      updateData.backgroundColor = data.backgroundColor;
    }

    if (data.featureGroupId !== undefined) {
      updateData.featureGroupId = data.featureGroupId;
    }

    const feature = await prisma.feature.update({
      where: { id },
      data: updateData,
      include: {
        featureGroup: true,
      },
    });

    return NextResponse.json(feature);
  } catch (error) {
    console.error("Failed to update feature:", error);
    return NextResponse.json(
      { error: "Failed to update feature" },
      { status: 500 }
    );
  }
}

// DELETE a feature
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

    // Check if feature exists
    const existingFeature = await prisma.feature.findUnique({
      where: { id },
    });

    if (!existingFeature) {
      return NextResponse.json({ error: "Feature not found" }, { status: 404 });
    }

    await prisma.feature.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Feature deleted successfully" });
  } catch (error) {
    console.error("Failed to delete feature:", error);
    return NextResponse.json(
      { error: "Failed to delete feature" },
      { status: 500 }
    );
  }
}
