import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@bachatlist.com' },
    update: {},
    create: {
      email: 'admin@bachatlist.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('✓ Created admin user:', admin.email);

  // Create default categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: '📱', color: '#667eea', order: 1 },
    { name: 'Fashion', slug: 'fashion', icon: '👕', color: '#f093fb', order: 2 },
    { name: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠', color: '#4facfe', order: 3 },
    { name: 'Beauty', slug: 'beauty', icon: '💄', color: '#43e97b', order: 4 },
    { name: 'Books', slug: 'books', icon: '📚', color: '#fa709a', order: 5 },
    { name: 'Sports', slug: 'sports', icon: '⚽', color: '#fee140', order: 6 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    console.log('✓ Created category:', category.name);
  }

  // Create blog categories
  const blogCategories = [
    { name: 'Amazon Deals', slug: 'amazon-deals', description: 'Latest deals and discounts on Amazon India', order: 1 },
    { name: 'Flipkart Deals', slug: 'flipkart-deals', description: 'Best Flipkart offers and sales', order: 2 },
    { name: 'Shopping Guide', slug: 'shopping-guide', description: 'Tips and tricks for smart shopping', order: 3 },
    { name: 'Tech Reviews', slug: 'tech-reviews', description: 'Honest reviews of tech products', order: 4 },
    { name: 'Money Saving', slug: 'money-saving', description: 'Ways to save money while shopping', order: 5 },
    { name: 'Seasonal Sales', slug: 'seasonal-sales', description: 'Biggest sale events and festivals', order: 6 },
  ];

  for (const cat of blogCategories) {
    await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    console.log('✓ Created blog category:', cat.name);
  }

  // Get the admin user ID for author reference
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@bachatlist.com' } });
  const authorId = adminUser?.id;

  // Create SEO-optimized blog posts
  const blogPosts = [
    {
      title: "Amazon Great Indian Festival 2025: Ultimate Shopping Guide",
      slug: "amazon-great-indian-festival-2025-guide",
      excerpt: "Everything you need to know about Amazon's biggest sale event in India. Tips, tricks, and the best categories to shop from.",
      content: `<h2>Amazon Great Indian Festival 2025: Complete Guide</h2>
<p>The Amazon Great Indian Festival is one of the biggest sale events in India, offering massive discounts across all categories. Here's your complete guide to maximizing savings.</p>
<h3>When Does the Sale Start?</h3>
<p>The sale typically starts in September-October and runs for several days. Prime members get early access.</p>
<h3>Top Categories to Shop</h3>
<ul>
<li>Electronics - Up to 80% off on smartphones, laptops, and accessories</li>
<li>Fashion - Great deals on clothing, shoes, and accessories</li>
<li>Home & Kitchen - Discounts on appliances and home essentials</li>
<li>Beauty - Up to 50% off on skincare and makeup</li>
</ul>
<h3>Money-Saving Tips</h3>
<p>1. Use coupon codes for extra discounts<br>
2. Apply bank offers for cashback<br>
3. Compare prices before buying<br>
4. Set up price alerts for products you want</p>
<h3>Don't Miss</h3>
<p>Look for Lightning Deals and Prime-exclusive discounts for the best savings.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
      categorySlug: "amazon-deals",
      tags: ["Amazon", "Sale", "Discounts", "Shopping", "India"],
      readTime: 8,
      isFeatured: true,
      metaTitle: "Amazon Great Indian Festival 2025: Ultimate Shopping Guide | BachatList",
      metaDescription: "Complete guide to Amazon Great Indian Festival 2025. Learn how to maximize savings with tips, tricks, and the best deals across all categories.",
      metaKeywords: "Amazon Great Indian Festival, Amazon sale, Amazon deals, shopping guide, discounts India",
    },
    {
      title: "Flipkart Big Billion Days 2025: Best Deals & Offers",
      slug: "flipkart-big-billion-days-2025-deals",
      excerpt: "Flipkart's biggest sale of the year is here. Find the best deals on electronics, fashion, and more with our comprehensive guide.",
      content: `<h2>Flipkart Big Billion Days 2025</h2>
<p>Flipkart's Big Billion Days is the most anticipated sale event in India. Here's how to make the most of it.</p>
<h3>Sale Highlights</h3>
<ul>
<li>Up to 80% off on electronics</li>
<li>Buy 1 Get 1 offers on fashion</li>
<li>No-cost EMI options</li>
<li>Exchange offers on old devices</li>
</ul>
<h3>Best Time to Shop</h3>
<p>Early access for Flipkart Plus members. Mid-sale often has additional discounts.</p>
<h3>Payment Offers</h3>
<p>Watch for HDFC, SBI, and ICICI bank offers for extra cashback.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=800&q=80",
      categorySlug: "flipkart-deals",
      tags: ["Flipkart", "Sale", "Big Billion Days", "Deals", "Offers"],
      readTime: 6,
      isFeatured: true,
      metaTitle: "Flipkart Big Billion Days 2025: Best Deals & Offers | BachatList",
      metaDescription: "Find the best deals during Flipkart Big Billion Days 2025. Comprehensive guide with top offers on electronics, fashion, and more.",
      metaKeywords: "Flipkart Big Billion Days, Flipkart sale, best deals, offers India",
    },
    {
      title: "10 Smart Shopping Tips to Save Money in 2025",
      slug: "smart-shopping-tips-save-money-2025",
      excerpt: "Learn proven strategies to save money while shopping online. From coupon codes to price tracking, these tips will help you become a smarter shopper.",
      content: `<h2>Smart Shopping Tips for Maximum Savings</h2>
<p>With these smart shopping strategies, you can save significantly on every purchase.</p>
<h3>1. Use Price Tracking Tools</h3>
<p>Set up price alerts on Amazon, Flipkart, and other sites to buy at the lowest price.</p>
<h3>2. Apply Coupon Codes</h3>
<p>Always check for available coupon codes before checkout. Sites like BachatList aggregate the best codes.</p>
<h3>3. Wait for Sales</h3>
<p>Major sales events like Diwali, Amazon Great Indian Festival, and Flipkart Big Billion Days offer the best discounts.</p>
<h3>4. Compare Prices</h3>
<p>Use price comparison tools to ensure you're getting the best deal.</p>
<h3>5. Use Cashback Apps</h3>
<p>Apps like Rakuten and Honey offer cashback on purchases.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1472851294608-4155471f8664?w=800&q=80",
      categorySlug: "money-saving",
      tags: ["Money Saving", "Shopping Tips", "Coupons", "Discounts"],
      readTime: 5,
      isFeatured: false,
      metaTitle: "10 Smart Shopping Tips to Save Money in 2025 | BachatList",
      metaDescription: "Learn proven strategies to save money while shopping online. From coupon codes to price tracking, become a smarter shopper today.",
      metaKeywords: "shopping tips, save money, coupon codes, price comparison, discounts",
    },
    {
      title: "Best Smartphones Under ₹15000 in 2025",
      slug: "best-smartphones-under-15000-2025",
      excerpt: "Looking for the best budget smartphones? We've compiled a comprehensive list of the top phones under ₹15000 with great features and deals.",
      content: `<h2>Best Budget Smartphones Under ₹15000</h2>
<p>Here are the top smartphones offering the best value for money in 2025.</p>
<h3>Top Picks</h3>
<ul>
<li><strong>Poco X6 Pro</strong> - Best overall value</li>
<li><strong>Realme 12 Pro</strong> - Great camera</li>
<li><strong>Samsung Galaxy M34</strong> - Brand reliability</li>
<li><strong>Redmi Note 13</strong> - All-rounder</li>
</ul>
<h3>What to Look For</h3>
<p>Processor, RAM, storage, camera quality, and battery life are key factors.</p>
<h3>Where to Buy</h3>
<p>Check Amazon and Flipkart for the best prices during sale events.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1592750475338-39e1006abc4c?w=800&q=80",
      categorySlug: "tech-reviews",
      tags: ["Smartphones", "Budget", "Tech", "Reviews", "Mobiles"],
      readTime: 7,
      isFeatured: false,
      metaTitle: "Best Smartphones Under ₹15000 in 2025 | BachatList",
      metaDescription: "Discover the best budget smartphones under ₹15000 in 2025. Compare features, prices, and find the perfect phone for your needs.",
      metaKeywords: "best smartphones under 15000, budget phones, mobile reviews, India",
    },
    {
      title: "How to Find the Best Coupon Codes for Any Store",
      slug: "how-to-find-best-coupon-codes",
      excerpt: "Struggling to find working coupon codes? Learn the best methods to discover discount codes for any online store.",
      content: `<h2>Finding the Best Coupon Codes</h2>
<p>Here's how to find working coupon codes every time you shop online.</p>
<h3>Best Ways to Find Coupons</h3>
<ul>
<li>Visit dedicated coupon sites like BachatList</li>
<li>Sign up for store newsletters</li>
<li>Follow stores on social media</li>
<li>Install browser extensions</li>
<li>Check deal forums and communities</li>
</ul>
<h3>Pro Tips</h3>
<p>1. Try multiple codes if one doesn't work<br>
2. Check expiration dates<br>
3. Look for site-wide codes<br>
4. Stack coupons when possible</p>`,
      featuredImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      categorySlug: "money-saving",
      tags: ["Coupons", "Discount Codes", "Shopping Tips", "Save Money"],
      readTime: 4,
      isFeatured: false,
      metaTitle: "How to Find the Best Coupon Codes for Any Store | BachatList",
      metaDescription: "Learn the best methods to discover working discount codes for any online store. Save money with these coupon finding tips.",
      metaKeywords: "coupon codes, discount codes, save money, online shopping, deals",
    },
    {
      title: "Diwali Sales 2025: Ultimate Shopping Checklist",
      slug: "diwali-sales-2025-shopping-checklist",
      excerpt: "Prepare for Diwali with our ultimate shopping checklist. Find the best deals on gifts, electronics, clothing, and more during the festive season.",
      content: `<h2>Diwali Shopping Checklist 2025</h2>
<p>Diwali is the biggest shopping season in India. Here's what to buy and when.</p>
<h3>Best Categories to Shop</h3>
<ul>
<li>Electronics - TVs, smartphones, appliances</li>
<li>Fashion - New clothes for the family</li>
<li>Home Decor - Diyas, rangoli, decorations</li>
<li>Gifts - For friends and family</li>
</ul>
<h3>Sale Timeline</h3>
<p>Pre-Diwali sales start 2 weeks before. Big days include Dussehra and the weekends before Diwali.</p>
<h3>Money-Saving Tips</h3>
<p>Compare prices, use bank offers, and apply coupons for maximum savings.</p>`,
      featuredImage: "https://images.unsplash.com/photo-1508503699449-c0a23821f4a3?w=800&q=80",
      categorySlug: "seasonal-sales",
      tags: ["Diwali", "Festival", "Sales", "Shopping", "India"],
      readTime: 6,
      isFeatured: true,
      metaTitle: "Diwali Sales 2025: Ultimate Shopping Checklist | BachatList",
      metaDescription: "Prepare for Diwali with our ultimate shopping checklist. Find the best deals on gifts, electronics, clothing and more.",
      metaKeywords: "Diwali sales 2025, Diwali shopping, festive offers, India shopping",
    },
  ];

  // Create blog posts
  for (const post of blogPosts) {
    // Find the category ID
    const category = await prisma.blogCategory.findUnique({
      where: { slug: post.categorySlug },
    });

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        categoryId: category?.id,
        tags: post.tags.join(", "),
        readTime: post.readTime,
        isFeatured: post.isFeatured,
        status: "PUBLISHED",
        publishedAt: new Date(),
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        metaKeywords: post.metaKeywords,
        authorId: authorId,
      },
    });
    console.log('✓ Created blog post:', post.title);
  }

  // Create default banners for homepage slider
  const banners = [
    {
      title: 'Big Savings on Electronics',
      subtitle: 'Up to 70% off on top brands',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80',
      link: '/category/electronics',
      isActive: true,
      order: 1,
    },
    {
      title: 'Fashion Sale',
      subtitle: 'Latest trends at unbeatable prices',
      imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80',
      link: '/category/fashion',
      isActive: true,
      order: 2,
    },
    {
      title: 'Home & Kitchen Essentials',
      subtitle: 'Make your home better',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
      link: '/category/home-kitchen',
      isActive: true,
      order: 3,
    },
  ];

  for (const banner of banners) {
    await prisma.banner.create({
      data: {
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        link: banner.link,
        isActive: banner.isActive,
        position: banner.order,
      },
    });
    console.log('✓ Created banner:', banner.title);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📝 Admin credentials:');
  console.log('   Email: admin@bachatlist.com');
  console.log('   Password: admin123');
  console.log('\n📚 Blog posts created:', blogPosts.length);
  console.log('   Categories:', blogCategories.length);
  console.log('\n⚠️  Please change the password after first login!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
