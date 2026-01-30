import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendTelegramMessage } from '@/lib/telegram';

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat: { id: string };
    text?: string;
    entities?: Array<{ type: string; offset: number; length: number }>;
  };
  callback_query?: {
    chat: { id: string };
    data: string;
  };
};

// POST: Handle incoming Telegram updates
export async function POST(req: NextRequest) {
  try {
    const body: TelegramUpdate = await req.json();

    // Handle callback queries
    if (body.callback_query) {
      const { chat, data } = body.callback_query;
      // Handle callback data (e.g., deal notifications)
      console.log('Callback query received:', data);
      return NextResponse.json({ ok: true });
    }

    // Handle regular messages
    if (body.message) {
      const { chat, text } = body.message;

      if (!text) {
        return NextResponse.json({ ok: true });
      }

      // Get active bot configuration
      const botConfig = await prisma.telegramBot.findFirst({
        where: { isActive: true }
      });

      if (!botConfig) {
        return NextResponse.json({ ok: true });
      }

      const command = text.toLowerCase().split(' ')[0];

      switch (command) {
        case '/start':
          await sendTelegramMessage(
            botConfig.botToken,
            chat.id,
            'Welcome to BachatList! 🎉\n\nUse this bot to receive deal notifications, price drops, and daily digests.\n\nCommands:\n/start - Start the bot\n/help - Show help\n/deals - Get latest deals'
          );
          break;

        case '/help':
          await sendTelegramMessage(
            botConfig.botToken,
            chat.id,
            '📋 <b>BachatList Bot Commands</b>\n\n/start - Start the bot\n/help - Show this help message\n/deals - Get the latest deals\n\nYou will receive notifications when:\n• New deals are published\n• Prices drop on tracked products\n• Daily digest of best deals'
          );
          break;

        case '/deals':
          await sendTelegramMessage(
            botConfig.botToken,
            chat.id,
            '🔥 <b>Latest Deals</b>\n\nVisit our website to see the latest deals:\nhttps://bachatlist.com/deals'
          );
          break;

        default:
          // Unknown command
          await sendTelegramMessage(
            botConfig.botToken,
            chat.id,
            'Unknown command. Use /help to see available commands.'
          );
      }

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
