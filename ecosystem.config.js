module.exports = {
  apps: [
    {
      name: 'crm-cart',
      script: '/root/.nvm/versions/node/v20.19.0/bin/node',
      args: 'node_modules/next/dist/bin/next start -p 8082',
      cwd: '/home/davr/chopar/crm_cart',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
