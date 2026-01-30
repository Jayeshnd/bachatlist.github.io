import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET about page content - returns all about sections
export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    // Also get team members and testimonials for the about page
    const teamMembers = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      sections,
      teamMembers,
      testimonials,
    });
  } catch (error) {
    console.error("Failed to fetch about content:", error);
    return NextResponse.json(
      { error: "Failed to fetch about content" },
      { status: 500 }
    );
  }
}
