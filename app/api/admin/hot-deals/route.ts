import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { serializeDecimal } from "@/lib/utils";

// GET all hot deals
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hotDeals = await prisma.hotDeal.findMany({
      include: {
        deal: {
          include: { category: true },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(serializeDecimal(hotDeals));
  } catch (error) {
    console.error("Failed to fetch hot deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch hot deals" },
      { status: 500 }
    );
  }
}

// POST add a deal to hot deals
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.dealId) {
      return NextResponse.json(
        { error: "Deal ID is required" },
        { status: 400 }
      );
    }

    // Check if deal exists
    const deal = await prisma.deal.findUnique({
      where: { id: data.dealId },
    });

    if (!deal) {
      return NextResponse.json(
        { error: "Deal not found" },
        { status: 404 }
      );
    }

    // Check if deal is already in hot deals
    const existingHotDeal = await prisma.hotDeal.findUnique({
      where: { dealId: data.dealId },
    });

    if (existingHotDeal) {
      return NextResponse.json(
        { error: "Deal is already in hot deals" },
        { status: 400 }
      );
    }

    // Get the highest order to append the new hot deal
    const highestOrder = await prisma.hotDeal.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = highestOrder ? highestOrder.order + 1 : 0;

    const hotDeal = await prisma.hotDeal.create({
      data: {
        dealId: data.dealId,
        order: newOrder,
        isActive: data.isActive !== false,
        customTitle: data.customTitle || null,
        customBadge: data.customBadge || null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        showOnHomepage: data.showOnHomepage !== false,
        showOnLootPage: data.showOnLootPage !== false,
      },
      include: {
        deal: {
          include: { category: true },
        },
      },
    });

    return NextResponse.json(serializeDecimal(hotDeal), { status: 201 });
  } catch (error) {
    console.error("Failed to add hot deal:", error);
    return NextResponse.json(
      { error: "Failed to add hot deal" },
      { status: 500 }
    );
  }
}

// PUT reorder hot deals
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    if (!data.hotDeals || !Array.isArray(data.hotDeals)) {
      return NextResponse.json(
        { error: "Hot deals array is required" },
        { status: 400 }
      );
    }

    // Update order for all hot deals
    await Promise.all(
      data.hotDeals.map((hotDeal: { id: string; order: number }) =>
        prisma.hotDeal.update({
          where: { id: hotDeal.id },
          data: { order: hotDeal.order },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to reorder hot deals:", error);
    return NextResponse.json(
      { error: "Failed to reorder hot deals" },
      { status: 500 }
    );
  }
}
