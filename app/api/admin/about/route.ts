import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET about content - returns all about sections
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = await prisma.aboutSection.findMany({
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

// PUT update about content - can update a specific section or bulk update
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // If sectionKey is provided, update a specific section
    if (data.sectionKey) {
      const { sectionKey, ...updateData } = data;

      // Map common field names to schema fields
      const sectionUpdateData: any = {};

      if (updateData.title !== undefined) {
        sectionUpdateData.title = updateData.title;
      }
      if (updateData.content !== undefined) {
        sectionUpdateData.content = updateData.content;
      }
      if (updateData.image !== undefined) {
        sectionUpdateData.image = updateData.image;
      }
      if (updateData.imagePosition !== undefined) {
        sectionUpdateData.imagePosition = updateData.imagePosition;
      }
      if (updateData.order !== undefined) {
        sectionUpdateData.order = updateData.order;
      }
      if (updateData.isActive !== undefined) {
        sectionUpdateData.isActive = updateData.isActive;
      }
      if (updateData.metaTitle !== undefined) {
        sectionUpdateData.metaTitle = updateData.metaTitle;
      }
      if (updateData.metaDescription !== undefined) {
        sectionUpdateData.metaDescription = updateData.metaDescription;
      }

      const section = await prisma.aboutSection.update({
        where: { sectionKey },
        data: sectionUpdateData,
      });

      return NextResponse.json(section);
    }

    // If bulk update is requested with sections array
    if (data.sections && Array.isArray(data.sections)) {
      const results = await Promise.all(
        data.sections.map((section: any) =>
          prisma.aboutSection.update({
            where: { sectionKey: section.sectionKey },
            data: {
              title: section.title,
              content: section.content,
              image: section.image,
              imagePosition: section.imagePosition,
              order: section.order,
              isActive: section.isActive,
            },
          })
        )
      );

      return NextResponse.json(results);
    }

    return NextResponse.json(
      { error: "Invalid request: provide sectionKey or sections array" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update about content:", error);
    return NextResponse.json(
      { error: "Failed to update about content" },
      { status: 500 }
    );
  }
}
