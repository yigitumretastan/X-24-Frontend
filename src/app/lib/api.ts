import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getCookie, deleteCookie } from '@/app/utils/cookies';

// API Base URL - şimdilik direkt backend URL kullan (proxy devre dışı)
export const API_BASE_URL = 'https://localhost:7171';

// Axios instance oluştur
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie'ler için
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
  (config) => {
    const token = getCookie('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // API isteklerini Network sekmesinde belirgin hale getir
    if (config.url?.startsWith('/api/')) {
      config.headers['X-API-Request'] = 'true';
      config.headers['X-Request-Type'] = 'API';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token yenileme ve error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 401 durumunda token'ı sil ve login'e yönlendir
    if (error.response?.status === 401) {
      deleteCookie('userToken');
      deleteCookie('userData');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// API helper functions
export const apiClient = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data?: any) => api.post<T>(url, data),
  put: <T>(url: string, data?: any) => api.put<T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export default api;
