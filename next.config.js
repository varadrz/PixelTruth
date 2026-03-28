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
    }
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
