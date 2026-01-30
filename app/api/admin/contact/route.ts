import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET contact info
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

// PUT update contact info
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate that data is an object
    if (typeof data !== "object" || data === null) {
      return NextResponse.json(
        { error: "Invalid data format. Expected an object." },
        { status: 400 }
      );
    }

    // Build contact info object with defaults
    const contactInfo = {
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      workingHours: data.workingHours || "",
      socialLinks: data.socialLinks || {},
      mapUrl: data.mapUrl || "",
      // Additional fields
      facebook: data.facebook || "",
      twitter: data.twitter || "",
      instagram: data.instagram || "",
      youtube: data.youtube || "",
      linkedin: data.linkedin || "",
      telegram: data.telegram || "",
    };

    // Upsert the contact info in settings
    const contactSettings = await prisma.setting.upsert({
      where: { key: "contact_info" },
      update: {
        value: JSON.stringify(contactInfo),
        description: "Contact information settings",
      },
      create: {
        key: "contact_info",
        value: JSON.stringify(contactInfo),
        description: "Contact information settings",
      },
    });

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error("Failed to update contact info:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 }
    );
  }
}
