import { NextRequest, NextResponse } from 'next/server';
import { runScheduledPriceSync } from '@/lib/automation';
import { prisma } from '@/lib/prisma';

// Cron secret from environment variables
const CRON_SECRET = process.env.CRON_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run the scheduled price sync
    const result = await runScheduledPriceSync();

    // Log the cron execution
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cron',
        type: 'CRON',
        action: 'PRICE_SYNC',
        status: result.success === false ? 'FAILED' : 'SUCCESS',
        message: result.message || `Synced ${result.synced || 0} products, ${result.failed || 0} failed`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Price sync completed',
      result,
    });
  } catch (error) {
    console.error('Cron price sync error:', error);

    // Log the failed cron execution
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cron',
        type: 'CRON',
        action: 'PRICE_SYNC',
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to run price sync' },
      { status: 500 }
    );
  }
}
