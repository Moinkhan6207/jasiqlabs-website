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
  
  // NEW: Toggle Application Status (ON/OFF Switch)
  toggleApplicationStatus: (id) => api.patch(`/api/admin/careers/${id}/toggle-apply`),
  
  // NEW: Get Job Applications
  getApplications: (id) => api.get(`/api/admin/careers/${id}/applications`),

  // Public Get All (Yahan bhi rakh sakte hain ya publicApi me)
  getPublicAll: () => api.get('/api/public/careers'),
};

// 7. PAGE CONTENT ENDPOINTS
export const pageContent = {
  get: async (pageName, sectionKey) => {
    const response = await api.get(`/api/content/${pageName}/${sectionKey}`);
    return response.data;
  },
  update: async (data) => {
    const response = await api.post('/api/content', data);
    return response.data;
  },
};

// 8. DASHBOARD ENDPOINTS
export const dashboard = {
  getStats: () => api.get('/api/admin/dashboard/stats'),
  getRecentLeads: () => api.get('/api/admin/dashboard/recent-leads'),
};

// 8. SEO ENDPOINTS
export const seo = {
  getSettings: () => api.get('/api/public/seo/defaults'),
  
  // 👇👇👇 YAHAN CHANGE KAREIN (put -> post) 👇👇👇
  updateSettings: (data) => api.post('/api/seo', data),
  // 👆👆👆
  
  // NEW: Page-specific SEO endpoints
  getPageSeo: (pageName) => api.get(`/api/seo/${pageName}`),
  updatePageSeo: (pageName, data) => api.post(`/api/seo/${pageName}`, data),
};

// 9. DIVISION CONTENT ENDPOINTS (Programs, Services, Products)
export const divisionContent = {
  // Programs (RealWorkStudio)
  getPrograms: () => api.get('/api/admin/divisions/PROGRAM'),
  getProgram: (id) => api.get(`/api/admin/divisions/PROGRAM/${id}`),
  createProgram: (data) => api.post('/api/admin/divisions/PROGRAM', data),
  updateProgram: (id, data) => api.patch(`/api/admin/divisions/PROGRAM/${id}`, data),
  deleteProgram: (id) => api.delete(`/api/admin/divisions/PROGRAM/${id}`),

  // Services (TechWorksStudio)
  getServices: () => api.get('/api/admin/divisions/SERVICE'),
  getService: (id) => api.get(`/api/admin/divisions/SERVICE/${id}`),
  createService: (data) => api.post('/api/admin/divisions/SERVICE', data),
  updateService: (id, data) => api.patch(`/api/admin/divisions/SERVICE/${id}`, data),
  deleteService: (id) => api.delete(`/api/admin/divisions/SERVICE/${id}`),

  // Products (Products & AI)
  getProducts: () => api.get('/api/admin/divisions/PRODUCT'),
  getProduct: (id) => api.get(`/api/admin/divisions/PRODUCT/${id}`),
  createProduct: (data) => api.post('/api/admin/divisions/PRODUCT', data),
  updateProduct: (id, data) => api.patch(`/api/admin/divisions/PRODUCT/${id}`, data),
  deleteProduct: (id) => api.delete(`/api/admin/divisions/PRODUCT/${id}`),
};

// 10. SYSTEM SETTINGS ENDPOINTS
export const systemSettings = {
  get: () => api.get('/api/admin/system-settings'),
  update: (settings) => api.put('/api/admin/system-settings', settings),
};

// 11. PUBLIC ENDPOINTS (User Side)
export const publicApi = {
  // Contact Form
  submitLead: (leadData) => api.post('/api/public/leads', leadData),  

  // Blog Public URLs
  getBlogPosts: () => api.get('/api/public/blog'), 
  getBlogPostById: (id) => api.get(`/api/public/blog/${id}`),

  // 👇 NEW: Submit Job Application
  submitApplication: (jobId, applicationData) => api.post(`/api/public/careers/${jobId}/apply`, applicationData),

  // 👇 NEW: Get Page SEO Data
  getPageSeo: (pageName) => api.get(`/api/public/seo/${pageName}`),

  // 👇 NEW: Get Service by slug
  getServiceBySlug: (slug) => api.get(`/api/public/services/${slug}`),

  // 👇 NEW: Get all programs, services, and products
  getPrograms: () => api.get('/api/public/programs'),
  getServices: () => api.get('/api/public/services'),
  getProducts: () => api.get('/api/public/products'),
  getProductById: (id) => api.get(`/api/public/products/${id}`),
};

// Export the raw api instance for direct use
export { api };

// Default Export
const apiService = {
  auth,
  leads,
  blog,
  careers,
  dashboard,
  pageContent,
  seo,
  divisionContent,
  systemSettings,
  public: publicApi, 
};

export default apiService;