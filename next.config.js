/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure your domain for production
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://www.bachatlist.com' : undefined,
  
  images: {
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
    ],
  },
};

module.exports = nextConfig;
