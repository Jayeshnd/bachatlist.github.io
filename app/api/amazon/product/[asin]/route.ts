import { serializeDecimal } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductDetails, generateAffiliateUrl, getCachedProduct, cacheAmazonProduct } from "@/lib/amazon";
import { NextRequest, NextResponse } from "next/server";

// GET: Get product details by ASIN
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ asin: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { asin } = await params;

    if (!asin) {
      return NextResponse.json(
        { error: "Missing ASIN parameter" },
        { status: 400 }
      );
    }

    // Check cache first
    const cachedProduct = await getCachedProduct(asin);

    if (cachedProduct) {
      // Get config for affiliate link
      const config = await prisma.amazonConfig.findFirst({
        where: { isActive: true },
      });

      const affiliateUrl = config
        ? generateAffiliateUrl(asin, config.associateTag, config.region)
        : undefined;

      return NextResponse.json(serializeDecimal({
        cached: true,
        asin: cachedProduct.asin,
        title: cachedProduct.title,
        description: cachedProduct.description,
        currentPrice: cachedProduct.currentPrice,
        originalPrice: cachedProduct.originalPrice,
        currency: cachedProduct.currency,
        imageUrl: cachedProduct.imageUrl,
        productUrl: cachedProduct.productUrl,
        affiliateUrl,
        lastCheckedAt: cachedProduct.lastCheckedAt,
        dealId: cachedProduct.dealId,
      }));
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

    // Validate required config fields
    if (!config.accessKey || !config.secretKey || !config.associateTag) {
      return NextResponse.json(
        { error: "Amazon API credentials are incomplete" },
        { status: 400 }
      );
    }

    // Fetch from Amazon
    const product = await getProductDetails({
      asin,
      region: config.region,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      associateTag: config.associateTag,
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Cache the product
    await cacheAmazonProduct(product);

    return NextResponse.json(serializeDecimal({
      cached: false,
      ...product,
      affiliateUrl: generateAffiliateUrl(asin, config.associateTag, config.region),
    }));
  } catch (error) {
    console.error("Amazon get product error:", error);
    
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
      if (error.message.includes("InvalidParameterValue")) {
        return NextResponse.json(
          { error: "Invalid ASIN or parameters." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to get product details" },
      { status: 500 }
    );
  }
}
