// Simple test to check if the About page API calls work
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const pageContent = {
  get: async (pageName, sectionKey) => {
    const response = await api.get(`/content/${pageName}/${sectionKey}`);
    return response.data;
  },
};

const testAboutPage = async () => {
  try {
    console.log('Testing About page API calls...');
    
    const results = await Promise.all([
      pageContent.get('about', 'hero'),
      pageContent.get('about', 'story'),
      pageContent.get('about', 'different'),
      pageContent.get('about', 'culture'),
      pageContent.get('about', 'leadership'),
      pageContent.get('about', 'cta'),
    ]);
    
    console.log('API Results:', results.map(r => r.data ? 'Success' : 'Failed'));
    console.log('Sample hero data:', results[0].data);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testAboutPage();
