import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductDetails, generateAffiliateUrl, cacheAmazonProduct } from "@/lib/amazon";
import { slugify } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

// POST: Import Amazon product as a deal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { asin, categoryId, title, description, currentPrice, originalPrice, shortDesc, badge } = body;

    if (!asin) {
      return NextResponse.json(
        { error: "Missing required field: asin" },
        { status: 400 }
      );
    }

    // Get active Amazon config
    const config = await prisma.amazonConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      return NextResponse.json(
        { error: "No active Amazon configuration found" },
        { status: 400 }
      );
    }

    // Get product details from Amazon or cache
    let product = await getCachedProduct(asin);

    if (!product) {
      const freshProduct = await getProductDetails({
        asin,
        region: config.region,
        accessKey: config.accessKey,
        secretKey: config.secretKey,
        associateTag: config.associateTag,
      });

      if (!freshProduct) {
        return NextResponse.json(
          { error: "Product not found on Amazon" },
          { status: 404 }
        );
      }

      // Cache the product
      product = await cacheAmazonProduct(freshProduct);
    }

    // Generate affiliate URL
    const affiliateUrl = generateAffiliateUrl(asin, config.associateTag, config.region);

    // Calculate discount if original price is available
    let discount: number | undefined;
    if (originalPrice && currentPrice) {
      const origPrice = parseFloat(originalPrice.toString());
      const currPrice = parseFloat(currentPrice.toString());
      discount = Math.round(((origPrice - currPrice) / origPrice) * 100);
    }

    // Create the deal
    const dealTitle = title || product.title;
    const dealDescription = description || product.description || shortDesc || "";
    const dealShortDesc = shortDesc || product.description?.substring(0, 200) || "";

    // Generate unique slug
    let slug = slugify(dealTitle);
    const existingSlug = await prisma.deal.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    // Determine category
    let dealCategoryId = categoryId;
    if (!dealCategoryId) {
      // Find first active category or create a default one
      const defaultCategory = await prisma.category.findFirst({
        where: { isActive: true },
        orderBy: { order: "asc" },
      });
      dealCategoryId = defaultCategory?.id;
    }

    if (!dealCategoryId) {
      return NextResponse.json(
        { error: "No category found. Please provide a categoryId or ensure categories exist." },
        { status: 400 }
      );
    }

    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        title: dealTitle,
        slug,
        description: dealDescription,
        shortDesc: dealShortDesc,
        currentPrice: currentPrice || product.currentPrice || 0,
        originalPrice: originalPrice || product.originalPrice,
        discount,
        currency: product.currency || (config.region === "in" ? "INR" : "USD"),
        images: JSON.stringify(product.imageUrl ? [product.imageUrl] : []),
        primaryImage: product.imageUrl || undefined,
        productUrl: product.productUrl,
        affiliateUrl,
        categoryId: dealCategoryId,
        status: "DRAFT",
        authorId: session.user.id,
        tags: JSON.stringify(["amazon", asin]),
      },
    });

    // Update category deal count
    await prisma.category.update({
      where: { id: dealCategoryId },
      data: { dealCount: { increment: 1 } },
    });

    // Update Amazon product to link to deal
    await prisma.amazonProduct.update({
      where: { asin },
      data: { dealId: deal.id },
    });

    // Log the import
    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "IMPORT",
        status: "SUCCESS",
        message: `Imported product ${asin} as deal ${deal.id}`,
      },
    });

    return NextResponse.json({
      success: true,
      deal: {
        id: deal.id,
        title: deal.title,
        slug: deal.slug,
        currentPrice: deal.currentPrice,
        originalPrice: deal.originalPrice,
        discount: deal.discount,
        affiliateUrl: deal.affiliateUrl,
        status: deal.status,
      },
      product: {
        asin: product.asin,
        title: product.title,
        imageUrl: product.imageUrl,
      },
      message: "Amazon product imported successfully as a deal",
    });
  } catch (error) {
    console.error("Amazon import error:", error);

    // Log the failed import
    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "IMPORT",
        status: "FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });

    if (error instanceof Error) {
      if (error.message.includes("No ApiKey")) {
        return NextResponse.json(
          { error: "Amazon API key is missing or invalid." },
          { status: 400 }
        );
      }
      if (error.message.includes("Access Denied")) {
        return NextResponse.json(
          { error: "Amazon PA-API access denied." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to import Amazon product" },
      { status: 500 }
    );
  }
}

// Helper function to get cached product
async function getCachedProduct(asin: string) {
  return prisma.amazonProduct.findUnique({
    where: { asin },
  });
}
