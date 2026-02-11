import { NextRequest, NextResponse } from 'next/server';
import { runScheduledCuelinksSync } from '@/lib/automation';

// Cron secret from environment variables
const CRON_SECRET = process.env.CRON_SECRET;

// Cuelinks sync cron endpoint
// GET: For cron job execution (allows unauthenticated access for scheduled jobs)
// POST: For manual trigger (requires authorization)
export async function GET(request: NextRequest) {
  // GET requests are allowed for cron jobs (scheduled execution)
  // No authentication required for GET

  try {
    const result = await runScheduledCuelinksSync();
    
    if ('fetched' in result) {
      return NextResponse.json({
        success: result.success,
        stats: {
          fetched: result.fetched,
          imported: result.imported,
          updated: result.updated,
          expired: result.expired,
          failed: result.failed,
        },
      });
    }
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('Cuelinks cron sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST endpoint for manual trigger (requires authorization)
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runScheduledCuelinksSync();
    
    if ('fetched' in result) {
      return NextResponse.json({
        success: result.success,
        stats: {
          fetched: result.fetched,
          imported: result.imported,
          updated: result.updated,
          expired: result.expired,
          failed: result.failed,
        },
      });
    }
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    console.error('Cuelinks manual sync error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
