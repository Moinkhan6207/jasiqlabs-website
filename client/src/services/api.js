import axios from 'axios';

// Backend URL from environment variables
URL = import.meta.env.VITE_API_BASE_URL || 
                 (import.meta.env.PROD ? 'https://jasiqlabs-website.onrender.com/api' : 'http://localhost:8080/api');
// Create axios instance
const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
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
    const response = await api.post('/admin/auth/login', credentials);
    return response.data; 
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    return Promise.resolve(); 
  },
  getCurrentUser: () => api.get('/admin/auth/me'),
};

// 4. LEADS ENDPOINTS (Admin Side)
export const leads = {
  getAll: () => api.get('/admin/leads'),
  getById: (id) => api.get(`/admin/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/admin/leads/${id}/status`, { status }),
  exportLeads: () => 
    api.get('/admin/leads/export', { 
      responseType: 'blob',
    }),
};

// 5. BLOG ENDPOINTS
export const blog = {
  getAll: () => api.get('/admin/blog'),
  getById: (id) => api.get(`/admin/blog/${id}`),
  create: (data) => api.post('/admin/blog', data),
  update: (id, data) => api.patch(`/admin/blog/${id}`, data),
  delete: (id) => api.delete(`/admin/blog/${id}`),
};

// 6. CAREERS ENDPOINTS (Admin Side)
export const careers = {
  getAll: () => api.get('/admin/careers'),
  getById: (id) => api.get(`/admin/careers/${id}`),
  create: (data) => api.post('/admin/careers', data),
  update: (id, data) => api.patch(`/admin/careers/${id}`, data),
  delete: (id) => api.delete(`/admin/careers/${id}`),
  
  // NEW: Toggle Application Status (ON/OFF Switch)
  toggleApplicationStatus: (id) => api.patch(`/admin/careers/${id}/toggle-apply`),
  
  // NEW: Get Job Applications
  getApplications: (id) => api.get(`/admin/careers/${id}/applications`),

  // Public Get All (Yahan bhi rakh sakte hain ya publicApi me)
  getPublicAll: () => api.get('/public/careers'),
};

// 7. PAGE CONTENT ENDPOINTS
export const pageContent = {
  get: async (pageName, sectionKey) => {
    const response = await api.get(`/content/${pageName}/${sectionKey}`);
    return response.data;
  },
  update: async (data) => {
    const response = await api.post('/content', data);
    return response.data;
  },
};

// 8. DASHBOARD ENDPOINTS
export const dashboard = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getRecentLeads: () => api.get('/admin/dashboard/recent-leads'),
};

// 8. SEO ENDPOINTS
export const seo = {
  getSettings: () => api.get('/public/seo/defaults'),
  
  // 👇👇👇 YAHAN CHANGE KAREIN (put -> post) 👇👇👇
  updateSettings: (data) => api.post('/seo', data),
  // 👆👆👆
  
  // NEW: Page-specific SEO endpoints
  getPageSeo: (pageName) => api.get(`/seo/${pageName}`),
  updatePageSeo: (pageName, data) => api.post(`/seo/${pageName}`, data),
};

// 9. DIVISION CONTENT ENDPOINTS (Programs, Services, Products)
export const divisionContent = {
  // Programs (RealWorkStudio)
  getPrograms: () => api.get('/admin/divisions/PROGRAM'),
  getProgram: (id) => api.get(`/admin/divisions/PROGRAM/${id}`),
  createProgram: (data) => api.post('/admin/divisions/PROGRAM', data),
  updateProgram: (id, data) => api.patch(`/admin/divisions/PROGRAM/${id}`, data),
  deleteProgram: (id) => api.delete(`/admin/divisions/PROGRAM/${id}`),

  // Services (TechWorksStudio)
  getServices: () => api.get('/admin/divisions/SERVICE'),
  getService: (id) => api.get(`/admin/divisions/SERVICE/${id}`),
  createService: (data) => api.post('/admin/divisions/SERVICE', data),
  updateService: (id, data) => api.patch(`/admin/divisions/SERVICE/${id}`, data),
  deleteService: (id) => api.delete(`/admin/divisions/SERVICE/${id}`),

  // Products (Products & AI)
  getProducts: () => api.get('/admin/divisions/PRODUCT'),
  getProduct: (id) => api.get(`/admin/divisions/PRODUCT/${id}`),
  createProduct: (data) => api.post('/admin/divisions/PRODUCT', data),
  updateProduct: (id, data) => api.patch(`/admin/divisions/PRODUCT/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/divisions/PRODUCT/${id}`),
};

// 10. SYSTEM SETTINGS ENDPOINTS
export const systemSettings = {
  get: () => api.get('/admin/system-settings'),
  update: (settings) => api.put('/admin/system-settings', settings),
};

// 11. PUBLIC ENDPOINTS (User Side)
export const publicApi = {
  // Contact Form
  submitLead: (leadData) => api.post('/public/leads', leadData),  

  // Blog Public URLs
  getBlogPosts: () => api.get('/public/blog'), 
  getBlogPostById: (id) => api.get(`/public/blog/${id}`),

  // 👇 NEW: Submit Job Application
  submitApplication: (jobId, applicationData) => api.post(`/public/careers/${jobId}/apply`, applicationData),

  // 👇 NEW: Get Page SEO Data
  getPageSeo: (pageName) => api.get(`/public/seo/${pageName}`),

  // 👇 NEW: Get Service by slug
  getServiceBySlug: (slug) => api.get(`/public/services/${slug}`),

  // 👇 NEW: Get all programs, services, and products
  getPrograms: () => api.get('/public/programs'),
  getServices: () => api.get('/public/services'),
  getProducts: () => api.get('/public/products'),
  getProductById: (id) => api.get(`/public/products/${id}`),
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