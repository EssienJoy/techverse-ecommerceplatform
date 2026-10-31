import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/settings", destination: "/profile/settings", permanent: false },
      {
        source: "/appearance",
        destination: "/profile/appearance",
        permanent: false,
      },
      {
        source: "/notifications",
        destination: "/profile/settings",
        permanent: false,
      },
      { source: "/contact", destination: "/profile/support", permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
