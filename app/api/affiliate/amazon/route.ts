import { NextRequest, NextResponse } from "next/server";
import { searchProducts, getProductDetails, generateAffiliateUrl, getActiveAmazonConfig } from "@/lib/amazon";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "search";
  let status = "SUCCESS";
  let message = "";

  try {
    // Get Amazon config from database
    let config;
    try {
      config = await getActiveAmazonConfig();
    } catch (e) {
      status = "FAILED";
      message = "Amazon API not configured";
      await logAmazonCall(action, status, message, Date.now() - startTime);
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
        accessKey: config.accessKey || "",
        secretKey: config.secretKey || "",
        associateTag: config.associateTag || "",
        category: searchParams.get("category") || undefined,
        page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
        sortBy: searchParams.get("sortBy") as any || "Relevance",
        minPrice: searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined,
        maxPrice: searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined,
      });

      message = `Searched for "${keywords}", found ${result.items.length} items`;
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json(result);
    }

    if (action === "product") {
      const asin = searchParams.get("asin");
      if (!asin) {
        status = "FAILED";
        message = "asin parameter required";
        await logAmazonCall(action, status, message, Date.now() - startTime);
        return NextResponse.json(
          { error: "asin parameter required" },
          { status: 400 }
        );
      }

      const product = await getProductDetails({
        asin,
        region: config.region,
        accessKey: config.accessKey || "",
        secretKey: config.secretKey || "",
        associateTag: config.associateTag || "",
      });

      if (!product) {
        status = "FAILED";
        message = `Product not found: ${asin}`;
        await logAmazonCall(action, status, message, Date.now() - startTime);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      message = `Retrieved product ${asin}`;
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json(product);
    }

    status = "FAILED";
    message = `Unknown action: ${action}`;
    await logAmazonCall(action, status, message, Date.now() - startTime);
    return NextResponse.json(
      { error: `Unknown action: ${action}. Use 'search' or 'product'.` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Amazon Affiliate API] Error:", error);
    status = "FAILED";
    message = String(error);
    await logAmazonCall(action, status, message, Date.now() - startTime);
    return NextResponse.json(
      { error: "Failed to fetch data", message: String(error) },
      { status: 500 }
    );
  }
}

// Helper to log Amazon API calls
async function logAmazonCall(action: string, status: string, message: string, duration: number) {
  try {
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'amazon',
        type: 'AMAZON',
        action: action.toUpperCase(),
        status,
        message: `${message} (${duration}ms)`,
      },
    });
  } catch (e) {
    console.error('Failed to log Amazon call:', e);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let status = "SUCCESS";
  let message = "";
  const body = await request.json();
  const action = body.action || "search";

  try {
    // Get Amazon config from database
    let config;
    try {
      config = await getActiveAmazonConfig();
    } catch (e) {
      status = "FAILED";
      message = "Amazon API not configured";
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json(
        { error: "Amazon API not configured." },
        { status: 500 }
      );
    }

    if (action === "search") {
      if (!body.keywords) {
        status = "FAILED";
        message = "keywords required in body";
        await logAmazonCall(action, status, message, Date.now() - startTime);
        return NextResponse.json(
          { error: "keywords required in body" },
          { status: 400 }
        );
      }

      const result = await searchProducts({
        keywords: body.keywords,
        region: config.region,
        accessKey: config.accessKey || "",
        secretKey: config.secretKey || "",
        associateTag: config.associateTag || "",
        category: body.category,
        page: body.page || 1,
        sortBy: body.sortBy || "Relevance",
        minPrice: body.minPrice,
        maxPrice: body.maxPrice,
      });

      message = `Searched for "${body.keywords}", found ${result.items.length} items`;
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json(result);
    }

    if (action === "product") {
      if (!body.asin) {
        status = "FAILED";
        message = "asin required in body";
        await logAmazonCall(action, status, message, Date.now() - startTime);
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
        associateTag: config.associateTag || "",
      });

      if (!product) {
        status = "FAILED";
        message = `Product not found: ${body.asin}`;
        await logAmazonCall(action, status, message, Date.now() - startTime);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      message = `Retrieved product ${body.asin}`;
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json(product);
    }

    if (action === "affiliateUrl") {
      if (!body.asin) {
        status = "FAILED";
        message = "asin required in body";
        await logAmazonCall(action, status, message, Date.now() - startTime);
        return NextResponse.json(
          { error: "asin required in body" },
          { status: 400 }
        );
      }

      const url = generateAffiliateUrl(body.asin, config.associateTag || "", config.region);
      message = `Generated affiliate URL for ${body.asin}`;
      await logAmazonCall(action, status, message, Date.now() - startTime);
      return NextResponse.json({ url });
    }

    status = "FAILED";
    message = `Unknown action: ${action}`;
    await logAmazonCall(action, status, message, Date.now() - startTime);
    return NextResponse.json(
      { error: `Unknown action: ${action}.` },
      { status: 400 }
    );
  } catch (error) {
    console.error("[Amazon Affiliate API] POST Error:", error);
    status = "FAILED";
    message = String(error);
    await logAmazonCall(action, status, message, Date.now() - startTime);
    return NextResponse.json(
      { error: "Failed to process request", message: String(error) },
      { status: 500 }
    );
  }
}