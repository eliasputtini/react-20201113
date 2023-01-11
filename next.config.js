/** @type {import('next').NextConfig} */
const nextConfig = {
  dynamicRoutes: { "/articles/:articleId": "pages/articles/[articleId].js" },
  images: {
    domains: ["beta.mejorconsalud.com"],
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
