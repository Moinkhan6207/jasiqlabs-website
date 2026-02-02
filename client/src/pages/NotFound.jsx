import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { api, pageContent } from '../services/api';

const NotFound = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState({
    title: '404 Page Not Found',
    subtitle: 'The page you\'re looking for doesn\'t exist or has been moved.'
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // First, try to fetch from Page Content API (CMS)
      const pageContentData = await pageContent.get('system', 'hero');
      
      if (pageContentData && pageContentData.title) {
        setContent({
          title: pageContentData.title,
          subtitle: pageContentData.subtitle || pageContentData.description || 'The page you\'re looking for doesn\'t exist or has been moved.'
        });
        return;
      }
    } catch (error) {
      console.log('Page content not found, falling back to system settings');
    }

    try {
      // Fallback to system settings
      const response = await api.get('/api/public/system-settings');
      if (response.data?.notFoundPage) {
        setContent({
          title: response.data.notFoundPage.title || '404 Page Not Found',
          subtitle: response.data.notFoundPage.message || 'The page you\'re looking for doesn\'t exist or has been moved.'
        });
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Use default values if both APIs fail
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <span className="text-4xl font-bold text-red-600">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {content.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {content.subtitle}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
