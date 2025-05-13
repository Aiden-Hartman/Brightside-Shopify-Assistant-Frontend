/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '',
  assetPrefix: '',
  trailingSlash: false,
  // Prevent client-side navigation issues
  async rewrites() {
    return [
      {
        source: '/embedded',
        destination: '/embedded',
      },
    ];
  },
};

module.exports = nextConfig; 