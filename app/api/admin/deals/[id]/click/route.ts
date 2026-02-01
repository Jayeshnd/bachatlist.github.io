import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/admin/deals/[id]/click - Track a click on a deal
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    console.log(`[Deal Click] Tracking click for deal ${id}`);

    // Update the click count
    const updatedDeal = await prisma.deal.update({
      where: { id: id },
      data: {
        clicks: {
          increment: 1,
        },
      },
      select: {
        id: true,
        title: true,
        clicks: true,
        affiliateUrl: true,
      },
    });

    console.log(`[Deal Click] Updated deal ${id}, new click count: ${updatedDeal.clicks}`);

    return NextResponse.json({
      success: true,
      dealId: updatedDeal.id,
      totalClicks: updatedDeal.clicks,
      affiliateUrl: updatedDeal.affiliateUrl,
    });
  } catch (error) {
    console.error("[Deal Click] Error tracking click:", error);
    return NextResponse.json(
      { error: "Failed to track click", message: String(error) },
      { status: 500 }
    );
  }
}

// GET /api/admin/deals/[id]/click - Get click stats for a deal
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deal = await prisma.deal.findUnique({
      where: { id: id },
      select: {
        id: true,
        title: true,
        views: true,
        clicks: true,
      },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const clickRate = deal.views > 0 ? (deal.clicks / deal.views) * 100 : 0;

    return NextResponse.json({
      dealId: deal.id,
      title: deal.title,
      views: deal.views,
      clicks: deal.clicks,
      clickRate: clickRate.toFixed(2) + "%",
    });
  } catch (error) {
    console.error("[Deal Click Stats] Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch click stats", message: String(error) },
      { status: 500 }
    );
  }
}
