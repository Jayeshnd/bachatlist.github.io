import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { serializeDecimal } from "@/lib/utils";

// GET all active stores (public endpoint)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    const stores = await prisma.store.findMany({
      where,
      orderBy: { order: "asc" },
    });
    
    console.log("[DEBUG] Stores from DB:", JSON.stringify(stores, null, 2));

    return NextResponse.json(stores.map((s: any) => serializeDecimal(s)));
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}
