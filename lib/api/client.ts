import axios from 'axios';

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL || 'crm.choparpizza.uz';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '63dif6icpi61ci3f';

export const apiClient = axios.create({
  baseURL: `https://${CRM_URL}/rest/1/${API_TOKEN}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);
