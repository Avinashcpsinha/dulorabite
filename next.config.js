/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Allow better-sqlite3 on server side only
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};

module.exports = nextConfig;
