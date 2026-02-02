import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const ProductsPageEditor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: ''
  });

  const SECTION_KEY = 'products_hero';
  const PAGE_NAME = 'products';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setFormData({ title: '', subtitle: '', description: '' });

        const response = await pageContent.get(PAGE_NAME, SECTION_KEY);
        const backendData = response.data || response;
        const data = backendData.data || backendData;

        if (data) {
          if (data.content) {
            setFormData(prev => ({
              ...prev,
              title: data.content.title || '',
              subtitle: data.content.subtitle || '',
              description: data.content.description || ''
            }));
          } else {
            setFormData(prev => ({
              ...prev,
              title: data.title || '',
              subtitle: data.subtitle || '',
              description: data.description || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      const payload = {
        pageName: PAGE_NAME,
        sectionKey: SECTION_KEY,
        content: {
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description
        }
      };

      await pageContent.update(payload);
      toast.success('Products content updated successfully!');
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Products Hero Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-4">
        <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-md">Cancel</button>
        <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-md">{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  );
};

export default ProductsPageEditor;
