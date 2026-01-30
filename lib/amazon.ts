import crypto from 'crypto';
import { prisma } from './prisma';

// Amazon PA-API Configuration
interface AmazonRequest {
  endpoint: string;
  params: Record<string, string>;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
  target?: string;
}

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

// Generate AWS Signature Version 4
function sign(key: Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function getSignatureKey(
  dateStamp: string,
  regionName: string,
  serviceName: string,
  secretKey: string
): Buffer {
  const kDate = sign(Buffer.from(`AWS4${secretKey}`), dateStamp);
  const kRegion = sign(kDate, regionName);
  const kService = sign(kRegion, serviceName);
  const kSigning = sign(kService, 'aws4_request');
  return kSigning;
}

function createCanonicalRequest(
  method: string,
  uri: string,
  headers: Record<string, string>,
  payloadHash: string
): string {
  const sortedHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key.toLowerCase()}:${headers[key]}`)
    .join('\n');

  const signedHeaders = Object.keys(headers)
    .sort()
    .map((key) => key.toLowerCase())
    .join(';');

  return `${method}\n${uri}\n\n${sortedHeaders}\n\n${signedHeaders}\n${payloadHash}`;
}

function createStringToSign(
  algorithm: string,
  credentialScope: string,
  datetime: string,
  canonicalRequest: string
): string {
  return `${algorithm}\n${datetime}\n${credentialScope}\n${canonicalRequest}`;
}

function createAuthorizationHeader(
  algorithm: string,
  credentialScope: string,
  signedHeaders: string,
  signature: string,
  accessKey: string
): string {
  return `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

// Main function to make Amazon PA-API requests
export async function makeAmazonRequest(request: AmazonRequest) {
  const {
    endpoint,
    params,
    region,
    accessKey,
    secretKey,
    target = 'com.amazon.paapi.v2020-08-26.GetItems'
  } = request;

  const host = `paapi.${region === 'in' ? 'amazon.in' : 'amazon.com'}`;
  const uri = '/Products/2020-08-26';
  const service = 'ProductAdvertisingAPI';
  const algorithm = 'AWS4-HMAC-SHA256';

  // Generate timestamp
  const date = new Date();
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);

  // HTTP headers
  const headers: Record<string, string> = {
    'content-encoding': 'amz-1.0',
    'content-type': 'application/json; charset=utf-8',
    host: host,
    'x-amz-date': amzDate,
    'x-amz-target': target,
    'x-amz-access-token': accessKey, // PA-API uses access token, not access key
  };

  // For PA-API, we use a simpler approach with the access token
  const payload = JSON.stringify(params);
  const payloadHash = crypto.createHash('sha256').update(payload).digest('hex');

  // Create canonical request
  const canonicalRequest = createCanonicalRequest('POST', uri, headers, payloadHash);

  // Create string to sign
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = createStringToSign(
    algorithm,
    credentialScope,
    amzDate,
    canonicalRequest
  );

  // Calculate signature
  const signingKey = getSignatureKey(dateStamp, region, service, secretKey);
  const signature = crypto
    .createHmac('sha256', signingKey)
    .update(stringToSign)
    .digest('hex');

  // Create authorization header
  const authorizationHeader = createAuthorizationHeader(
    algorithm,
    credentialScope,
    Object.keys(headers).map((k) => k.toLowerCase()).join(';'),
    signature,
    accessKey
  );

  // Make the request
  const response = await fetch(`https://${host}${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Amz-Date': amzDate,
      Authorization: authorizationHeader,
      'X-Amz-Target': target,
      'Content-Encoding': 'amz-1.0',
    },
    body: payload,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Amazon PA-API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Search products using PA-API
export async function searchProducts(params: {
  keywords: string;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
  category?: string;
  page?: number;
  sortBy?: 'Relevance' | 'PriceHighToLow' | 'PriceLowToHigh' | 'AvgCustomerReviews' | 'NewestArrivals';
  minPrice?: number;
  maxPrice?: number;
}): Promise<AmazonSearchResult> {
  const {
    keywords,
    region,
    accessKey,
    secretKey,
    associateTag,
    category,
    page = 1,
    sortBy = 'Relevance',
    minPrice,
    maxPrice,
  } = params;

  const itemCount = 10;
  const itemPage = page;

  const searchIndex = mapCategoryToSearchIndex(category);

  const requestParams: Record<string, any> = {
    Keywords: keywords,
    SearchIndex: searchIndex,
    ItemCount: itemCount,
    ItemPage: itemPage,
    Resources: [
      'BrowseNodeInfo.BrowseNodes',
      'BrowseNodeInfo.BrowseNodes.Ancestor',
      'BrowseNodeInfo.BrowseNodes.SalesRank',
      'Images.Primary.Small',
      'Images.Primary.Medium',
      'Images.Primary.Large',
      'Images.Variants.Small',
      'Images.Variants.Medium',
      'Images.Variants.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'ItemInfo.TechnicalInfo',
      'Offers.Listings.Price',
      'Offers.Listings.DeliveryInfo.IsPrimeEligible',
      'Offers.Summaries.LowestPrice',
      'Offers.Summaries.HighestPrice',
      'Offers.Summaries.OfferCount',
      'ParentASIN',
    ],
  };

  // Add price filters if provided
  if (minPrice !== undefined || maxPrice !== undefined) {
    requestParams.PriceRange = {};
    if (minPrice !== undefined) {
      requestParams.PriceRange.MinimumPrice = {
        Amount: minPrice,
        CurrencyCode: region === 'in' ? 'INR' : 'USD',
      };
    }
    if (maxPrice !== undefined) {
      requestParams.PriceRange.MaximumPrice = {
        Amount: maxPrice,
        CurrencyCode: region === 'in' ? 'INR' : 'USD',
      };
    }
  }

  // Add sort if not relevance
  if (sortBy !== 'Relevance') {
    requestParams.SortBy = sortBy;
  }

  try {
    const response = await makeAmazonRequest({
      endpoint: 'paapi',
      params: requestParams,
      region,
      accessKey,
      secretKey,
      associateTag,
      target: 'com.amazon.paapi.v2020-08-26.SearchItems',
    });

    return parseSearchResponse(response, region);
  } catch (error) {
    console.error('Amazon search error:', error);
    throw error;
  }
}

// Get product details by ASIN
export async function getProductDetails(params: {
  asin: string;
  region: string;
  accessKey: string;
  secretKey: string;
  associateTag: string;
}): Promise<AmazonProduct | null> {
  const { asin, region, accessKey, secretKey, associateTag } = params;

  const requestParams: Record<string, any> = {
    ItemIds: [asin],
    Resources: [
      'BrowseNodeInfo.BrowseNodes',
      'BrowseNodeInfo.BrowseNodes.Ancestor',
      'BrowseNodeInfo.BrowseNodes.SalesRank',
      'Images.Primary.Small',
      'Images.Primary.Medium',
      'Images.Primary.Large',
      'Images.Variants.Small',
      'Images.Variants.Medium',
      'Images.Variants.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'ItemInfo.ProductInfo',
      'ItemInfo.TechnicalInfo',
      'ItemInfo.ManufactureInfo',
      'ItemInfo.ContentInfo',
      'ItemInfo.ContentRating',
      'ItemInfo.Classifications',
      'Offers.Listings.Price',
      'Offers.Listings.DeliveryInfo.IsPrimeEligible',
      'Offers.Summaries.LowestPrice',
      'Offers.Summaries.HighestPrice',
      'Offers.Summaries.OfferCount',
      'ParentASIN',
      'SalesRank',
    ],
  };

  try {
    const response = await makeAmazonRequest({
      endpoint: 'paapi',
      params: requestParams,
      region,
      accessKey,
      secretKey,
      associateTag,
      target: 'com.amazon.paapi.v2020-08-26.GetItems',
    });

    return parseGetItemsResponse(response, region);
  } catch (error) {
    console.error('Amazon get product error:', error);
    throw error;
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
  const { asins, region, accessKey, secretKey, associateTag } = params;

  const requestParams: Record<string, any> = {
    ItemIds: asins,
    Resources: [
      'Images.Primary.Small',
      'Images.Primary.Medium',
      'Images.Primary.Large',
      'ItemInfo.Title',
      'ItemInfo.Features',
      'Offers.Listings.Price',
      'Offers.Summaries.LowestPrice',
    ],
  };

  try {
    const response = await makeAmazonRequest({
      endpoint: 'paapi',
      params: requestParams,
      region,
      accessKey,
      secretKey,
      associateTag,
      target: 'com.amazon.paapi.v2020-08-26.GetItems',
    });

    return parseMultipleItemsResponse(response, region);
  } catch (error) {
    console.error('Amazon get multiple products error:', error);
    throw error;
  }
}

// Helper function to map category to search index
function mapCategoryToSearchIndex(category?: string): string {
  const categoryMap: Record<string, string> = {
    electronics: 'Electronics',
    computers: 'Computers',
    books: 'Books',
    fashion: 'Fashion',
    home: 'HomeAndKitchen',
    kitchen: 'HomeAndKitchen',
    beauty: 'Beauty',
    health: 'HealthPersonalCare',
    toys: 'ToysAndGames',
    games: 'VideoGames',
    sports: 'SportsAndOutdoors',
    automotive: 'Automotive',
    tools: 'ToolsAndHomeImprovement',
    garden: 'GardenAndOutdoor',
    pet: 'PetSupplies',
    baby: 'BabyProducts',
    office: 'OfficeProducts',
    groceries: 'GroceryAndGourmetFood',
    music: 'Music',
    movies: 'MoviesAndTV',
    appliances: 'Appliances',
  };

  if (!category) return 'All';
  return categoryMap[category.toLowerCase()] || 'All';
}

// Parse search response
function parseSearchResponse(response: any, region: string): AmazonSearchResult {
  const items: AmazonProduct[] = [];

  if (response.SearchResult?.Items) {
    for (const item of response.SearchResult.Items) {
      const product = parseItem(item, region);
      if (product) {
        items.push(product);
      }
    }
  }

  return {
    items,
    totalResults: response.SearchResult?.TotalResultCount,
    page: response.SearchResult?.ItemPage,
  };
}

// Parse GetItems response
function parseGetItemsResponse(response: any, region: string): AmazonProduct | null {
  if (response.ItemsResult?.Items?.[0]) {
    return parseItem(response.ItemsResult.Items[0], region);
  }
  return null;
}

// Parse multiple items response
function parseMultipleItemsResponse(response: any, region: string): AmazonProduct[] {
  const items: AmazonProduct[] = [];

  if (response.ItemsResult?.Items) {
    for (const item of response.ItemsResult.Items) {
      const product = parseItem(item, region);
      if (product) {
        items.push(product);
      }
    }
  }

  return items;
}

// Parse individual item from response
function parseItem(item: any, region: string): AmazonProduct | null {
  if (!item.ASIN) return null;

  const currency = region === 'in' ? 'INR' : 'USD';

  // Extract price
  let currentPrice: number | undefined;
  let originalPrice: number | undefined;

  if (item.Offers?.Listings?.[0]?.Price) {
    const price = item.Offers.Listings[0].Price;
    currentPrice = price.Amount;
  }

  if (item.Offers?.Summaries?.[0]?.LowestPrice) {
    const lowestPrice = item.Offers.Summaries[0].LowestPrice;
    currentPrice = lowestPrice.Amount;
  }

  // Extract images
  let imageUrl: string | undefined;
  if (item.Images?.Primary?.Large) {
    imageUrl = item.Images.Primary.Large.URL;
  } else if (item.Images?.Primary?.Medium) {
    imageUrl = item.Images.Primary.Medium.URL;
  } else if (item.Images?.Primary?.Small) {
    imageUrl = item.Images.Primary.Small.URL;
  }

  // Extract title
  const title = item.ItemInfo?.Title?.DisplayValue || 'Unknown Product';

  // Extract features
  const features = item.ItemInfo?.Features?.DisplayValues || [];

  // Extract product URL
  const productUrl = item.DetailPageURL || `https://www.amazon.${region === 'in' ? 'in' : 'com'}/dp/${item.ASIN}`;

  return {
    asin: item.ASIN,
    title,
    description: item.ItemInfo?.Features?.DisplayValues?.join('\n'),
    currentPrice,
    originalPrice,
    currency,
    imageUrl,
    productUrl,
    features,
  };
}

// Generate affiliate URL
export function generateAffiliateUrl(asin: string, associateTag: string, region: string): string {
  const baseUrl = region === 'in' ? 'https://www.amazon.in/dp' : 'https://www.amazon.com/dp';
  return `${baseUrl}/${asin}?tag=${associateTag}`;
}

// Get active Amazon config from database
export async function getActiveAmazonConfig() {
  const config = await prisma.amazonConfig.findFirst({
    where: { isActive: true },
  });

  if (!config) {
    throw new Error('No active Amazon configuration found');
  }

  return config;
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
        accessKey: config.accessKey ?? '',
        secretKey: config.secretKey ?? '',
        associateTag: config.associateTag,
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

          // Check for price drop and trigger notification
          if (oldPrice && newPrice < oldPrice) {
            await triggerPriceDropNotification(product.dealId!, oldPrice, newPrice);
          }
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

// Trigger price drop notification
async function triggerPriceDropNotification(
  dealId: string,
  oldPrice: number,
  newPrice: number
) {
  // Get Telegram bot and send notification
  const bots = await prisma.telegramBot.findMany({
    where: { isActive: true },
    include: {
      notifications: {
        where: { type: 'PRICE_DROP', isEnabled: true },
      },
    },
  });

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { category: true },
  });

  if (!deal) return;

  for (const bot of bots) {
    const notification = bot.notifications[0];
    if (!notification) continue;

    const messageTemplate = notification.messageTemplate || 
      '🔔 *Price Drop Alert*\n\n*{title}*\n\n💰 *{oldPrice}* → *{newPrice}*\n\n{shortDesc}\n\n{affiliateUrl}';

    const message = messageTemplate
      .replace('{title}', deal.title)
      .replace('{oldPrice}', `₹${oldPrice.toFixed(2)}`)
      .replace('{newPrice}', `₹${newPrice.toFixed(2)}`)
      .replace('{shortDesc}', deal.shortDesc || '')
      .replace('{affiliateUrl}', deal.affiliateUrl || deal.productUrl);

    // Send to configured chat
    if (bot.chatId) {
      try {
        await sendTelegramMessage(bot.botToken, bot.chatId, message);
      } catch (error) {
        console.error('Failed to send price drop notification:', error);
      }
    }
  }
}

// Helper to send Telegram message (placeholder - should use lib/telegram.ts)
async function sendTelegramMessage(token: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
    }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${await response.text()}`);
  }

  return response.json();
}

// Export types for use in routes
export type { AmazonRequest, AmazonProduct, AmazonSearchResult };
