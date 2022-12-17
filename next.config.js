module.exports = {
  publicRuntimeConfig: {
    crmUrl: process.env.CRM_URL,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
};
