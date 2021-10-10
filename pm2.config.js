require('dotenv').config();
module.exports = {
  apps: [
    {
      name: 'crm_cart',
      script: './server.js',
      watch: true,
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: process.env.NODE_PORT,
        NODE_ENV: 'production',
      },
    },
  ],
}
