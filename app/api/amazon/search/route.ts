import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchProducts, generateAffiliateUrl } from "@/lib/amazon";
import { NextRequest, NextResponse } from "next/server";

// GET: Search Amazon products
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const keywords = searchParams.get("keywords");
    const category = searchParams.get("category") || undefined;
    const page = parseInt(searchParams.get("page") || "1");
    const sortBy = (searchParams.get("sortBy") as any) || "Relevance";
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;

    if (!keywords) {
      return NextResponse.json(
        { error: "Missing required parameter: keywords" },
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

    // Search Amazon
    const results = await searchProducts({
      keywords,
      region: config.region,
      accessKey: config.accessKey ?? '',
      secretKey: config.secretKey ?? '',
      associateTag: config.associateTag,
      category,
      page,
      sortBy,
      minPrice,
      maxPrice,
    });

    // Add affiliate links to results
    const productsWithAffiliate = results.items.map((product) => ({
      ...product,
      affiliateUrl: generateAffiliateUrl(product.asin, config.associateTag, config.region),
    }));

    return NextResponse.json({
      items: productsWithAffiliate,
      totalResults: results.totalResults,
      page: results.page,
      region: config.region,
    });
  } catch (error) {
    console.error("Amazon search error:", error);
    
    // Handle specific PA-API errors
    if (error instanceof Error) {
      if (error.message.includes("No ApiKey")) {
        return NextResponse.json(
          { error: "Amazon API key is missing or invalid. Please configure Amazon PA-API credentials." },
          { status: 400 }
        );
      }
      if (error.message.includes("Access Denied")) {
        return NextResponse.json(
          { error: "Amazon PA-API access denied. Please check your credentials and API access." },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to search Amazon products" },
      { status: 500 }
    );
  }
}

// POST: Search Amazon products (alternative to GET with body)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      keywords,
      category,
      page = 1,
      sortBy = "Relevance",
      minPrice,
      maxPrice,
    } = body;

    if (!keywords) {
      return NextResponse.json(
        { error: "Missing required field: keywords" },
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

    // Search Amazon
    const results = await searchProducts({
      keywords,
      region: config.region,
      accessKey: config.accessKey ?? '',
      secretKey: config.secretKey ?? '',
      associateTag: config.associateTag,
      category,
      page,
      sortBy,
      minPrice,
      maxPrice,
    });

    // Add affiliate links to results
    const productsWithAffiliate = results.items.map((product) => ({
      ...product,
      affiliateUrl: generateAffiliateUrl(product.asin, config.associateTag, config.region),
    }));

    return NextResponse.json({
      items: productsWithAffiliate,
      totalResults: results.totalResults,
      page: results.page,
      region: config.region,
    });
  } catch (error) {
    console.error("Amazon search error:", error);
    
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
      { error: "Failed to search Amazon products" },
      { status: 500 }
    );
  }
}
