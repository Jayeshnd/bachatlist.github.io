import { NextRequest, NextResponse } from "next/server";
import { getProductDetails, generateAffiliateUrl, getActiveAmazonConfig } from "@/lib/amazon";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const { asin, categorySlug = "amazon", notify = true } = await request.json();

    if (!asin) {
      return NextResponse.json({ error: "ASIN is required" }, { status: 400 });
    }

    const config = await getActiveAmazonConfig();
    
    const product = await getProductDetails({
      asin,
      region: config.region,
      accessKey: config.accessKey ?? "",
      secretKey: config.secretKey ?? "",
      associateTag: config.associateTag,
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found on Amazon" }, { status: 404 });
    }

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

    const affiliateUrl = generateAffiliateUrl(asin, config.associateTag, config.region);

    // Get a system user for the deal
    let author = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (!author) {
      author = await prisma.user.findFirst();
    }
    if (!author) {
      return NextResponse.json({ error: "No user found to assign as author" }, { status: 500 });
    }

    // Create the deal
    const deal = await prisma.deal.create({
      data: {
        title: product.title,
        slug: product.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60),
        description: product.description || "",
        shortDesc: product.description?.substring(0, 180) || "",
        currentPrice: product.currentPrice || 0,
        originalPrice: product.originalPrice || product.currentPrice || 0,
        discount: product.originalPrice && product.currentPrice
          ? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)
          : 0,
        productUrl: product.productUrl,
        affiliateUrl,
        images: product.imageUrl ? JSON.stringify([product.imageUrl]) : "[]",
        status: "PUBLISHED",
        categoryId: category.id,
        isLoot: false,
        authorId: author.id,
      },
    });

    // Send to Telegram if notify is true
    if (notify) {
      const bots = await prisma.telegramBot.findMany({ where: { isActive: true } });
      
      for (const bot of bots) {
        if (!bot.chatId) continue;
        
        const message = `🛒 *New Amazon Deal*\n\n*${product.title}*\n💰 ₹${product.currentPrice}\n\n${affiliateUrl}`;
        
        try {
          await sendTelegramMessage(bot.botToken, bot.chatId, message);
        } catch (e) {
          console.error("Failed to send Telegram notification:", e);
        }
      }
    }

    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error("Amazon import error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import from Amazon" },
      { status: 500 }
    );
  }
}
