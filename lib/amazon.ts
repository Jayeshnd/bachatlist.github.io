import { prisma } from './prisma';

// Amazon Creators API Configuration
interface AmazonProduct {
  asin: string;
  title: string;
  description?: string;
  currentPrice?: number;
  originalPrice?: number;
  currency: string;
  imageUrl?: string;
  productUrl: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  category?: string;
}

interface AmazonSearchResult {
  items: AmazonProduct[];
  totalResults?: number;
  page?: number;
}

// Get active Amazon config - prefers environment variables (Vercel) over database
export async function getActiveAmazonConfig() {
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG;
  const accessKey = process.env.AMAZON_ACCESS_KEY;
  const secretKey = process.env.AMAZON_SECRET_KEY;

  // Prefer environment variables (set in Vercel)
  if (associateTag && accessKey && secretKey) {
    return {
      id: 'env',
      associateTag,
      accessKey,
      secretKey,
      region: process.env.AMAZON_REGION || 'in',
      marketplace: process.env.AMAZON_MARKETPLACE || 'IN',
      isActive: true,
    };
  }

  // Fallback to database
  const config = await prisma.amazonConfig.findFirst({
    where: { isActive: true },
  });

  if (!config) {
    throw new Error('No active Amazon configuration found');
  }

  return config;
}

// Generate affiliate URL using Creators API approach
export function generateAffiliateUrl(asin: string, associateTag: string, region: string): string {
  const baseUrl = region === 'in' ? 'https://www.amazon.in/dp' : 'https://www.amazon.com/dp';
  return `${baseUrl}/${asin}?tag=${associateTag}`;
}

// Simple product lookup using ASIN (no PA-API required)
export async function getProductByAsin(asin: string, config: any): Promise<AmazonProduct | null> {
  // For now, return basic product info since PA-API is unreachable
  // In production, this would call the Creators API
  const region = config.region || 'in';
  const baseUrl = region === 'in' ? 'https://www.amazon.in/dp' : 'https://www.amazon.com/dp';
  
  return {
    asin,
    title: `Amazon Product ${asin}`,
    currency: region === 'in' ? 'INR' : 'USD',
    productUrl: `${baseUrl}/${asin}`,
    imageUrl: undefined,
    currentPrice: undefined,
    originalPrice: undefined,
  };
}

// Search products - uses environment variables directly
export async function searchProducts(params: {
  keywords: string;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
  category?: string;
  page?: number;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<AmazonSearchResult> {
  // Note: Direct PA-API calls are currently failing on Vercel
  // This is a placeholder that returns empty results
  // Use ASIN import for reliable product addition
  
  console.warn('[Amazon] Search is currently unavailable due to network restrictions. Use ASIN import instead.');
  
  return {
    items: [],
    totalResults: 0,
    page: params.page || 1,
  };
}

// Get product details by ASIN
export async function getProductDetails(params: {
  asin: string;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
}): Promise<AmazonProduct | null> {
  const config = {
    region: params.region,
    associateTag: params.associateTag,
  };
  
  return getProductByAsin(params.asin, config);
}

// Get multiple products by ASINs
export async function getMultipleProducts(params: {
  asins: string[];
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
}): Promise<AmazonProduct[]> {
  const products: AmazonProduct[] = [];
  
  for (const asin of params.asins) {
    const product = await getProductDetails({
      asin,
      region: params.region,
      accessKey: params.accessKey,
      secretKey: params.secretKey,
      associateTag: params.associateTag,
    });
    
    if (product) {
      products.push(product);
    }
  }
  
  return products;
}

// Cache product in database
export async function cacheAmazonProduct(product: AmazonProduct, dealId?: string) {
  return prisma.amazonProduct.upsert({
    where: { asin: product.asin },
    update: {
      title: product.title,
      description: product.description,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      currency: product.currency,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      lastCheckedAt: new Date(),
      dealId,
    },
    create: {
      asin: product.asin,
      title: product.title,
      description: product.description,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      currency: product.currency,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      lastCheckedAt: new Date(),
      dealId,
    },
  });
}

// Get cached product by ASIN
export async function getCachedProduct(asin: string) {
  return prisma.amazonProduct.findUnique({
    where: { asin },
    include: { deal: true },
  });
}

// Sync all Amazon product prices
export async function syncAllAmazonPrices() {
  const config = await getActiveAmazonConfig();

  const products = await prisma.amazonProduct.findMany({
    where: { dealId: { not: null } },
  });

  const results = {
    success: 0,
    failed: 0,
    priceChanges: 0,
    products: [] as Array<{ asin: string; oldPrice?: number; newPrice?: number }>,
  };

  for (const product of products) {
    try {
      const freshProduct = await getProductDetails({
        asin: product.asin,
        region: config.region,
        accessKey: config.accessKey || '',
        secretKey: config.secretKey || '',
        associateTag: config.associateTag || '',
      });

      if (freshProduct && freshProduct.currentPrice) {
        const oldPrice = product.currentPrice ? parseFloat(product.currentPrice.toString()) : undefined;
        const newPrice = freshProduct.currentPrice;

        // Update cache
        await cacheAmazonProduct(freshProduct, product.dealId || undefined);

        if (oldPrice !== newPrice) {
          results.priceChanges++;
          results.products.push({
            asin: product.asin,
            oldPrice,
            newPrice,
          });
        }

        results.success++;
      }
    } catch (error) {
      console.error(`Failed to sync price for ${product.asin}:`, error);
      results.failed++;
    }
  }

  // Log the sync
  await prisma.apiConnectionLog.create({
    data: {
      networkId: 'amazon',
      type: 'AMAZON',
      action: 'SYNC',
      status: results.failed === 0 ? 'SUCCESS' : 'PARTIAL',
      message: `Synced ${results.success} products, ${results.failed} failed, ${results.priceChanges} price changes`,
    },
  });

  return results;
}

// Export types for use in routes
export type { AmazonProduct, AmazonSearchResult };
