/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'plant-id.ams3.cdn.digitaloceanspaces.com',
        },
      ],
    },
  };

export default nextConfig;
