import { prisma } from './prisma';
import { syncAllAmazonPrices } from './amazon';
import { sendTelegramMessage } from './telegram';

export async function runScheduledPriceSync() {
  const config = await prisma.amazonConfig.findFirst({ where: { isActive: true } });
  if (!config) {
    return { success: false, message: 'No active Amazon config' };
  }

  const result = await syncAllAmazonPrices();
  return {
    success: true,
    synced: result.success,
    failed: result.failed,
    priceChanges: result.priceChanges,
  };
}

export async function runScheduledNotifications() {
  // Send daily digest or pending notifications
  const bots = await prisma.telegramBot.findMany({ where: { isActive: true } });

  for (const bot of bots) {
    await sendNewDealNotification(bot.id);
  }

  return { success: true, botsNotified: bots.length, message: 'Notifications sent successfully' };
}

export async function sendNewDealNotification(botId: string) {
  // Get the bot configuration
  const bot = await prisma.telegramBot.findUnique({
    where: { id: botId },
    include: {
      notifications: {
        where: { type: 'NEW_DEAL', isEnabled: true },
      },
    },
  });

  if (!bot || !bot.chatId) {
    return { success: false, message: 'Bot not found or no chat ID configured' };
  }

  // Get recent deals (last 24 hours)
  const recentDeals = await prisma.deal.findMany({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      isExpired: false,
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (recentDeals.length === 0) {
    return { success: true, message: 'No new deals to notify' };
  }

  // Build notification message
  const notification = bot.notifications[0];
  const messageTemplate = notification?.messageTemplate ||
    '🔥 *New Deal Alert*\n\n*{title}*\n\n💰 *{price}* ({discount}% off)\n\n{shortDesc}\n\n{affiliateUrl}';

  let message = '📢 *Daily Deal Digest*\n\n';

  for (const deal of recentDeals) {
    const dealMessage = messageTemplate
      .replace('{title}', deal.title)
      .replace('{price}', deal.currentPrice ? `₹${deal.currentPrice}` : 'Check Price')
      .replace('{discount}', deal.discount ? `${deal.discount}%` : 'N/A')
      .replace('{shortDesc}', deal.shortDesc || deal.description || '')
      .replace('{affiliateUrl}', deal.affiliateUrl || deal.productUrl || '');

    message += dealMessage + '\n\n';
  }

  // Send to configured chat
  try {
    await sendTelegramMessage(bot.botToken, bot.chatId, message);

    // Log the notification
    await prisma.apiConnectionLog.create({
      data: {
        networkId: botId,
        type: 'TELEGRAM',
        action: 'NOTIFICATION',
        status: 'SUCCESS',
        message: `Sent ${recentDeals.length} deals to chat ${bot.chatId}`,
      },
    });

    return { success: true, dealsNotified: recentDeals.length };
  } catch (error) {
    console.error('Failed to send notification:', error);

    await prisma.apiConnectionLog.create({
      data: {
        networkId: botId,
        type: 'TELEGRAM',
        action: 'NOTIFICATION',
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return { success: false, message: 'Failed to send notification' };
  }
}

export async function sendPriceDropNotification(botId: string, dealId: string, oldPrice: number, newPrice: number) {
  const bot = await prisma.telegramBot.findUnique({
    where: { id: botId },
    include: {
      notifications: {
        where: { type: 'PRICE_DROP', isEnabled: true },
      },
    },
  });

  if (!bot || !bot.chatId) {
    return { success: false, message: 'Bot not found or no chat ID configured' };
  }

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { category: true },
  });

  if (!deal) {
    return { success: false, message: 'Deal not found' };
  }

  const notification = bot.notifications[0];
  const messageTemplate = notification?.messageTemplate ||
    '🔔 *Price Drop Alert*\n\n*{title}*\n\n💰 *{oldPrice}* → *{newPrice}*\n\n{shortDesc}\n\n{affiliateUrl}';

  const message = messageTemplate
    .replace('{title}', deal.title)
    .replace('{oldPrice}', `₹${oldPrice.toFixed(2)}`)
    .replace('{newPrice}', `₹${newPrice.toFixed(2)}`)
    .replace('{shortDesc}', deal.shortDesc || deal.description || '')
    .replace('{affiliateUrl}', deal.affiliateUrl || deal.productUrl || '');

  try {
    await sendTelegramMessage(bot.botToken, bot.chatId, message);
    return { success: true };
  } catch (error) {
    console.error('Failed to send price drop notification:', error);
    return { success: false, message: 'Failed to send notification' };
  }
}
