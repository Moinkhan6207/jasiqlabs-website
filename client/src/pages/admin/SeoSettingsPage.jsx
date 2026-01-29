import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Save, RefreshCw } from 'lucide-react';
import Seo from '../../components/seo/Seo';
import api from '../../services/api';

const SeoSettingsPage = () => {
  const [formData, setFormData] = useState({
    siteName: '',
    titleTemplate: '{page} | {siteName}',
    defaultMetaDescription: '',
    defaultOgImageUrl: '',
    defaultFaviconUrl: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch current SEO settings
  const fetchSeoSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.seo.getSettings();
      if (response.data) {
        setFormData(prev => ({
          ...prev,
          ...response.data,
          // Ensure we don't set null/undefined values
          siteName: response.data.siteName || '',
          titleTemplate: response.data.titleTemplate || '{page} | {siteName}',
          defaultMetaDescription: response.data.defaultMetaDescription || '',
          defaultOgImageUrl: response.data.defaultOgImageUrl || '',
          defaultFaviconUrl: response.data.defaultFaviconUrl || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      toast.error('Failed to load SEO settings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.siteName || !formData.defaultMetaDescription) {
      toast.error('Site Name and Default Meta Description are required');
      return;
    }

    try {
      setIsSaving(true);
      await api.seo.updateSettings(formData);
      toast.success('SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving SEO settings:', error);
      toast.error('Failed to save SEO settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <Seo title="SEO Settings | Admin Panel" noIndex={true} />
      
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your website's search engine optimization settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {/* Site Name */}
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  Site Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="siteName"
                    id="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="e.g., My Awesome Site"
                    required
                  />
                </div>
              </div>

              {/* Title Template */}
              <div>
                <label htmlFor="titleTemplate" className="block text-sm font-medium text-gray-700">
                  Title Template
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="titleTemplate"
                    id="titleTemplate"
                    value={formData.titleTemplate}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="e.g., {page} | {siteName}"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use {'{page}'} for the page title and {'{siteName}'} for the site name.
                </p>
              </div>

              {/* Default Meta Description */}
              <div>
                <label htmlFor="defaultMetaDescription" className="block text-sm font-medium text-gray-700">
                  Default Meta Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="defaultMetaDescription"
                    name="defaultMetaDescription"
                    rows={3}
                    value={formData.defaultMetaDescription}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="A brief description of your website"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended length: 150-160 characters
                </p>
              </div>

              {/* Default Open Graph Image URL */}
              <div>
                <label htmlFor="defaultOgImageUrl" className="block text-sm font-medium text-gray-700">
                  Default Open Graph Image URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="defaultOgImageUrl"
                    id="defaultOgImageUrl"
                    value={formData.defaultOgImageUrl}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="https://example.com/images/og-image.jpg"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended size: 1200x630 pixels
                </p>
              </div>

              {/* Default Favicon URL */}
              <div>
                <label htmlFor="defaultFaviconUrl" className="block text-sm font-medium text-gray-700">
                  Default Favicon URL
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    name="defaultFaviconUrl"
                    id="defaultFaviconUrl"
                    value={formData.defaultFaviconUrl}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recommended size: 32x32 or 16x16 pixels
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={fetchSeoSettings}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <RefreshCw className="-ml-1 mr-2 h-4 w-4" />
                Reset
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Save className="-ml-1 mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SeoSettingsPage;
