import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });

  if (!post) {
    return {
      title: "Blog Post Not Found",
      robots: { index: false },
    };
  }

  return {
    title: post.metaTitle || `${post.title} | BachatList`,
    description: post.metaDescription || post.excerpt || "Read this article on BachatList",
    keywords: post.metaKeywords || post.tags?.split(",") || [],
    authors: [{ name: post.authorName || "BachatList" }],
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    alternates: {
      canonical: `https://www.bachatlist.com/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-green-600 to-emerald-700">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-30"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-9xl opacity-20">📝</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            {post.category && (
              <Link
                href="/blog"
                className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 hover:bg-white/30 transition"
              >
                {post.category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/80">
              {post.authorName && (
                <span>By {post.authorName}</span>
              )}
              {post.publishedAt && (
                <>
                  <span>•</span>
                  <span>{new Date(post.publishedAt).toLocaleDateString("en-IN")}</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span>•</span>
                  <span>{post.readTime} min read</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {/* Tags */}
          {post.tags && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.split(",").map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-8 font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-green-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author */}
          {post.authorName && (
            <div className="mt-12 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                {post.authorImage ? (
                  <img
                    src={post.authorImage}
                    alt={post.authorName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-lg">
                      {post.authorName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{post.authorName}</p>
                  <p className="text-sm text-gray-500">Writer at BachatList</p>
                </div>
              </div>
            </div>
          )}
        </article>

        {/* Share */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Share this article</h3>
          <div className="flex gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://www.bachatlist.com/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Twitter
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://www.bachatlist.com/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(post.title + ' https://www.bachatlist.com/blog/' + slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-green-600 font-medium hover:underline"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
