import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Save, Power, FileText, AlertCircle } from 'lucide-react';
import { systemSettings } from '../../services/api';

const SystemPage = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    thankYouPage: {
      title: 'Thank You!',
      message: 'Your submission has been received successfully. We\'ll get back to you soon.'
    },
    notFoundPage: {
      title: 'Page Not Found',
      message: 'The page you\'re looking for doesn\'t exist or has been moved.'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await systemSettings.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching system settings:', error);
      toast.error('Failed to fetch system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await systemSettings.update(settings);
      toast.success('System settings updated successfully');
    } catch (error) {
      console.error('Error updating system settings:', error);
      toast.error('Failed to update system settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggleMaintenance = () => {
    setSettings(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-2">Manage system-wide settings and pages</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Maintenance Mode Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Power className="w-5 h-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-gray-900">Maintenance Mode</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">Enable maintenance mode to temporarily disable public access</p>
              <p className="text-sm text-gray-500 mt-1">
                When enabled, users will see a maintenance page. Admin routes will remain accessible.
              </p>
            </div>
            <button
              onClick={handleToggleMaintenance}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-orange-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {settings.maintenanceMode && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-800">
                  Maintenance mode is currently active
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Thank You Page Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Thank You Page</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={settings.thankYouPage.title}
                onChange={(e) => handleInputChange('thankYouPage', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter thank you page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Message
              </label>
              <textarea
                value={settings.thankYouPage.message}
                onChange={(e) => handleInputChange('thankYouPage', 'message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter thank you page message"
              />
            </div>
          </div>
        </div>

        {/* 404 Page Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">404 Page</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={settings.notFoundPage.title}
                onChange={(e) => handleInputChange('notFoundPage', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 404 page title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Message
              </label>
              <textarea
                value={settings.notFoundPage.message}
                onChange={(e) => handleInputChange('notFoundPage', 'message', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 404 page message"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
