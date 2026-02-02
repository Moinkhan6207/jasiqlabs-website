import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const CareersPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    pageName: 'careers',
    sectionKey: 'hero',
    title: '',
    subtitle: '',
    description: '',
    whyUs: [
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' }
    ],
    whoCanApply: [
      { title: '', desc: '' },
      { title: '', desc: '' },
      { title: '', desc: '' }
    ],
    applyText: '',
    applyEmail: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Reset form first
        setFormData({
          pageName: 'careers',
          sectionKey: 'hero',
          title: '',
          subtitle: '',
          description: '',
          whyUs: [
            { title: '', desc: '' },
            { title: '', desc: '' },
            { title: '', desc: '' }
          ],
          whoCanApply: [
            { title: '', desc: '' },
            { title: '', desc: '' },
            { title: '', desc: '' }
          ],
          applyText: '',
          applyEmail: ''
        });

        // Fetch data with robust data extraction
        const response = await pageContent.get('careers', 'hero');
        const backendData = response.data; // Unwrap axios
        
        if (backendData) {
          // Priority 1: Check nested 'content' object
          if (backendData.content) {
            setFormData(prev => ({
              ...prev,
              title: backendData.content.title || '',
              subtitle: backendData.content.subtitle || '',
              description: backendData.content.description || '',
              whyUs: backendData.content.whyUs || prev.whyUs,
              whoCanApply: backendData.content.whoCanApply || prev.whoCanApply,
              applyText: backendData.content.applyText || '',
              applyEmail: backendData.content.applyEmail || ''
            }));
          } 
          // Priority 2: Check flat structure (Fallback)
          else {
            setFormData(prev => ({
              ...prev,
              title: backendData.title || '',
              subtitle: backendData.subtitle || '',
              description: backendData.description || '',
              whyUs: backendData.whyUs || prev.whyUs,
              whoCanApply: backendData.whoCanApply || prev.whoCanApply,
              applyText: backendData.applyText || '',
              applyEmail: backendData.applyEmail || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching careers page content:', error);
        toast.error('Failed to load careers page content');
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

  const handleNestedChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
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
          description: formData.description,
          whyUs: formData.whyUs,
          whoCanApply: formData.whoCanApply,
          applyText: formData.applyText,
          applyEmail: formData.applyEmail
        }
      };
      
      await pageContent.update(data);
      toast.success('Careers page content updated successfully!');
    } catch (error) {
      console.error('Error updating careers page content:', error);
      toast.error('Failed to update careers page content');
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
            />
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Us Section</h3>
        <div className="space-y-4">
          {formData.whyUs.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-3">Item {index + 1}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title {index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleNestedChange('whyUs', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter title ${index + 1}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description {index + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={item.desc}
                    onChange={(e) => handleNestedChange('whyUs', index, 'desc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter description ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Who Can Apply Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Who Can Apply Section</h3>
        <div className="space-y-4">
          {formData.whoCanApply.map((item, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-700 mb-3">Item {index + 1}</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title {index + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleNestedChange('whoCanApply', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter title ${index + 1}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description {index + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={item.desc}
                    onChange={(e) => handleNestedChange('whoCanApply', index, 'desc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={`Enter description ${index + 1}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How to Apply Section */}
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Apply Section</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="applyText" className="block text-sm font-medium text-gray-700 mb-1">
              "Don't see a role?" Text
            </label>
            <textarea
              id="applyText"
              name="applyText"
              rows={3}
              value={formData.applyText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the text for 'Don't see a role?' section"
            />
          </div>
          <div>
            <label htmlFor="applyEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="applyEmail"
              name="applyEmail"
              value={formData.applyEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter email address"
            />
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

export default CareersPageEditor;
