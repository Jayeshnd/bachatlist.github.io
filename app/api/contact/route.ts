import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET contact info
export async function GET(request: NextRequest) {
  try {
    // Try to get contact info from settings first
    let contactSettings = await prisma.setting.findUnique({
      where: { key: "contact_info" },
    });

    // If not found, return default structure
    if (!contactSettings) {
      return NextResponse.json({
        email: "",
        phone: "",
        address: "",
        workingHours: "",
        socialLinks: {},
        mapUrl: "",
      });
    }

    // Parse the JSON value
    const contactData = JSON.parse(contactSettings.value);
    return NextResponse.json(contactData);
  } catch (error) {
    console.error("Failed to fetch contact info:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact info" },
      { status: 500 }
    );
  }
}
