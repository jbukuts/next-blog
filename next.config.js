/* eslint-disable no-param-reassign */
const path = require('path');

const { ENABLE_STATIC } = process.env;

const staticExport = {
  output: 'export',
  distDir: 'out'
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...((ENABLE_STATIC && staticExport) || {}),
  reactStrictMode: true,
  swcMinify: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "src/styles/resources" as *;`
  },
  webpack: (config) => {
    // Important: return the modified config
    config.mode = 'production';
    return config;
  }
};

module.exports = nextConfig;
