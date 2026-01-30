import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BlogPostsTable } from "./BlogPostsTable";

export default async function BlogPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
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

  // Sanitize posts to remove Decimal objects and convert to plain objects
  const sanitizedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featuredImage: post.featuredImage,
    images: post.images,
    categoryId: post.categoryId,
    category: post.category,
    tags: post.tags,
    authorName: post.authorName,
    authorImage: post.authorImage,
    readTime: post.readTime,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    metaKeywords: post.metaKeywords,
    ogImage: post.ogImage,
    status: post.status,
    isFeatured: post.isFeatured,
    isSticky: post.isSticky,
    publishedAt: post.publishedAt?.toISOString() || null,
    scheduledAt: post.scheduledAt?.toISOString() || null,
    views: post.views,
    authorId: post.authorId,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author,
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage blog articles</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Blog Post
        </Link>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Blog Posts</h2>
        </div>

        {sanitizedPosts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first blog post to get started
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Blog Post
            </Link>
          </div>
        ) : (
          <BlogPostsTable initialPosts={sanitizedPosts} />
        )}
      </div>
    </div>
  );
}
