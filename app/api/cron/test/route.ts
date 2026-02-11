import { NextRequest, NextResponse } from 'next/server';
import { runScheduledPriceSync, runScheduledNotifications, runScheduledCuelinksSync } from '@/lib/automation';
import { prisma } from '@/lib/prisma';

// Cron secret from environment variables
const CRON_SECRET = process.env.CRON_SECRET;

// Test endpoints for cron functionality
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action') || 'status';
  const authHeader = request.headers.get('authorization');

  // Allow testing without auth if no secret is configured
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    switch (action) {
      case 'status':
        // Return system status
        const amazonConfig = await prisma.amazonConfig.findFirst({ where: { isActive: true } });
        const telegramBots = await prisma.telegramBot.findMany({ where: { isActive: true } });
        const productCount = await prisma.amazonProduct.count({ where: { dealId: { not: null } } });
        const dealCount = await prisma.deal.count({ where: { isExpired: false } });

        return NextResponse.json({
          status: 'healthy',
          config: {
            amazon: amazonConfig ? { region: amazonConfig.region, hasKeys: true } : null,
            telegram: telegramBots.length > 0 ? { activeBots: telegramBots.length } : null,
          },
          stats: {
            linkedProducts: productCount,
            activeDeals: dealCount,
          },
        });

      case 'sync-prices':
        // Test price sync
        const syncResult = await runScheduledPriceSync();
        return NextResponse.json({
          action: 'sync-prices',
          result: syncResult,
        });

      case 'notifications':
        // Test notifications
        const notificationResult = await runScheduledNotifications();
        return NextResponse.json({
          action: 'notifications',
          result: notificationResult,
        });

      case 'cuelinks':
        // Test Cuelinks sync
        const cuelinksResult = await runScheduledCuelinksSync();
        return NextResponse.json({
          action: 'cuelinks',
          result: cuelinksResult,
        });

      case 'full':
        // Run all sync tasks
        const [fullSyncResult, fullNotificationResult, fullCuelinksResult] = await Promise.all([
          runScheduledPriceSync(),
          runScheduledNotifications(),
          runScheduledCuelinksSync(),
        ]);
        return NextResponse.json({
          action: 'full',
          priceSync: fullSyncResult,
          notifications: fullNotificationResult,
          cuelinks: fullCuelinksResult,
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cron test error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST endpoint for manual trigger (requires auth)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'sync-prices':
        const syncResult = await runScheduledPriceSync();
        return NextResponse.json({ result: syncResult });

      case 'notifications':
        const notificationResult = await runScheduledNotifications();
        return NextResponse.json({ result: notificationResult });

      case 'cuelinks':
        const cuelinksResult = await runScheduledCuelinksSync();
        return NextResponse.json({ result: cuelinksResult });

      case 'full':
        const [sync, notif, cuelinks] = await Promise.all([
          runScheduledPriceSync(),
          runScheduledNotifications(),
          runScheduledCuelinksSync(),
        ]);
        return NextResponse.json({ priceSync: sync, notifications: notif, cuelinks });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cron manual trigger error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
