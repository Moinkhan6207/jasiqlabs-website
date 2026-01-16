import axios from 'axios';
// Agar ENV file nahi hai to ise comment kar dein ya direct URL use karein
// import { ENV } from "../config/env"; 

const BASE_URL = 'http://localhost:8080'; // Ya process.env.VITE_API_URL

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. REQUEST INTERCEPTOR (Token bhejna)
api.interceptors.request.use(
  (config) => {
    // Token ka naam 'adminToken' hi rakhein (Backend/Context se match karein)
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR (401 Handle karna)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // Agar hum login page par nahi hain, tabhi redirect karein
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- API DEFINITIONS ---

// 3. AUTH ENDPOINTS
export const auth = {
  login: async (credentials) => {
    const response = await api.post('/api/admin/auth/login', credentials);
    return response.data; 
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    return api.post('/api/admin/auth/logout');
  },
  getCurrentUser: () => api.get('/api/admin/auth/me'),
};

// 4. LEADS ENDPOINTS (Protected)
export const leads = {
  getAll: (params = {}) => api.get('/api/admin/leads', { params }),
  getById: (id) => api.get(`/api/admin/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/api/admin/leads/${id}/status`, { status }),
  exportLeads: (params = {}) => 
    api.get('/api/admin/leads/export', { 
      params,
      responseType: 'blob', // Important for file download
    }),
};

// 5. BLOG ENDPOINTS
export const blog = {
  getAll: (params = {}) => api.get('/api/admin/blogs', { params }),
  getById: (id) => api.get(`/api/admin/blogs/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/api/admin/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.put(`/api/admin/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete: (id) => api.delete(`/api/admin/blogs/${id}`),
};

// 6. CAREERS ENDPOINTS
export const careers = {
  getAll: (params = {}) => api.get('/api/admin/careers', { params }),
  getById: (id) => api.get(`/api/admin/careers/${id}`),
  create: (data) => api.post('/api/admin/careers', data),
  update: (id, data) => api.put(`/api/admin/careers/${id}`, data),
  delete: (id) => api.delete(`/api/admin/careers/${id}`),
  getApplications: (params = {}) => api.get('/api/admin/careers/applications', { params }),
};

// 7. DASHBOARD ENDPOINTS
export const dashboard = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
  getRecentLeads: (limit = 5) => 
    api.get('/api/admin/dashboard/recent-leads', { params: { limit } }),
};

// 8. PUBLIC ENDPOINTS
export const publicApi = {
  getSeoDefaults: () => api.get('/api/public/seo/defaults'),
  getPageSeo: (slug) => api.get(`/api/public/seo/page/${slug}`),
  submitLead: (leadData) => api.post('/api/public/leads', leadData),
};

// Default Export
export default {
  auth,
  leads,
  blog,
  careers,
  dashboard,
  public: publicApi,
};