import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: "standalone",

  // Experimental features if needed
  experimental: {
    // Enable server actions if you're using them
    serverActions: {
      allowedOrigins: ["localhost:3000", "localhost:5000"],
    },
  },

  // Image optimization configuration
  images: {
    // Configure allowed domains for external images if needed
    remotePatterns: [
      // Add patterns for external image sources if you use any
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      // },
    ],
  },

  // Environment variables that should be available on the client
  env: {
    // Add any custom environment variables here
  },

  // Headers configuration for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
