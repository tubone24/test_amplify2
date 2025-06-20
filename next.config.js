/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@mastra/core', '@ai-sdk/amazon-bedrock', '@aws-sdk/credential-providers'],
  output: 'standalone',
  images: {
    unoptimized: true
  },
  env: {
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    CONFLUENCE_BASE_URL: process.env.CONFLUENCE_BASE_URL || '',
    CONFLUENCE_API_TOKEN: process.env.CONFLUENCE_API_TOKEN || '',
    CONFLUENCE_USER_EMAIL: process.env.CONFLUENCE_USER_EMAIL || '',
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []), 
        '@mastra/core',
        '@aws-sdk/client-ssm',
        '@ai-sdk/amazon-bedrock',
        '@aws-sdk/credential-providers'
      ];
    }
    return config;
  },
};

module.exports = nextConfig;