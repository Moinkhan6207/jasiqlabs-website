import axios from 'axios';

// Backend URL
const BASE_URL = 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
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
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    return Promise.resolve(); 
  },
  getCurrentUser: () => api.get('/api/admin/auth/me'),
};

// 4. LEADS ENDPOINTS (Admin Side)
export const leads = {
  getAll: () => api.get('/api/admin/leads'),
  getById: (id) => api.get(`/api/admin/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/api/admin/leads/${id}/status`, { status }),
  exportLeads: () => 
    api.get('/api/admin/leads/export', { 
      responseType: 'blob',
    }),
};

// 5. BLOG ENDPOINTS
export const blog = {
  getAll: () => api.get('/api/admin/blog'),
  getById: (id) => api.get(`/api/admin/blog/${id}`),
  create: (data) => api.post('/api/admin/blog', data),
  update: (id, data) => api.patch(`/api/admin/blog/${id}`, data),
  delete: (id) => api.delete(`/api/admin/blog/${id}`),
};

// 6. CAREERS ENDPOINTS (Admin Side)
export const careers = {
  getAll: () => api.get('/api/admin/careers'),
  getById: (id) => api.get(`/api/admin/careers/${id}`),
  create: (data) => api.post('/api/admin/careers', data),
  update: (id, data) => api.patch(`/api/admin/careers/${id}`, data),
  delete: (id) => api.delete(`/api/admin/careers/${id}`),
  
  // 👇 NEW: Toggle Application Status (ON/OFF Switch)
  toggleApplicationStatus: (id) => api.patch(`/api/admin/careers/${id}/toggle-apply`),

  // Public Get All (Yahan bhi rakh sakte hain ya publicApi me)
  getPublicAll: () => api.get('/api/public/careers'),
};

// 7. DASHBOARD ENDPOINTS
export const dashboard = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
  getRecentLeads: () => api.get('/api/admin/dashboard/recent-leads'),
};

// 8. PUBLIC ENDPOINTS (User Side)
export const publicApi = {
  // Contact Form
  submitLead: (leadData) => api.post('/api/public/leads', leadData),  

  // Blog Public URLs
  getBlogPosts: () => api.get('/api/public/blog'), 
  getBlogPostById: (id) => api.get(`/api/public/blog/${id}`),

  // 👇 NEW: Submit Job Application
  submitApplication: (jobId, applicationData) => api.post(`/api/public/careers/${jobId}/apply`, applicationData),
};

// Default Export
const apiService = {
  auth,
  leads,
  blog,
  careers,
  dashboard,
  public: publicApi, 
};

export default apiService;