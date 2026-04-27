/** @type {import('next').NextConfig} */

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://ssl.google-analytics.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
].join(" ");

const scriptSrcElem = [
  "'self'",
  "'unsafe-inline'",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://ssl.google-analytics.com",
  "https://www.googleadservices.com",
  "https://googleads.g.doubleclick.net",
].join(" ");

const imgSrc = [
  "'self'",
  "data:",
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://googleads.g.doubleclick.net",
  "https://www.google.com",
  "https://i.ytimg.com",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
].join(" ");

const connectSrc = [
  "'self'",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://region1.google-analytics.com",
  "https://www.google.com",
  "https://googleads.g.doubleclick.net",
  "https://www.googleadservices.com",
].join(" ");

const cspHeader = [
  `script-src ${scriptSrc}`,
  `script-src-elem ${scriptSrcElem}`,
  `img-src ${imgSrc}`,
  `connect-src ${connectSrc}`,
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/produtos/:categoria",
        has: [{ type: "query", key: "product", value: "(?<produto>.*)" }],
        destination: "/produtos/:categoria/:produto",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
