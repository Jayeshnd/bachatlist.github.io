import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all published pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const template = searchParams.get("template");

    const where: any = { status: "PUBLISHED" };
    if (status) {
      where.status = status;
    }
    if (template) {
      where.template = template;
    }

    const pages = await prisma.page.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            sections: true,
          },
        },
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Failed to fetch pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}
