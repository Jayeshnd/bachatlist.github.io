import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all stores
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 }
    );
  }
}

// POST create new store
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Get the highest position to append the new store
    const highestPosition = await prisma.store.findFirst({
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = highestPosition ? highestPosition.order + 1 : 0;

    const store = await prisma.store.create({
      data: {
        name: data.name,
        slug,
        icon: data.icon || null,
        logo: data.logo || null,
        color: data.color || null,
        order: newOrder,
        isActive: data.isActive !== false,
      },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error("Failed to create store:", error);
    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 }
    );
  }
}
