import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const AboutPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    pageName: 'about',
    sectionKey: 'hero',
    title: '',
    subtitle: '',
    visionTitle: '',
    visionDesc: '',
    missionTitle: '',
    missionDesc: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Reset form first
        setFormData({
          pageName: 'about',
          sectionKey: 'hero',
          title: '',
          subtitle: '',
          visionTitle: '',
          visionDesc: '',
          missionTitle: '',
          missionDesc: ''
        });

        // Fetch data with robust data extraction
        const response = await pageContent.get('about', 'hero');
        const backendData = response.data; // Unwrap axios
        
        if (backendData) {
          // Priority 1: Check nested 'content' object
          if (backendData.content) {
            setFormData(prev => ({
              ...prev,
              title: backendData.content.title || '',
              subtitle: backendData.content.subtitle || '',
              visionTitle: backendData.content.visionTitle || '',
              visionDesc: backendData.content.visionDesc || '',
              missionTitle: backendData.content.missionTitle || '',
              missionDesc: backendData.content.missionDesc || ''
            }));
          } 
          // Priority 2: Check flat structure (Fallback)
          else {
            setFormData(prev => ({
              ...prev,
              title: backendData.title || '',
              subtitle: backendData.subtitle || '',
              visionTitle: backendData.visionTitle || '',
              visionDesc: backendData.visionDesc || '',
              missionTitle: backendData.missionTitle || '',
              missionDesc: backendData.missionDesc || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching about page content:', error);
        toast.error('Failed to load about page content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Prepare payload with content wrapper
      const data = {
        pageName: formData.pageName,
        sectionKey: formData.sectionKey,
        content: {
          title: formData.title,
          subtitle: formData.subtitle,
          visionTitle: formData.visionTitle,
          visionDesc: formData.visionDesc,
          missionTitle: formData.missionTitle,
          missionDesc: formData.missionDesc
        }
      };
      
      await pageContent.update(data);
      toast.success('About page content updated successfully!');
    } catch (error) {
      console.error('Error updating about page content:', error);
      toast.error('Failed to update about page content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Section Fields */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hero Section</h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter subtitle"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Mission & Vision Section</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Mission Fields */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">Mission</h4>
            <div>
              <label htmlFor="missionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Mission Title
              </label>
              <input
                type="text"
                id="missionTitle"
                name="missionTitle"
                value={formData.missionTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter mission title"
              />
            </div>
            <div>
              <label htmlFor="missionDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Mission Description
              </label>
              <textarea
                id="missionDesc"
                name="missionDesc"
                rows={4}
                value={formData.missionDesc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter mission description"
              />
            </div>
          </div>

          {/* Vision Fields */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">Vision</h4>
            <div>
              <label htmlFor="visionTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Vision Title
              </label>
              <input
                type="text"
                id="visionTitle"
                name="visionTitle"
                value={formData.visionTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vision title"
              />
            </div>
            <div>
              <label htmlFor="visionDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Vision Description
              </label>
              <textarea
                id="visionDesc"
                name="visionDesc"
                rows={4}
                value={formData.visionDesc}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter vision description"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default AboutPageEditor;
