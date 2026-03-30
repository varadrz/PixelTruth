const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/PixelTruth",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@huggingface/transformers"],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      config.resolve.alias["onnxruntime-node"] = false;
      config.resolve.alias["onnxruntime-web"] = path.resolve(
        __dirname,
        "node_modules/onnxruntime-web/dist/ort.all.min.js"
      );
    }

    config.module.rules.push({
      test: /\.mjs$/,
      type: "javascript/auto",
    });

    return config;
  },
};

module.exports = nextConfig;
