import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all banners
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const banners = await prisma.banner.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST create new banner
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.imageUrl) {
      return NextResponse.json(
        { error: "Banner image URL is required" },
        { status: 400 }
      );
    }

    // Get the highest position to append the new banner
    const highestPosition = await prisma.banner.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = highestPosition ? highestPosition.position + 1 : 0;

    const banner = await prisma.banner.create({
      data: {
        imageUrl: data.imageUrl,
        title: data.title || null,
        subtitle: data.subtitle || null,
        link: data.link || null,
        linkText: data.linkText || null,
        position: newPosition,
        isActive: data.isActive !== false,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        backgroundColor: data.backgroundColor || null,
        textColor: data.textColor || null,
        mobileImageUrl: data.mobileImageUrl || null,
      },
    });

    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Failed to create banner:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
