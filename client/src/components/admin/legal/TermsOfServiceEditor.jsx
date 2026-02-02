import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const TermsOfServiceEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [termsData, setTermsData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    sections: [
      { title: '', content: '' },
      { title: '', content: '' },
      { title: '', content: '' }
    ],
    contactEmail: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_terms', 'content');
        
        if (data?.data) {
          const safeSections = (arr, size) => {
            const newArr = arr && Array.isArray(arr) ? [...arr] : [];
            while (newArr.length < size) newArr.push({ title: '', content: '' });
            return newArr.slice(0, size);
          };

          setTermsData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            sections: safeSections(data.data.sections, 3),
            contactEmail: data.data.contactEmail || ''
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load terms of service');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setTermsData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    setTermsData(prev => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };
      return { ...prev, sections: newSections };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pageName: 'legal_terms',
        sectionKey: 'content',
        content: {
          ...termsData,
          sections: termsData.sections.filter(section => section.title.trim() !== '' || section.content.trim() !== '')
        }
      };
      await pageContent.update(payload);
      toast.success('Terms of Service Updated!');
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Terms Editor...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="bg-green-50 p-4 rounded-md text-sm text-green-800 border border-green-100">
        <strong>Terms of Service Editor:</strong> Fill in the structured fields below.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={termsData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={termsData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-green-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction</label>
        <textarea rows={4} value={termsData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-green-500" />
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-gray-700">Terms Sections</h3>
        {termsData.sections.map((section, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded border">
            <h4 className="font-semibold mb-3 text-gray-700">Section {i+1}</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Section Title</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => handleSectionChange(i, 'title', e.target.value)} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500" 
                  placeholder={`Section ${i+1} Title`} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Section Content</label>
                <textarea 
                  rows={3} 
                  value={section.content} 
                  onChange={(e) => handleSectionChange(i, 'content', e.target.value)} 
                  className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500" 
                  placeholder={`Section ${i+1} Content`} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Email</label>
        <input type="email" value={termsData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-green-500" />
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button type="submit" disabled={saving} className="bg-green-600 text-white px-6 py-2.5 rounded hover:bg-green-700 disabled:opacity-50 transition-all">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default TermsOfServiceEditor;
