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

interface CreatorsConfig {
  clientId: string;
  clientSecret: string;
  version: string;
  associateTag: string;
  region: string;
  marketplace: string;
}

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

// Get Creators API config from environment variables
export async function getCreatorsConfig(): Promise<CreatorsConfig> {
  const clientId = process.env.AMAZON_CLIENT_ID;
  const clientSecret = process.env.AMAZON_CLIENT_SECRET;
  const version = process.env.AMAZON_CREDENTIAL_VERSION || '2.2';
  const associateTag = process.env.AMAZON_ASSOCIATE_TAG;
  const region = process.env.AMAZON_REGION || 'in';
  const marketplace = process.env.AMAZON_MARKETPLACE || 'IN';

  if (!clientId || !clientSecret || !associateTag) {
    throw new Error('Amazon Creators API credentials not configured. Please set AMAZON_CLIENT_ID, AMAZON_CLIENT_SECRET, and AMAZON_ASSOCIATE_TAG in environment variables.');
  }

  return {
    clientId,
    clientSecret,
    version,
    associateTag,
    region,
    marketplace,
  };
}

// Get OAuth access token from Amazon Cognito
async function getAccessToken(config: CreatorsConfig): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Determine token endpoint based on version
  let tokenEndpoint: string;
  if (config.version.startsWith('3.')) {
    // v3.x uses Login with Amazon
    tokenEndpoint = 'https://api.amazon.com/auth/o2/token';
  } else {
    // v2.x uses Cognito (EU region for India)
    tokenEndpoint = 'https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token';
  }

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: 'creatorsapi/default',
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const token = data.access_token;
    const expiresIn = data.expires_in || 3600;

    // Cache token (expire 5 minutes before actual expiry)
    cachedToken = {
      token,
      expiresAt: Date.now() + (expiresIn - 300) * 1000,
    };

    return token;
  } catch (error) {
    console.error('Creators API token fetch error:', error);
    throw new Error('Failed to authenticate with Amazon Creators API');
  }
}

// Get active Amazon config (for backward compatibility)
export async function getActiveAmazonConfig() {
  const config = await getCreatorsConfig();
  return {
    id: 'creators',
    associateTag: config.associateTag,
    accessKey: config.clientId,
    secretKey: config.clientSecret,
    region: config.region,
    marketplace: config.marketplace,
    isActive: true,
  };
}

// Generate affiliate URL
export function generateAffiliateUrl(asin: string, associateTag: string, region: string): string {
  const baseUrl = region === 'in' ? 'https://www.amazon.in/dp' : 'https://www.amazon.com/dp';
  return `${baseUrl}/${asin}?tag=${associateTag}`;
}

// Search products using Creators API
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
  try {
    const config = await getCreatorsConfig();
    const token = await getAccessToken(config);

    const marketplace = config.region === 'in' ? 'www.amazon.in' : 'www.amazon.com';
    const partnerTag = config.associateTag;

    const requestBody: any = {
      keywords: params.keywords,
      marketplace,
      partnerTag,
      itemCount: 10,
      itemPage: params.page || 1,
      resources: [
        'images.primary.small',
        'images.primary.medium',
        'images.primary.large',
        'itemInfo.title',
        'itemInfo.features',
        'offers.listings.price',
        'offers.listings.savingBasis',
      ],
    };

    if (params.sortBy) {
      requestBody.sortBy = params.sortBy;
    }

    if (params.minPrice || params.maxPrice) {
      requestBody.priceRange = {};
      if (params.minPrice) requestBody.priceRange.minPrice = params.minPrice;
      if (params.maxPrice) requestBody.priceRange.maxPrice = params.maxPrice;
    }

    const response = await fetch('https://creatorsapi.amazon/catalog/v1/searchItems', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-marketplace': marketplace,
        'Version': config.version,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Creators API SearchItems error:', errorText);
      throw new Error(`Creators API error: ${response.status}`);
    }

    const data = await response.json();
    return parseSearchResponse(data, config.region);
  } catch (error) {
    console.error('Amazon search error:', error);
    // Return empty results on error
    return { items: [], totalResults: 0, page: params.page || 1 };
  }
}

// Get product details by ASIN using Creators API
export async function getProductDetails(params: {
  asin: string;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
}): Promise<AmazonProduct | null> {
  try {
    const config = await getCreatorsConfig();
    const token = await getAccessToken(config);

    const marketplace = config.region === 'in' ? 'www.amazon.in' : 'www.amazon.com';

    const requestBody = {
      itemIds: [params.asin],
      itemIdType: 'ASIN',
      marketplace,
      partnerTag: config.associateTag,
      resources: [
        'images.primary.small',
        'images.primary.medium',
        'images.primary.large',
        'itemInfo.title',
        'itemInfo.features',
        'offers.listings.price',
        'offers.listings.savingBasis',
      ],
    };

    const response = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-marketplace': marketplace,
        'Version': config.version,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Creators API GetItems error:', errorText);
      throw new Error(`Creators API error: ${response.status}`);
    }

    const data = await response.json();
    return parseGetItemsResponse(data, config.region);
  } catch (error) {
    console.error('Amazon get product error:', error);
    return null;
  }
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

// Parse SearchItems response
function parseSearchResponse(data: any, region: string): AmazonSearchResult {
  const items: AmazonProduct[] = [];

  if (data.searchResult?.items) {
    for (const item of data.searchResult.items) {
      const product = parseItem(item, region);
      if (product) items.push(product);
    }
  }

  return {
    items,
    totalResults: data.searchResult?.totalResultCount,
    page: data.searchResult?.itemPage,
  };
}

// Parse GetItems response
function parseGetItemsResponse(data: any, region: string): AmazonProduct | null {
  if (data.itemsResult?.items?.[0]) {
    return parseItem(data.itemsResult.items[0], region);
  }
  return null;
}

// Parse individual item
function parseItem(item: any, region: string): AmazonProduct | null {
  if (!item.asin) return null;

  const currency = region === 'in' ? 'INR' : 'USD';
  
  let currentPrice: number | undefined;
  let originalPrice: number | undefined;

  if (item.offersV2?.listings?.[0]?.price) {
    currentPrice = item.offersV2.listings[0].price.amount;
  }

  if (item.offersV2?.listings?.[0]?.savingBasis) {
    originalPrice = item.offersV2.listings[0].savingBasis.amount;
  }

  let imageUrl: string | undefined;
  if (item.images?.primary?.large?.url) {
    imageUrl = item.images.primary.large.url;
  } else if (item.images?.primary?.medium?.url) {
    imageUrl = item.images.primary.medium.url;
  }

  const title = item.itemInfo?.title?.displayValue || 'Unknown Product';
  const features = item.itemInfo?.features?.displayValues || [];
  const productUrl = item.detailPageURL || generateAffiliateUrl(item.asin, '', region);

  return {
    asin: item.asin,
    title,
    description: features.join('\n'),
    currentPrice,
    originalPrice,
    currency,
    imageUrl,
    productUrl,
    features,
  };
}

// Generate affiliate URL
export function generateAffiliateUrlLegacy(asin: string, associateTag: string, region: string): string {
  return generateAffiliateUrl(asin, associateTag, region);
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

// Export types
export type { AmazonProduct, AmazonSearchResult };
