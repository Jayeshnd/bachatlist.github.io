import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { asin, categorySlug = "amazon", notify = true, status } = body;

    if (!asin) {
      return NextResponse.json({ error: "ASIN is required" }, { status: 400 });
    }

    // Get Amazon config for affiliate link generation
    const associateTag = process.env.AMAZON_ASSOCIATE_TAG || "";
    const region = process.env.AMAZON_REGION || "in";

    const baseUrl = region === "in" ? "https://www.amazon.in/dp" : "https://www.amazon.com/dp";
    const affiliateUrl = `${baseUrl}/${asin}?tag=${associateTag}`;
    const productUrl = `${baseUrl}/${asin}`;

    // Get or create Amazon category
    let category = await prisma.category.findFirst({
      where: { slug: categorySlug },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Amazon",
          slug: "amazon",
          icon: "🛒",
        },
      });
    }

    // Get a system user for the deal
    let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!author) {
      author = await prisma.user.findFirst();
    }
    if (!author) {
      return NextResponse.json({ error: "No user found to assign as author" }, { status: 500 });
    }

    // Create a basic deal (user can edit details later)
    const deal = await prisma.deal.create({
      data: {
        title: `Amazon Product - ${asin}`,
        slug: `amazon-${asin}`.toLowerCase(),
        description: `Amazon product imported via ASIN: ${asin}`,
        shortDesc: `Amazon product ${asin}`,
        currentPrice: 0,
        originalPrice: 0,
        discount: 0,
        productUrl,
        affiliateUrl,
        images: "[]",
        status: status === "DRAFT" ? "DRAFT" : "PUBLISHED",
        categoryId: category.id,
        isLoot: false,
        authorId: author.id,
      },
    });

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error("Amazon import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import from Amazon" },
      { status: 500 }
    );
  }
}
