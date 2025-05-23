/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Add a loader for .geojson files
    config.module.rules.push({
      test: /\.geojson$/,
      use: "json-loader", // Use JSON loader for GeoJSON
    });

    return config;
  },
};

module.exports = nextConfig;
