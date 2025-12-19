module.exports = {
  apps: [
    {
      name: 'crm-cart',
      script: 'node_modules/.bin/next',
      args: 'start -p 8082',
      cwd: '/home/davr/chopar/crm_cart',
      interpreter: '/root/.nvm/versions/node/v20.19.0/bin/node',
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
