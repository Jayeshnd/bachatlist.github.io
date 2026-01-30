import { prisma } from '@/lib/prisma';

export async function sendTelegramMessage(botToken: string, chatId: string, message: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' })
  });
  return response.json();
}

export async function setWebhook(botToken: string, webhookUrl: string) {
  const url = `https://api.telegram.org/bot${botToken}/setWebhook`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: webhookUrl })
  });
  return response.json();
}

export async function testBotConnection(botToken: string) {
  const url = `https://api.telegram.org/bot${botToken}/getMe`;
  const response = await fetch(url);
  return response.json();
}

export async function logApiConnection(
  networkId: string,
  type: string,
  action: string,
  status: string,
  message?: string
) {
  await prisma.apiConnectionLog.create({
    data: {
      networkId,
      type,
      action,
      status,
      message
    }
  });
}
