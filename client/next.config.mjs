/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      { hostname: 'loremflickr.com' },
      { hostname: 'picsum.photos' },
      {
        hostname: 'back-end-black-river-6039.fly.dev',
      },
    ],
  },
  output: 'standalone',
};

export default nextConfig;
