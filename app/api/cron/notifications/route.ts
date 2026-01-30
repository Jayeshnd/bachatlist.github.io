import { NextRequest, NextResponse } from 'next/server';
import { runScheduledNotifications } from '@/lib/automation';
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

    // Run the scheduled notifications
    const result = await runScheduledNotifications();

    // Log the cron execution
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cron',
        type: 'CRON',
        action: 'NOTIFICATIONS',
        status: result.success ? 'SUCCESS' : 'FAILED',
        message: result.message || `Notified ${result.botsNotified || 0} bots`,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Notifications sent',
      result,
    });
  } catch (error) {
    console.error('Cron notifications error:', error);

    // Log the failed cron execution
    await prisma.apiConnectionLog.create({
      data: {
        networkId: 'cron',
        type: 'CRON',
        action: 'NOTIFICATIONS',
        status: 'FAILED',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });

    return NextResponse.json(
      { error: 'Failed to run notifications' },
      { status: 500 }
    );
  }
}
