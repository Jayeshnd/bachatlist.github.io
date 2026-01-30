import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

// GET a single blog post
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

    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        relatedPosts: {
          include: {
            relatedPost: {
              select: {
                id: true,
                title: true,
                slug: true,
                featuredImage: true,
                excerpt: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT update a blog post
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
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
      // Check if new slug conflicts with another post
      if (data.slug !== existingPost.slug) {
        const slugExists = await prisma.blogPost.findFirst({
          where: {
            slug: data.slug,
            NOT: { id },
          },
        });
        if (slugExists) {
          return NextResponse.json(
            { error: "A blog post with this slug already exists" },
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

    if (data.featuredImage !== undefined) {
      updateData.featuredImage = data.featuredImage;
    }

    if (data.images !== undefined) {
      updateData.images = Array.isArray(data.images)
        ? JSON.stringify(data.images)
        : data.images;
    }

    if (data.categoryId !== undefined) {
      updateData.categoryId = data.categoryId || null;
    }

    if (data.tags !== undefined) {
      updateData.tags = Array.isArray(data.tags)
        ? JSON.stringify(data.tags)
        : data.tags;
    }

    if (data.authorName !== undefined) {
      updateData.authorName = data.authorName;
    }

    if (data.authorImage !== undefined) {
      updateData.authorImage = data.authorImage;
    }

    if (data.readTime !== undefined) {
      updateData.readTime = data.readTime;
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

    if (data.status !== undefined) {
      updateData.status = data.status;
      // Set publishedAt if status is changing to PUBLISHED
      if (data.status === "PUBLISHED" && !existingPost.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    if (data.isFeatured !== undefined) {
      updateData.isFeatured = data.isFeatured;
    }

    if (data.isSticky !== undefined) {
      updateData.isSticky = data.isSticky;
    }

    if (data.scheduledAt !== undefined) {
      updateData.scheduledAt = data.scheduledAt;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE a blog post
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

    // Check if post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
    }

    // Delete related records first
    await prisma.blogPostRelated.deleteMany({
      where: {
        OR: [{ mainPostId: id }, { relatedPostId: id }],
      },
    });

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
