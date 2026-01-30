import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

// GET all deals
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deals = await prisma.deal.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(deals);
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

// POST create new deal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.description || !data.url) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, url" },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = slugify(data.title);

    // Parse prices as Decimal
    const originalPrice = data.originalPrice
      ? parseFloat(data.originalPrice)
      : null;
    const discountedPrice = data.discountedPrice
      ? parseFloat(data.discountedPrice)
      : originalPrice || 0;
    const discount = data.discount ? parseInt(data.discount) : null;

    // Get or create default category if not provided
    let categoryId = data.categoryId;
    
    if (!categoryId) {
      // No category provided, create/use default
      let defaultCategory = await prisma.category.findFirst({
        where: { slug: "uncategorized" },
      });

      if (!defaultCategory) {
        defaultCategory = await prisma.category.create({
          data: {
            name: "Uncategorized",
            slug: "uncategorized",
            icon: "📁",
          },
        });
      }
      categoryId = defaultCategory.id;
    } else {
      // Verify that the provided category exists
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: `Category with ID ${categoryId} does not exist` },
          { status: 400 }
        );
      }
    }

    // Create deal
    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        shortDesc: data.description.substring(0, 200),
        currentPrice: discountedPrice || originalPrice || 0,
        originalPrice: originalPrice,
        discount: discount,
        productUrl: data.url,
        primaryImage: data.primaryImage || "", // Store base64 image or empty
        coupon: data.coupon || null,
        isLoot: data.isLoot || false,
        images: JSON.stringify([]),
        status: data.status || "DRAFT",
        categoryId: categoryId,
        authorId: session.user?.id || "",
      },
      include: { category: true },
    });

    return NextResponse.json(deal, { status: 201 });
  } catch (error) {
    console.error("Failed to create deal:", error);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
