import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET loot deals
export async function GET() {
  try {
    const lootDeals = await prisma.deal.findMany({
      where: {
        isLoot: true,
        status: "PUBLISHED",
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lootDeals);
  } catch (error) {
    console.error("Failed to fetch loot deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch loot deals" },
      { status: 500 }
    );
  }
}
