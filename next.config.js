/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async redirects() {
    return [
      {
        source: "/produtos/:categoria",
        has: [{ type: "query", key: "product", value: "(?<produto>.*)" }],
        destination: "/produtos/:categoria/:produto",
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
