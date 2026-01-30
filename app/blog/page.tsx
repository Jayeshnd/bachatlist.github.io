import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Amazon Deals Under ₹500 You Can't Miss",
    excerpt: "Discover amazing budget-friendly deals on Amazon that won't break the bank. From gadgets to essentials, we've curated the best picks for you.",
    author: "Rahul Sharma",
    date: "2024-01-15",
    readTime: "5 min read",
    category: "Amazon Deals",
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Flipkart Big Billion Days: Complete Shopping Guide",
    excerpt: "Everything you need to know about Flipkart's biggest sale event. Tips, tricks, and the best categories to shop from.",
    author: "Priya Singh",
    date: "2024-01-12",
    readTime: "8 min read",
    category: "Shopping Guide",
    image: "https://m.media-amazon.com/images/I/61Nr0k0jvOL._AC_UY327_FMwebp_QL65_.jpg",
    featured: true,
  },
  {
    id: 3,
    title: "How to Get Maximum Cashback on Every Purchase",
    excerpt: "Master the art of cashback and maximize your savings. We cover all major apps and credit cards that offer the best returns.",
    author: "Amit Kumar",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Money Saving",
    image: "https://m.media-amazon.com/images/I/61QrVT-8rGL._AC_UY327_FMwebp_QL65_.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Best Power Banks Under ₹1000 in 2024",
    excerpt: "Never run out of battery with our top picks for budget power banks. We test and review the best options for every need.",
    author: "Vikram Patel",
    date: "2024-01-08",
    readTime: "7 min read",
    category: "Tech Reviews",
    image: "https://m.media-amazon.com/images/I/81Qq3V3E3JL._AC_UY327_FMwebp_QL65_.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "Myntra End of Season Sale: What's Worth Buying",
    excerpt: "Our expert picks from Myntra's EOS sale. From fashion to accessories, find out what represents the best value.",
    author: "Ananya Reddy",
    date: "2024-01-05",
    readTime: "4 min read",
    category: "Fashion",
    image: "https://m.media-amazon.com/images/I/61Nr0k0jvOL._AC_UY327_FMwebp_QL65_.jpg",
    featured: false,
  },
  {
    id: 6,
    title: "Couponing 101: Complete Beginner Guide",
    excerpt: "New to couponing? Start here! Learn the basics of finding, stacking, and maximizing discount coupons.",
    author: "Rahul Sharma",
    date: "2024-01-03",
    readTime: "10 min read",
    category: "Money Saving",
    image: "https://m.media-amazon.com/images/I/61QrVT-8rGL._AC_UY327_FMwebp_QL65_.jpg",
    featured: false,
  },
];

const categories = [
  { name: "All Posts", count: 24, active: true },
  { name: "Amazon Deals", count: 8, active: false },
  { name: "Flipkart Deals", count: 6, active: false },
  { name: "Shopping Guide", count: 5, active: false },
  { name: "Tech Reviews", count: 3, active: false },
  { name: "Money Saving", count: 2, active: false },
];

export default function BlogPage() {
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
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.filter(post => post.featured).map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">By {post.author}</span>
                        <Link
                          href={`/blog/${post.id}`}
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

            {/* Latest Posts */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Articles</h2>
              <div className="space-y-6">
                {blogPosts.filter(post => !post.featured).map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group flex flex-col md:flex-row"
                  >
                    <div className="md:w-64 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                          {post.category}
                        </span>
                        <span className="text-sm text-gray-500">{post.date}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 font-semibold text-sm">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-700">{post.author}</span>
                        </div>
                        <Link
                          href={`/blog/${post.id}`}
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
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/4">
            {/* Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
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
