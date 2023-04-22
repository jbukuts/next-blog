/* eslint-disable no-param-reassign */
const path = require('path');

const { ENABLE_STATIC } = process.env;

const staticExport = {
  output: 'export',
  distDir: 'out'
};

const contentSecurityPolicy = `
  default-src 'self' vitals.vercel-insights.com assets.vercel.com;
  script-src 'self' cdn.vercel-insights.com vercel.live 'unsafe-eval' 'unsafe-inline';
  child-src jbukuts.com *.jbukuts.com vercel.live;
  style-src 'self' jbukuts.com *.jbukuts.com fonts.googleapis.com 'unsafe-inline';
  font-src 'self' fonts.gstatic.com;
  frame-ancestors 'self';
`;

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...((ENABLE_STATIC && staticExport) || {}),
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "src/styles/resources" as *;`,
    logger: {
      debug(message) {
        // eslint-disable-next-line no-console
        console.log(message);
      }
    }
  },
  webpack: (config) => {
    config.mode = 'production';
    return config;
  },
  async headers() {
    return [
      {
        source: '/post/:path*',
        headers: securityHeaders
      },
      {
        source: '/',
        headers: securityHeaders
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/rss.xml',
        destination: '/api/rss'
      }
    ];
  }
};

module.exports = nextConfig;
