import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PagesTable } from "./PagesTable";

export default async function PagesPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const pages = await prisma.page.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  // Sanitize pages to remove Decimal objects and convert to plain objects
  const sanitizedPages = pages.map((page) => ({
    id: page.id,
    title: page.title,
    slug: page.slug,
    excerpt: page.excerpt,
    content: page.content,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    metaKeywords: page.metaKeywords,
    ogImage: page.ogImage,
    featuredImage: page.featuredImage,
    status: page.status,
    publishedAt: page.publishedAt?.toISOString() || null,
    order: page.order,
    template: page.template,
    authorId: page.authorId,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
    author: page.author,
  }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-1">Manage dynamic pages</p>
        </div>
        <Link
          href="/admin/pages/new"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg shadow-green-500/25"
        >
          ➕ New Page
        </Link>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">All Pages</h2>
        </div>

        {sanitizedPages.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No pages yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first page to get started
            </p>
            <Link
              href="/admin/pages/new"
              className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition"
            >
              Create Page
            </Link>
          </div>
        ) : (
          <PagesTable initialPages={sanitizedPages} />
        )}
      </div>
    </div>
  );
}
