import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import api from '../services/api';

const ThankYou = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    title: 'Thank You!',
    message: 'Your submission has been received successfully. We\'ll get back to you soon.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/public/system-settings');
      console.log("ThankYou Page Settings:", response.data);
      if (response.data?.thankYouPage) {
        setSettings(response.data.thankYouPage);
      }
    } catch (error) {
      console.error('Error fetching system settings:', error);
      // Use default values if API fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {settings.title}
          </h1>
          <p className="text-gray-600 mb-8">
            {settings.message}
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
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
