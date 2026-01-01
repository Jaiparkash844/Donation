import axios from 'axios';

const apiClient = axios.create({
  baseURL: ' https://donation-backend-neon.vercel.app/api',
});

// This helps with the "Not Authorized" issue you had earlier
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;