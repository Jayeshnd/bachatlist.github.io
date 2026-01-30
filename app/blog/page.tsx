import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Default fallback categories
const defaultCategories = [
  { name: "All Posts", count: 24, active: true },
  { name: "Amazon Deals", count: 8, active: false },
  { name: "Flipkart Deals", count: 6, active: false },
  { name: "Shopping Guide", count: 5, active: false },
  { name: "Tech Reviews", count: 3, active: false },
  { name: "Money Saving", count: 2, active: false },
];

// Default fallback blog posts
const defaultPosts = [
  {
    id: "1",
    title: "Top 10 Amazon Deals Under ₹500 You Can't Miss",
    excerpt: "Discover amazing budget-friendly deals on Amazon that won't break the bank. From gadgets to essentials, we've curated the best picks for you.",
    authorName: "Rahul Sharma",
    publishedAt: new Date("2024-01-15").toISOString(),
    readTime: "5 min read",
    categoryName: "Amazon Deals",
    featuredImage: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    isFeatured: true,
  },
  {
    id: "2",
    title: "Flipkart Big Billion Days: Complete Shopping Guide",
    excerpt: "Everything you need to know about Flipkart's biggest sale event. Tips, tricks, and the best categories to shop from.",
    authorName: "Priya Singh",
    publishedAt: new Date("2024-01-12").toISOString(),
    readTime: "8 min read",
    categoryName: "Shopping Guide",
    featuredImage: "https://m.media-amazon.com/images/I/61Nr0k0jvOL._AC_UY327_FMwebp_QL65_.jpg",
    isFeatured: true,
  },
];

async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    // Transform data
    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || "",
      authorName: post.authorName || post.author?.name || "BachatList Team",
      publishedAt: post.publishedAt?.toISOString() || new Date().toISOString(),
      readTime: post.readTime ? `${post.readTime} min read` : "5 min read",
      categoryName: post.category?.name || "General",
      featuredImage: post.featuredImage || null,
      isFeatured: post.isFeatured,
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return defaultPosts;
  }
}

async function getCategories() {
  try {
    const categories = await prisma.blogCategory.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { order: "asc" },
    });

    const totalCount = await prisma.blogPost.count({
      where: { status: "PUBLISHED" },
    });

    return [
      { name: "All Posts", count: totalCount, active: true },
      ...categories.map((cat) => ({
        name: cat.name,
        count: cat._count.posts,
        active: false,
      })),
    ];
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return defaultCategories;
  }
}

export default async function BlogPage() {
  const [posts, categoriesData] = await Promise.all([
    getBlogPosts(),
    getCategories(),
  ]);

  const featuredPosts = posts.filter((post) => post.isFeatured);
  const regularPosts = posts.filter((post) => !post.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-white/20 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
            📚 Latest Articles
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">BachatList Blog</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Tips, tricks, and guides to help you save more on every purchase
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                        <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {post.categoryName}
                        </span>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">By {post.authorName}</span>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-green-600 font-medium hover:underline text-sm"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Latest Posts */}
            {regularPosts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
                <div className="space-y-6">
                  {regularPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col md:flex-row"
                    >
                      <div className="md:w-64 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                        {post.featuredImage ? (
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                            <span className="text-4xl">📝</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            {post.categoryName}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">
                                {post.authorName.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{post.authorName}</span>
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-green-600 font-medium hover:underline text-sm"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {posts.length === 0 && (
              <section className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Posts Yet</h3>
                <p className="text-gray-600 mb-4">Check back soon for new articles!</p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                >
                  ← Back to Home
                </Link>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-3">
                {categoriesData.map((category, index) => (
                  <li key={index}>
                    <button
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                        category.active
                          ? "bg-green-50 text-green-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        category.active ? "bg-green-100" : "bg-gray-100"
                      }`}>
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white sticky top-24">
              <h3 className="font-bold text-lg mb-2">📧 Stay Updated</h3>
              <p className="text-white/80 text-sm mb-4">Get the latest deals and tips delivered to your inbox</p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-2 rounded-lg text-gray-800 focus:outline-none mb-3"
              />
              <button className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Subscribe
              </button>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="font-bold text-gray-900 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {["Amazon", "Flipkart", "Coupons", "Cashback", "Deals", "Shopping", "Tech", "Fashion"].map((tag) => (
                  <Link
                    key={tag}
                    href="#"
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-green-100 hover:text-green-600 transition"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
