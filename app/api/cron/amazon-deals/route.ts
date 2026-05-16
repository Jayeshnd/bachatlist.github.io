import { NextRequest, NextResponse } from "next/server";
import { searchProducts, getActiveAmazonConfig } from "@/lib/amazon";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const CRON_SECRET = process.env.CRON_SECRET;

    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const config = await getActiveAmazonConfig();

    // Search for low-priced products today
    const result = await searchProducts({
      keywords: "deals",
      region: config.region,
      accessKey: config.accessKey || "",
      secretKey: config.secretKey || "",
      associateTag: config.associateTag || "",
      sortBy: "PriceLowToHigh",
      maxPrice: 500,
      page: 1,
    });

    const topDeals = result.items.slice(0, 5);

    if (topDeals.length === 0) {
      return NextResponse.json({ success: true, message: "No deals found today" });
    }

    // Get active Telegram bots
    const bots = await prisma.telegramBot.findMany({ where: { isActive: true } });

    let sentCount = 0;

    for (const deal of topDeals) {
      const message = `🔥 *Today's Low Price on Amazon*\n\n*${deal.title}*\n💰 ₹${deal.currentPrice}\n\n${deal.productUrl}`;

      for (const bot of bots) {
        if (!bot.chatId) continue;
        
        try {
          await sendTelegramMessage(bot.botToken, bot.chatId, message);
          sentCount++;
        } catch (e) {
          console.error("Failed to send Telegram message:", e);
        }
      }
    }

    // Log the cron execution
    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "CRON_DEALS",
        status: "SUCCESS",
        message: `Posted ${sentCount} Amazon deals to Telegram`,
      },
    });

    return NextResponse.json({
      success: true,
      posted: sentCount,
      deals: topDeals.length,
    });
  } catch (error) {
    console.error("Amazon cron error:", error);

    await prisma.apiConnectionLog.create({
      data: {
        networkId: "amazon",
        type: "AMAZON",
        action: "CRON_DEALS",
        status: "FAILED",
        message: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { error: "Failed to run Amazon deals cron" },
      { status: 500 }
    );
  }
}
