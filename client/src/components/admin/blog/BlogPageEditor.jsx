import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const BlogPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    blogTitle: '',
    blogSubtitle: '',
    newsletterTitle: '',
    newsletterDesc: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('blog', 'hero');
        
        // 🟢 FIX: Access nested 'content' object
        if (data?.data?.content) {
          const apiData = data.data.content;
          setFormData({
            blogTitle: apiData.blogTitle || '',
            blogSubtitle: apiData.blogSubtitle || '',
            newsletterTitle: apiData.newsletterTitle || '',
            newsletterDesc: apiData.newsletterDesc || ''
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load blog content');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🟢 TASK 3 FIX: Refetch data after successful update
  const refetchData = async () => {
    try {
      const { data } = await pageContent.get('blog', 'hero');
      
      if (data?.data?.content) {
        const apiData = data.data.content;
        setFormData({
          blogTitle: apiData.blogTitle || '',
          blogSubtitle: apiData.blogSubtitle || '',
          newsletterTitle: apiData.newsletterTitle || '',
          newsletterDesc: apiData.newsletterDesc || ''
        });
      }
    } catch (error) {
      console.error('Error refetching blog content:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pageName: 'blog',
        sectionKey: 'hero',
        content: formData
      };
      await pageContent.update(payload);
      toast.success('Blog Page Updated Successfully!');
      
      // 🟢 TASK 3 FIX: Refetch data to ensure UI is in sync with DB
      await refetchData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Blog Editor...</div>;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Blog Page Content Editor</h1>
          <p className="text-sm sm:text-base text-gray-600">Customize the Hero section and Newsletter banner.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg border border-indigo-100">
            <h3 className="text-base sm:text-lg font-bold text-indigo-900 mb-3 sm:mb-4">Hero Section</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Main Title</label>
                <input 
                  type="text" 
                  name="blogTitle" 
                  value={formData.blogTitle} 
                  onChange={handleChange} 
                  className="w-full border border-indigo-200 p-2 sm:p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                  placeholder="JASIQ Insights"
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  name="blogSubtitle" 
                  value={formData.blogSubtitle} 
                  onChange={handleChange} 
                  className="w-full border border-indigo-200 p-2 sm:p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Newsletter Banner</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Banner Title</label>
                <input 
                  type="text" 
                  name="newsletterTitle" 
                  value={formData.newsletterTitle} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 sm:p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm" 
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                  name="newsletterDesc" 
                  rows={3} 
                  value={formData.newsletterDesc} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 sm:p-2.5 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving} 
              className="w-full sm:w-auto px-4 sm:px-8 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium shadow-md text-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogPageEditor;