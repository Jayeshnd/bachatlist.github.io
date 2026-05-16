import { NextRequest, NextResponse } from "next/server";
import { searchProducts, getProductDetails, generateAffiliateUrl, getActiveAmazonConfig } from "@/lib/amazon";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || "search";

    // Get Amazon config from database
    let config;
    try {
      config = await getActiveAmazonConfig();
    } catch (e) {
      return NextResponse.json(
        { error: "Amazon API not configured. Please set up Amazon credentials in admin." },
        { status: 500 }
      );
    }

    if (action === "search") {
      const keywords = searchParams.get("keywords");
      if (!keywords) {
        return NextResponse.json(
          { error: "keywords parameter required" },
          { status: 400 }
        );
      }

      const result = await searchProducts({
        keywords,
        region: config.region,
        accessKey: config.accessKey ?? "",
        secretKey: config.secretKey ?? "",
        associateTag: config.associateTag,
        category: searchParams.get("category") || undefined,
        page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
        sortBy: searchParams.get("sortBy") as any || "Relevance",
        minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
        maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      });

      return NextResponse.json(result);
    }

    if (action === "product") {
      const asin = searchParams.get("asin");
      if (!asin) {
        return NextResponse.json(
          { error: "asin parameter required" },
          { status: 400 }
        );
      }

      const product = await getProductDetails({
        asin,
        region: config.region,
        accessKey: config.accessKey ?? "",
        secretKey: config.secretKey ?? "",
        associateTag: config.associateTag,
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}. Use 'search' or 'product'.` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Amazon Affiliate API] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || "search";

    // Get Amazon config from database
    let config;
    try {
      config = await getActiveAmazonConfig();
    } catch (e) {
      return NextResponse.json(
        { error: "Amazon API not configured." },
        { status: 500 }
      );
    }

    if (action === "search") {
      if (!body.keywords) {
        return NextResponse.json(
          { error: "keywords required in body" },
          { status: 400 }
        );
      }

      const result = await searchProducts({
        keywords: body.keywords,
        region: config.region,
        accessKey: config.accessKey ?? "",
        secretKey: config.secretKey ?? "",
        associateTag: config.associateTag,
        category: body.category,
        page: body.page || 1,
        sortBy: body.sortBy || "Relevance",
        minPrice: body.minPrice,
        maxPrice: body.maxPrice,
      });

      return NextResponse.json(result);
    }

    if (action === "product") {
      if (!body.asin) {
        return NextResponse.json(
          { error: "asin required in body" },
          { status: 400 }
        );
      }

      const product = await getProductDetails({
        asin: body.asin,
        region: config.region,
        accessKey: config.accessKey ?? "",
        secretKey: config.secretKey ?? "",
        associateTag: config.associateTag,
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    if (action === "affiliateUrl") {
      if (!body.asin) {
        return NextResponse.json(
          { error: "asin required in body" },
          { status: 400 }
        );
      }

      const url = generateAffiliateUrl(body.asin, config.associateTag, config.region);
      return NextResponse.json({ url });
    }

    return NextResponse.json(
      { error: `Unknown action: ${action}.` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Amazon Affiliate API] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to process request", message: String(error) },
      { status: 500 }
    );
  }
}