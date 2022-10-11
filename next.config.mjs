import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import withMarkdownLayer from './src/MarkdownLayer.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { GIST_API_KEY } = process.env;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@use "styles/mixins" as *;`,
  },
  images: {
    domains: ['i.cdn.co', 'i.scdn.co']
  }
}

export default withMarkdownLayer(nextConfig, GIST_API_KEY);
