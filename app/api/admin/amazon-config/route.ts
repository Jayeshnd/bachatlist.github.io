import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const config = await prisma.amazonConfig.findFirst({
      where: { isActive: true },
    });

    if (!config) {
      return NextResponse.json(
        { error: "No active Amazon configuration found" },
        { status: 404 }
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch Amazon config", message: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { associateTag, accessKey, secretKey, region, marketplace } = body;

    // Deactivate existing configs
    await prisma.amazonConfig.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // Create new config
    const config = await prisma.amazonConfig.create({
      data: {
        associateTag,
        accessKey,
        secretKey,
        region: region || "in",
        marketplace: marketplace || "IN",
        isActive: true,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create Amazon config", message: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, associateTag, accessKey, secretKey, region, marketplace, isActive } = body;

    const config = await prisma.amazonConfig.update({
      where: { id },
      data: {
        associateTag,
        accessKey,
        secretKey,
        region,
        marketplace,
        isActive,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update Amazon config", message: String(error) },
      { status: 500 }
    );
  }
}