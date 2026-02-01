import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { serializeDecimal } from "@/lib/utils";

// GET all active stores (public endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log("[Stores] Fetching stores from database...");
    
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("includeInactive") === "true";

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    console.log("[Stores] Query params:", { where, includeInactive });

    let stores;
    try {
      stores = await prisma.store.findMany({
        where,
        orderBy: { order: "asc" },
      });
    } catch (dbError) {
      console.error("[Stores] Database error:", dbError);
      // Return empty array if database is unavailable
      return NextResponse.json([]);
    }
    
    console.log("[Stores] Found:", stores?.length || 0, "stores");
    
    // Ensure stores is always an array
    const storesArray = Array.isArray(stores) ? stores : [];
    
    const serializedStores = storesArray.map((s: any) => serializeDecimal(s));
    console.log("[Stores] Serialized successfully:", serializedStores.length, "stores");
    
    return NextResponse.json(serializedStores);
  } catch (error) {
    console.error("[Stores] Error fetching stores:", error);
    // Return empty array instead of 500 error to prevent page failure
    return NextResponse.json([]);
  }
}
