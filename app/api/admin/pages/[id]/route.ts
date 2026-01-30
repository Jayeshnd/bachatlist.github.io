import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

// GET a single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return NextResponse.json(
      { error: "Failed to fetch page" },
      { status: 500 }
    );
  }
}

// PUT update a page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Build update data dynamically
    const updateData: any = {};

    if (data.title !== undefined) {
      updateData.title = data.title;
      // Update slug if title changed and slug wasn't explicitly provided
      if (!data.slug) {
        updateData.slug = slugify(data.title);
      }
    }

    if (data.slug !== undefined) {
      // Check if new slug conflicts with another page
      if (data.slug !== existingPage.slug) {
        const slugExists = await prisma.page.findFirst({
          where: {
            slug: data.slug,
            NOT: { id },
          },
        });
        if (slugExists) {
          return NextResponse.json(
            { error: "A page with this slug already exists" },
            { status: 400 }
          );
        }
        updateData.slug = data.slug;
      }
    }

    if (data.excerpt !== undefined) {
      updateData.excerpt = data.excerpt;
    }

    if (data.content !== undefined) {
      updateData.content = data.content;
    }

    if (data.metaTitle !== undefined) {
      updateData.metaTitle = data.metaTitle;
    }

    if (data.metaDescription !== undefined) {
      updateData.metaDescription = data.metaDescription;
    }

    if (data.metaKeywords !== undefined) {
      updateData.metaKeywords = data.metaKeywords;
    }

    if (data.ogImage !== undefined) {
      updateData.ogImage = data.ogImage;
    }

    if (data.featuredImage !== undefined) {
      updateData.featuredImage = data.featuredImage;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
      // Set publishedAt if status is changing to PUBLISHED
      if (data.status === "PUBLISHED" && !existingPage.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    if (data.order !== undefined) {
      updateData.order = data.order;
    }

    if (data.template !== undefined) {
      updateData.template = data.template;
    }

    const page = await prisma.page.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        sections: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error("Failed to update page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}

// DELETE a page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if page exists
    const existingPage = await prisma.page.findUnique({
      where: { id },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Delete related sections first (should cascade but ensuring)
    await prisma.pageSection.deleteMany({
      where: { pageId: id },
    });

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Page deleted successfully" });
  } catch (error) {
    console.error("Failed to delete page:", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
