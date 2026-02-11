import { prisma } from './prisma';
import { syncAllAmazonPrices } from './amazon';
import { sendTelegramMessage } from './telegram';

const CUELINKS_API_BASE = "https://www.cuelinks.com/api/v2";
const CUELINKS_API_KEY = process.env.CUELINKS_API_KEY;

// Cuelinks sync function
export async function runScheduledCuelinksSync() {
  if (!CUELINKS_API_KEY) {
    return { success: false, message: 'Cuelinks API key not configured' };
  }

  try {
    const result = await syncCuelinksCampaigns();
    return {
      success: true,
      ...result
    };
  } catch (error) {
    console.error('Cuelinks sync failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function syncCuelinksCampaigns() {
  const result = {
    fetched: 0,
    imported: 0,
    updated: 0,
    expired: 0,
    failed: 0
  };

  // Get or create a system user for auto-imported deals
  let systemUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });
  
  if (!systemUser) {
    systemUser = await prisma.user.findFirst();
  }
  
  if (!systemUser) {
    throw new Error('No system user found for auto-imported deals');
  }

  try {
    // Fetch all campaigns from Cuelinks
    const url = `${CUELINKS_API_BASE}/campaigns.json?per_page=100&country_id=252`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${CUELINKS_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Cuelinks API error: ${response.status}`);
    }

    const data = await response.json();
    const campaigns = data.campaigns || [];
    result.fetched = campaigns.length;

    // Process each campaign
    for (const campaign of campaigns) {
      try {
        // Use fallback title
        const campaignTitle = campaign.title || campaign.campaign || `deal-${campaign.id}`;
        const campaignDesc = campaign.description || '';
        
        // Check if deal already exists by title or URL
        const existingDeal = await prisma.deal.findFirst({
          where: {
            OR: [
              { title: campaignTitle },
              { affiliateUrl: campaign.affiliate_url || campaign.url },
            ]
          }
        });

        const campaignEndDate = campaign.end_date 
          ? new Date(campaign.end_date) 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

        const isExpired = new Date() > campaignEndDate;

        if (existingDeal) {
          // Update existing deal
          await prisma.deal.update({
            where: { id: existingDeal.id },
            data: {
              description: campaignDesc,
              shortDesc: campaignDesc.substring(0, 200),
              productUrl: campaign.url,
              affiliateUrl: campaign.affiliate_url,
              coupon: campaign.coupon_code || null,
              isExpired: isExpired,
              status: isExpired ? 'ARCHIVED' : existingDeal.status,
            }
          });
          result.updated++;
        } else if (!isExpired) {
          // Import new deal (skip expired ones)
          // Get or create default category
          let defaultCategory = await prisma.category.findFirst({
            where: { slug: 'cuelinks' }
          });

          if (!defaultCategory) {
            defaultCategory = await prisma.category.create({
              data: {
                name: 'Cuelinks',
                slug: 'cuelinks',
                icon: '🔗',
              }
            });
          }

          // Skip campaigns without title
          const campaignTitle = campaign.title || campaign.campaign || `deal-${campaign.id}`;
          const campaignDesc = campaign.description || '';
          const slug = campaignTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

          await prisma.deal.create({
            data: {
              title: campaignTitle,
              slug: slug,
              description: campaignDesc,
              shortDesc: campaignDesc.substring(0, 200),
              currentPrice: 0,
              originalPrice: 0,
              productUrl: campaign.url,
              affiliateUrl: campaign.affiliate_url,
              coupon: campaign.coupon_code || null,
              status: 'PUBLISHED',
              categoryId: defaultCategory.id,
              isLoot: false,
              images: JSON.stringify(campaign.image_url ? [campaign.image_url] : []),
              authorId: systemUser.id,
            }
          });
          result.imported++;
        } else {
          result.expired++;
        }
      } catch (campaignError) {
        console.error(`Failed to process campaign: ${campaign.title}`, campaignError);
        result.failed++;
      }
    }

    // Log the sync
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cuelinks',
        type: 'CUELINKS',
        action: 'SYNC',
        status: result.failed === 0 ? 'SUCCESS' : 'PARTIAL',
        message: `Fetched: ${result.fetched}, Imported: ${result.imported}, Updated: ${result.updated}, Expired: ${result.expired}, Failed: ${result.failed}`,
      }
    });

    return result;
  } catch (error) {
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cuelinks',
        type: 'CUELINKS',
        action: 'SYNC',
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    });
    throw error;
  }
}

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
