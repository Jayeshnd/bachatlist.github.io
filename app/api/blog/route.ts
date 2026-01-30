import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");

    const where: any = { status: "PUBLISHED" };
    if (status) {
      where.status = status;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (isFeatured !== null) {
      where.isFeatured = isFeatured === "true";
    }

    const posts = await prisma.blogPost.findMany({
      where,
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
        _count: {
          select: {
            relatedPosts: true,
          },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
