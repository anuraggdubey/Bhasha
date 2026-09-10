/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Support streaming audio and larger payloads for API routes if needed
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
