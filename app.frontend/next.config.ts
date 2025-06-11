import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  images: {
    domains: ["maps.googleapis.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: Configuration) => {
    config.module?.rules?.push({
      test: /\.geojson$/,
      use: "json-loader",
    });
    return config;
  },
};

export default nextConfig;
