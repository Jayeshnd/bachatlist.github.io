import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { testBotConnection } from '@/lib/telegram';

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET: Get bot by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const bot = await prisma.telegramBot.findUnique({
      where: { id },
      include: {
        notifications: true
      }
    });

    if (!bot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error fetching Telegram bot:', error);
    return NextResponse.json({ error: 'Failed to fetch bot' }, { status: 500 });
  }
}

// PUT: Update bot configuration
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { botToken, webhookUrl, chatId, isActive, notifications } = body;

    // Check if bot exists
    const existingBot = await prisma.telegramBot.findUnique({
      where: { id }
    });

    if (!existingBot) {
      return NextResponse.json({ error: 'Bot not found' }, { status: 404 });
    }

    // If botToken is provided, test connection
    if (botToken && botToken !== existingBot.botToken) {
      const botTest = await testBotConnection(botToken);
      if (!botTest.ok) {
        return NextResponse.json({ error: 'Invalid bot token' }, { status: 400 });
      }
    }

    // Delete existing notifications if updating
    if (notifications) {
      await prisma.telegramNotification.deleteMany({
        where: { botId: id }
      });
    }

    const bot = await prisma.telegramBot.update({
      where: { id },
      data: {
        botToken: botToken || existingBot.botToken,
        webhookUrl: webhookUrl ?? existingBot.webhookUrl,
        chatId: chatId ?? existingBot.chatId,
        isActive: isActive ?? existingBot.isActive,
        ...(notifications && {
          notifications: {
            create: notifications.map((n: { type: string; messageTemplate?: string; isEnabled?: boolean }) => ({
              type: n.type,
              messageTemplate: n.messageTemplate || null,
              isEnabled: n.isEnabled ?? true
            }))
          }
        })
      },
      include: {
        notifications: true
      }
    });

    return NextResponse.json(bot);
  } catch (error) {
    console.error('Error updating Telegram bot:', error);
    return NextResponse.json({ error: 'Failed to update bot' }, { status: 500 });
  }
}

// DELETE: Delete bot
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.telegramBot.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting Telegram bot:', error);
    return NextResponse.json({ error: 'Failed to delete bot' }, { status: 500 });
  }
}
