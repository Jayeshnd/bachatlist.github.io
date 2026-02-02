import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function isRateLimited(ip: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Reset if window has passed
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Increment count
  record.count++;

  // Check if limit exceeded
  if (record.count > maxAttempts) {
    return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Apply rate limiting (5 attempts per minute)
  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        error: "Too many login attempts. Please try again in 1 minute.",
      }),
      {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Forward to NextAuth handler
  return handlers.POST(req);
}
