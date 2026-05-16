import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch Amazon API logs
    const logs = await prisma.apiConnectionLog.findMany({
      where: {
        type: 'AMAZON',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Calculate stats
    const totalCalls = logs.length;
    const successfulCalls = logs.filter(l => l.status === 'SUCCESS').length;
    const failedCalls = logs.filter(l => l.status === 'FAILED').length;
    const searches = logs.filter(l => l.action === 'SEARCH').length;
    const products = logs.filter(l => l.action === 'PRODUCT').length;

    // Calculate average response time from messages (format: "... (123ms)")
    let totalResponseTime = 0;
    let responseTimeCount = 0;
    
    logs.forEach(log => {
      const match = log.message?.match(/\((\d+)ms\)/);
      if (match) {
        totalResponseTime += parseInt(match[1]);
        responseTimeCount++;
      }
    });

    const avgResponseTime = responseTimeCount > 0 
      ? Math.round(totalResponseTime / responseTimeCount) 
      : 0;

    return NextResponse.json({
      logs,
      stats: {
        totalCalls,
        successfulCalls,
        failedCalls,
        searches,
        products,
        avgResponseTime,
      },
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics', message: String(error) },
      { status: 500 }
    );
  }
}