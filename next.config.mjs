/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.module.rules.push({
        test: /\.ttf$/,
        use: [{ loader: "file-loader" }]
      });

      return config;
    }

    return config;
  }
};

export default nextConfig;
