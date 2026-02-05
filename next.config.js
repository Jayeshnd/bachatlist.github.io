/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure your domain for production
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://www.bachatlist.com' : undefined,
  
  // Ensure consistent URL format (no trailing slashes)
  trailingSlash: false,
  
  // Performance optimizations
  compress: true,
  
  // Optimized images configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'bachatlist.com',
      },
      {
        protocol: 'https',
        hostname: 'www.bachatlist.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn0.cuelinks.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn*.cuelinks.com',
      },
    ],
  },

  // Enable experimental optimizations
  experimental: {
    optimizeCss: true,
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
