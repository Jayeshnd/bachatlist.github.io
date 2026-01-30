import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendTelegramMessage, logApiConnection } from '@/lib/telegram';

// POST: Send message through configured bot
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message, chatId, notificationType } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Find active bot configuration
    const botConfig = await prisma.telegramBot.findFirst({
      where: { isActive: true },
      include: {
        notifications: true
      }
    });

    if (!botConfig) {
      await logApiConnection('telegram', 'TELEGRAM', 'SEND', 'FAILED', 'No active bot configuration found');
      return NextResponse.json({ error: 'No active bot configuration' }, { status: 400 });
    }

    // Use provided chatId or fall back to configured chatId
    const targetChatId = chatId || botConfig.chatId;
    if (!targetChatId) {
      await logApiConnection(botConfig.id, 'TELEGRAM', 'SEND', 'FAILED', 'No chat ID configured');
      return NextResponse.json({ error: 'No chat ID configured' }, { status: 400 });
    }

    // Send message
    const result = await sendTelegramMessage(botConfig.botToken, targetChatId, message);

    if (result.ok) {
      await logApiConnection(botConfig.id, 'TELEGRAM', 'SEND', 'SUCCESS', 'Message sent successfully');
      return NextResponse.json({ success: true, result });
    } else {
      await logApiConnection(botConfig.id, 'TELEGRAM', 'SEND', 'FAILED', result.description || 'Unknown error');
      return NextResponse.json({ error: result.description || 'Failed to send message' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
