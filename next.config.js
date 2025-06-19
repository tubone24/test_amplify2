/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@mastra/core', '@ai-sdk/amazon-bedrock', '@aws-sdk/credential-providers'],
  output: 'standalone',
  images: {
    unoptimized: true
  },
  env: {
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
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