import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET a single banner
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

    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to fetch banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// PUT update a banner
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

    const updateData: any = {};

    if (data.imageUrl) updateData.imageUrl = data.imageUrl;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle;
    if (data.link !== undefined) updateData.link = data.link;
    if (data.linkText !== undefined) updateData.linkText = data.linkText;
    if (data.position !== undefined) updateData.position = parseInt(data.position);
    if (data.isActive !== undefined) updateData.isActive = data.isActive === "on";
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    } else if (data.startDate === null) {
      updateData.startDate = null;
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    } else if (data.endDate === null) {
      updateData.endDate = null;
    }
    if (data.backgroundColor !== undefined) updateData.backgroundColor = data.backgroundColor;
    if (data.textColor !== undefined) updateData.textColor = data.textColor;
    if (data.mobileImageUrl !== undefined) updateData.mobileImageUrl = data.mobileImageUrl;
    if (data.bannerType !== undefined) updateData.bannerType = data.bannerType;
    if (data.clicks !== undefined) updateData.clicks = parseInt(data.clicks);

    const banner = await prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Failed to update banner:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE a banner
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

    await prisma.banner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
