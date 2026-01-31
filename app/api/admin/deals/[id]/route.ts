import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify, toNumber, serializeDecimal } from "@/lib/utils";

/**
 * Serialize deal for API response - converts Decimals to numbers for form compatibility
 */
function serializeDealForForm(deal: any) {
  return {
    id: deal.id,
    title: deal.title,
    description: deal.description,
    shortDesc: deal.shortDesc,
    originalPrice: toNumber(deal.originalPrice),
    currentPrice: toNumber(deal.currentPrice),
    discount: deal.discount ? parseInt(deal.discount) : null,
    currency: deal.currency,
    productUrl: deal.productUrl,
    categoryId: deal.categoryId,
    status: deal.status,
    primaryImage: deal.primaryImage,
    category: deal.category ? {
      id: deal.category.id,
      name: deal.category.name
    } : null,
  };
}

// GET a single deal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("[DEBUG] GET /api/admin/deals/[id] - Starting request");
    const session = await auth();
    console.log("[DEBUG] Session retrieved:", session ? "valid" : "null/undefined");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log("[DEBUG] Deal ID:", id);

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { category: true },
    });
    console.log("[DEBUG] Deal found:", !!deal);

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(serializeDealForForm(deal));
  } catch (error) {
    console.error("Failed to fetch deal:", error);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

// PUT update a deal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("[DEBUG] PUT /api/admin/deals/[id] - Starting request");
    let session;
    try {
      session = await auth();
      console.log("[DEBUG] Session retrieved:", session ? "valid" : "null/undefined");
    } catch (authError) {
      console.error("[DEBUG] Auth error:", authError);
      throw authError;
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log("[DEBUG] Deal ID:", id);
    const data = await request.json();
    console.log("[DEBUG] PUT /api/admin/deals/[id] - Received data:", JSON.stringify(data, null, 2));

    // Build update data dynamically - only include provided non-empty fields
    const updateData: any = {};

    // If title is provided and non-empty, do a full update
    if (data.title && data.title.trim()) {
      updateData.title = data.title;
      
      // Generate slug and ensure uniqueness
      let newSlug = slugify(data.title);
      
      // Check if slug already exists for a different deal
      const existingDealWithSlug = await prisma.deal.findFirst({
        where: {
          slug: newSlug,
          NOT: { id: id } // Exclude current deal
        }
      });
      
      // If slug exists, append a unique suffix
      if (existingDealWithSlug) {
        console.log("[DEBUG] Slug conflict detected, appending unique suffix");
        newSlug = `${newSlug}-${Date.now()}`;
      }
      
      updateData.slug = newSlug;
    }

    // If description is provided and non-empty, update it
    if (data.description && data.description.trim()) {
      updateData.description = data.description;
      updateData.shortDesc = data.description.substring(0, 200);
    }

    // Handle numeric fields if provided
    if (data.originalPrice !== undefined && data.originalPrice !== null && data.originalPrice !== "") {
      updateData.originalPrice = parseFloat(data.originalPrice);
    }
    if (data.currentPrice !== undefined && data.currentPrice !== null && data.currentPrice !== "") {
      updateData.currentPrice = parseFloat(data.currentPrice);
    }
    if (data.discount !== undefined && data.discount !== null && data.discount !== "") {
      updateData.discount = parseInt(data.discount);
    }

    // Handle URL field
    if (data.url && data.url.trim()) {
      updateData.productUrl = data.url;
    }

    // Handle status if provided
    if (data.status) {
      updateData.status = data.status;
    }

    // Handle category - only update if categoryId is a non-empty string
    const categoryId = data.categoryId?.toString().trim();
    console.log('[Deal Update] categoryId processed:', categoryId, 'isValid:', !!categoryId);
    if (categoryId) {
      console.log('[Deal Update] Checking categoryId:', categoryId);
      const categoryExists = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      console.log('[Deal Update] Category exists:', !!categoryExists);

      if (!categoryExists) {
        return NextResponse.json(
          { error: `Category with ID ${data.categoryId} does not exist` },
          { status: 400 }
        );
      }
      updateData.categoryId = data.categoryId;
    } else {
      console.log('[Deal Update] No categoryId provided');
    }

    console.log('[Deal Update] updateData:', JSON.stringify(updateData));
    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      console.log('[Deal Update] No fields to update');
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    // Update deal
    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(serializeDealForForm(deal));
  } catch (error) {
    console.error("Failed to update deal:", error);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

// DELETE a deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("[DEBUG] DELETE /api/admin/deals/[id] - Starting request");
    const session = await auth();
    console.log("[DEBUG] Session retrieved:", session ? "valid" : "null/undefined");
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log("[DEBUG] Deal ID to delete:", id);

    await prisma.deal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deal:", error);
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
