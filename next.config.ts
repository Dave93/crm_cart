import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_CRM_URL: process.env.CRM_URL || 'crm.choparpizza.uz',
  },
};

export default nextConfig;
