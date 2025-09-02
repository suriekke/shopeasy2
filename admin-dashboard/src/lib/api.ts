import axios from 'axios';

const API_BASE_URL = 'https://shopeasy-backend.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API endpoints
export const authAPI = {
  // OTP Authentication (using existing backend)
  sendOTP: (phoneNumber: string) => 
    api.post('/api/auth/send-otp', { phone_number: phoneNumber }),
  
  verifyOTP: (phoneNumber: string, otp: string) => 
    api.post('/api/auth/verify-otp', { phone_number: phoneNumber, otp }),
  
  // Admin Login (for future JWT implementation)
  login: (email: string, password: string) => 
    api.post('/api/auth/admin/login', { email, password }),
};

export const productsAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id: string) => api.get(`/api/products/${id}`),
  create: (productData: FormData) => api.post('/api/products', productData),
  update: (id: string, productData: any) => api.put(`/api/products/${id}`, productData),
  delete: (id: string) => api.delete(`/api/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
  create: (categoryData: any) => api.post('/api/categories', categoryData),
  update: (id: string, categoryData: any) => api.put(`/api/categories/${id}`, categoryData),
  delete: (id: string) => api.delete(`/api/categories/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/api/orders'),
  getById: (id: string) => api.get(`/api/orders/${id}`),
  updateStatus: (id: string, status: string) => api.patch(`/api/orders/${id}/status`, { status }),
};

export const usersAPI = {
  getAll: () => api.get('/api/users'),
  getById: (id: string) => api.get(`/api/users/${id}`),
};

export default api;
