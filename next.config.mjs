/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.cache = false;
    }

    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "encoding");
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "ik.imagekit.io",
      },
      {
        hostname: "arweave.net",
      },
      {
        hostname: "storage.googleapis.com",
      },
      {
        hostname: "i.imgur.com",
      },
      {
        hostname: "supercast.mypinata.cloud",
      },
      {
        hostname: "gw.ipfs-lens.dev",
      },
      {
        hostname: "www.clanker.world",
      },
      {
        hostname: "pbs.twimg.com",
      },
    ],
  },
};

export default nextConfig;
