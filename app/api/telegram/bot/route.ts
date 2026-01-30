import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { testBotConnection } from '@/lib/telegram';

// GET: List all bot configurations
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bots = await prisma.telegramBot.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        notifications: true
      }
    });

    return NextResponse.json(bots);
  } catch (error) {
    console.error('Error fetching Telegram bots:', error);
    return NextResponse.json({ error: 'Failed to fetch bots' }, { status: 500 });
  }
}

// POST: Create new bot configuration
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { botToken, webhookUrl, chatId, notifications } = body;

    if (!botToken) {
      return NextResponse.json({ error: 'Bot token is required' }, { status: 400 });
    }

    // Test bot connection
    const botTest = await testBotConnection(botToken);
    if (!botTest.ok) {
      return NextResponse.json({ error: 'Invalid bot token' }, { status: 400 });
    }

    const bot = await prisma.telegramBot.create({
      data: {
        botToken,
        webhookUrl: webhookUrl || null,
        chatId: chatId || null,
        isActive: true,
        notifications: notifications ? {
          create: notifications.map((n: { type: string; messageTemplate?: string; isEnabled?: boolean }) => ({
            type: n.type,
            messageTemplate: n.messageTemplate || null,
            isEnabled: n.isEnabled ?? true
          }))
        } : undefined
      },
      include: {
        notifications: true
      }
    });

    return NextResponse.json(bot, { status: 201 });
  } catch (error) {
    console.error('Error creating Telegram bot:', error);
    return NextResponse.json({ error: 'Failed to create bot' }, { status: 500 });
  }
}
