/**
 * Convert a string to a URL-friendly slug
 * @param str The string to slugify
 * @returns The slugified string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Capitalize first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format price with currency
 * @param price The price to format
 * @param currency The currency code (default: INR)
 * @returns The formatted price string
 */
export function formatPrice(price: number, currency: string = "INR"): string {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol} ${price.toLocaleString("en-IN")}`;
}

/**
 * Calculate discount percentage
 * @param originalPrice The original price
 * @param currentPrice The current/discounted price
 * @returns The discount percentage
 */
export function calculateDiscount(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Convert Prisma Decimal to number for client components
 * @param value The Decimal value or number
 * @returns The value as a number
 */
export function toNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseFloat(value);
  // Handle Prisma Decimal objects
  if (typeof value === 'object' && 'toNumber' in value) {
    return value.toNumber();
  }
  return 0;
}

/**
 * Convert Prisma Decimal to string for display
 * @param value The Decimal value or number
 * @returns The value as a string
 */
export function toString(value: any): string {
  if (value === null || value === undefined) return '0';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  // Handle Prisma Decimal objects
  if (typeof value === 'object' && 'toString' in value) {
    return value.toString();
  }
  return '0';
}

/**
 * Remove null values from an object
 * @param obj The object to sanitize
 * @returns A new object without null/undefined values
 */
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      // Handle nested objects and arrays
      if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        result[key] = sanitizeObject(value);
      } else if (typeof value === 'object' && Array.isArray(value)) {
        result[key] = value.map(item => 
          typeof item === 'object' ? sanitizeObject(item) : item
        );
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Serialize Decimal and BigInt values to JSON-compatible format
 * Prisma Decimal types don't serialize to JSON properly, this fixes that
 * @param value The value to serialize
 * @returns JSON-compatible value with Decimals as strings
 */
export function serializeDecimal(value: any): any {
  if (value === null || value === undefined) {
    return value;
  }
  
  // Handle strings - clean any hidden characters or BOM
  if (typeof value === 'string') {
    // Remove BOM character if present
    if (value.charCodeAt(0) === 0xFEFF) {
      value = value.slice(1);
    }
    // Remove null characters and other invisible chars
    return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\u200B-\u200F\u2028\u2029\uFEFF]/g, '').trim();
  }
  
  // Handle Prisma Decimal objects (have special toString method for decimals)
  // Check if it's NOT a plain object by verifying it has a different toString than Object.prototype
  if (
    typeof value === 'object' && 
    'toString' in value && 
    typeof value.toString === 'function' &&
    value.toString !== Object.prototype.toString
  ) {
    const strValue = value.toString();
    // Clean any hidden characters
    if (typeof strValue === 'string') {
      return strValue.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\u200B-\u200F\u2028\u2029\uFEFF]/g, '').trim();
    }
    return strValue;
  }
  
  // Handle BigInt values
  if (typeof value === 'bigint') {
    return value.toString();
  }
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => serializeDecimal(item));
  }
  
  // Handle objects (but not Date objects)
  if (typeof value === 'object' && !(value instanceof Date)) {
    const serialized: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
      serialized[key] = serializeDecimal(val);
    }
    return serialized;
  }
  
  return value;
}
