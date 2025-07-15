import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_STUDDY_BUDDY_API_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;