/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV !== "production";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  // React Refresh (HMR) do next dev avalia strings como JS; não usar em produção
  ...(isDev ? ["'unsafe-eval'"] : []),
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
  "https://res.cloudinary.com",
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
  "http://localhost:3000",
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
  images: {
    // Next 16 exige declarar as qualidades usadas em <Image quality={...}> (ex.: pages/index.js usa 90)
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
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
  // Redirect legado ?product= -> /produtos/:categoria/:produto (301) fica no proxy.js,
  // porque o redirect de config mantinha o query string (308 com ?product=).
};

module.exports = nextConfig;
