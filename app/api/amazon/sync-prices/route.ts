import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getProductDetails, generateAffiliateUrl, getActiveAmazonConfig, cacheAmazonProduct } from "@/lib/amazon";
import { NextRequest, NextResponse } from "next/server";

// POST: Sync prices for all Amazon products
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admin can sync prices
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get active Amazon config
    const config = await getActiveAmazonConfig();

    // Get all Amazon products that are linked to deals
    const products = await prisma.amazonProduct.findMany({
      where: { dealId: { not: null } },
      include: { deal: true },
    });

    if (products.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No Amazon products to sync",
        results: {
          success: 0,
          failed: 0,
          priceChanges: 0,
          products: [],
        },
      });
    }

    const results = {
      success: 0,
      failed: 0,
      priceChanges: 0,
      products: [] as Array<{
        asin: string;
        title: string;
        oldPrice: number | null;
        newPrice: number | null;
        dealId: string;
        dealTitle: string;
      }>,
    };

    // Sync each product
    for (const product of products) {
      try {
        // Fetch fresh product details from Amazon
        const freshProduct = await getProductDetails({
          asin: product.asin,
          region: config.region,
          accessKey: config.accessKey,
          secretKey: config.secretKey,
          associateTag: config.associateTag,
        });

        if (freshProduct && freshProduct.currentPrice) {
          const oldPrice = product.currentPrice
            ? parseFloat(product.currentPrice.toString())
            : null;
          const newPrice = freshProduct.currentPrice;

          // Update the Amazon product cache
          await cacheAmazonProduct(freshProduct, product.dealId || undefined);

          // Update the associated deal price
          if (product.dealId) {
            await prisma.deal.update({
              where: { id: product.dealId },
              data: {
                currentPrice: newPrice,
              },
            });

            // Calculate new discount
            if (product.originalPrice) {
              const originalPrice = parseFloat(product.originalPrice.toString());
              const newDiscount = Math.round(((originalPrice - newPrice) / originalPrice) * 100);

              await prisma.deal.update({
                where: { id: product.dealId },
                data: { discount: newDiscount },
              });
            }

            // Check for price drop and log
            if (oldPrice && newPrice < oldPrice) {
              results.priceChanges++;

              // Update deal as not expired if it was
              await prisma.deal.update({
                where: { id: product.dealId },
                data: { isExpired: false },
              });
            }

            results.products.push({
              asin: product.asin,
              title: product.title,
              oldPrice,
              newPrice,
              dealId: product.dealId,
              dealTitle: product.deal?.title || "",
            });
          }

          results.success++;
        } else {
          results.failed++;
        }
      } catch (error) {
        console.error(`Failed to sync price for ${product.asin}:`, error);
        results.failed++;
      }
    }

    // Log the sync operation
    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "SYNC",
        status: results.failed === 0 ? "SUCCESS" : "PARTIAL",
        message: `Synced ${results.success} products, ${results.failed} failed, ${results.priceChanges} price drops detected`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Price sync completed: ${results.success} synced, ${results.failed} failed, ${results.priceChanges} price changes`,
      results,
    });
  } catch (error) {
    console.error("Amazon price sync error:", error);

    // Log the failed sync
    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "SYNC",
        status: "FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });

    if (error instanceof Error) {
      if (error.message.includes("No active Amazon configuration")) {
        return NextResponse.json(
          { error: "No active Amazon configuration found" },
          { status: 400 }
        );
      }
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
      { error: "Failed to sync Amazon prices" },
      { status: 500 }
    );
  }
}

// GET: Get sync status and last sync info
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last sync log
    const lastSync = await prisma.apiConnectionLog.findFirst({
      where: {
        networkId: "amazon",
        action: "SYNC",
      },
      orderBy: { createdAt: "desc" },
    });

    // Get count of Amazon products with deals
    const productCount = await prisma.amazonProduct.count({
      where: { dealId: { not: null } },
    });

    // Get count of products with potential price drops (simplified check)
    const recentlyUpdated = await prisma.amazonProduct.count({
      where: {
        dealId: { not: null },
        lastCheckedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    return NextResponse.json({
      lastSync: lastSync
        ? {
            status: lastSync.status,
            message: lastSync.message,
            createdAt: lastSync.createdAt,
          }
        : null,
      stats: {
        totalLinkedProducts: productCount,
        recentlyChecked: recentlyUpdated,
      },
    });
  } catch (error) {
    console.error("Error fetching sync status:", error);
    return NextResponse.json(
      { error: "Failed to fetch sync status" },
      { status: 500 }
    );
  }
}
