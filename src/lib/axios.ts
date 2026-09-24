import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create a single shared Axios instance
const apiClient = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Inject auth token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      // Handle 401 Unauthorized
      if (status === 401 && typeof window !== 'undefined') {
        const isAuthPage = window.location.pathname.startsWith('/login');
        if (!isAuthPage) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login?expired=true';
        }
      }
    } else if (error.request) {
      // Network error or timeout
      console.error('Network Error / Server Unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
