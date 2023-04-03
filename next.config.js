/* eslint-disable no-param-reassign */
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
