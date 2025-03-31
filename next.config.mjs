/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '4.5mb' },
    turbo: {
      rules: {
        '*.svg': ['@svgr/webpack'],
      },
    },
  },
  images: { remotePatterns: [{ hostname: '*' }], unoptimized: true },
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test?.test?.('.svg'),
    );
    config.module.rules.push(
      {
        ...fileLoaderRule,
        resourceQuery: /url/,
        test: /\.svg$/i,
      },
      {
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        test: /\.svg$/i,
        use: ['@svgr/webpack'],
      },
    );
    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
