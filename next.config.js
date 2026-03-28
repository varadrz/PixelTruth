const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Indicate that these packages should not be bundled by webpack
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
      // Alias onnxruntime-web to the .js version to avoid import.meta issues in Terser
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
