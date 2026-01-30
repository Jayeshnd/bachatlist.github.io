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

  // Create default affiliate networks
  const networks = [
    { name: 'Amazon Associates', slug: 'amazon', priority: 1, isActive: true },
    { name: 'Flipkart Affiliate', slug: 'flipkart', priority: 2, isActive: true },
    { name: 'Cuelink', slug: 'cuelink', type: 'aggregator', priority: 3, isActive: false },
  ];

  for (const network of networks) {
    await prisma.affiliateNetwork.upsert({
      where: { slug: network.slug },
      update: {},
      create: network,
    });
    console.log('✓ Created affiliate network:', network.name);
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
      data: banner,
    });
    console.log('✓ Created banner:', banner.title);
  }

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📝 Admin credentials:');
  console.log('   Email: admin@bachatlist.com');
  console.log('   Password: admin123');
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
