import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify, serializeDecimal } from "@/lib/utils";

// GET a single deal
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

    const deal = await prisma.deal.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json(serializeDecimal(deal));
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
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Build update data dynamically - only include provided fields
    const updateData: any = {};

    // If only status is provided, do a quick update
    if (data.status && !data.title) {
      updateData.status = data.status;
    } else {
      // Full update with validation
      if (!data.title || !data.description) {
        return NextResponse.json(
          { error: "Missing required fields: title and description" },
          { status: 400 }
        );
      }

      updateData.title = data.title;
      updateData.slug = slugify(data.title);
      updateData.description = data.description;
      updateData.shortDesc = data.description.substring(0, 200);

      if (data.originalPrice !== undefined && data.originalPrice !== null) {
        updateData.originalPrice = parseFloat(data.originalPrice);
      }
      if (data.currentPrice !== undefined && data.currentPrice !== null) {
        updateData.currentPrice = parseFloat(data.currentPrice);
      }
      if (data.discount !== undefined && data.discount !== null) {
        updateData.discount = parseInt(data.discount);
      }
      if (data.url) {
        updateData.productUrl = data.url;
      }
      if (data.status) {
        updateData.status = data.status;
      }

      // Handle category
      if (data.categoryId) {
        const categoryExists = await prisma.category.findUnique({
          where: { id: data.categoryId },
        });

        if (!categoryExists) {
          return NextResponse.json(
            { error: `Category with ID ${data.categoryId} does not exist` },
            { status: 400 }
          );
        }
        updateData.categoryId = data.categoryId;
      }
    }

    // Update deal
    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json(serializeDecimal(deal));
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
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

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
