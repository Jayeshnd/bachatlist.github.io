import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET a single hot deal
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

    const hotDeal = await prisma.hotDeal.findUnique({
      where: { id },
      include: {
        deal: {
          include: { category: true },
        },
      },
    });

    if (!hotDeal) {
      return NextResponse.json({ error: "Hot deal not found" }, { status: 404 });
    }

    return NextResponse.json(hotDeal);
  } catch (error) {
    console.error("Failed to fetch hot deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch hot deal" },
      { status: 500 }
    );
  }
}

// PUT update a hot deal
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

    if (data.order !== undefined) updateData.order = parseInt(data.order);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.customTitle !== undefined) updateData.customTitle = data.customTitle;
    if (data.customBadge !== undefined) updateData.customBadge = data.customBadge;
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
    if (data.showOnHomepage !== undefined) updateData.showOnHomepage = data.showOnHomepage;
    if (data.showOnLootPage !== undefined) updateData.showOnLootPage = data.showOnLootPage;

    const hotDeal = await prisma.hotDeal.update({
      where: { id },
      data: updateData,
      include: {
        deal: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json(hotDeal);
  } catch (error) {
    console.error("Failed to update hot deal:", error);
    return NextResponse.json(
      { error: "Failed to update hot deal" },
      { status: 500 }
    );
  }
}

// DELETE a hot deal
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

    await prisma.hotDeal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete hot deal:", error);
    return NextResponse.json(
      { error: "Failed to delete hot deal" },
      { status: 500 }
    );
  }
}
