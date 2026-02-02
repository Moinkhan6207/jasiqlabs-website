import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const PrivacyPolicyEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [privacyData, setPrivacyData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    privacyGlance: ['', '', ''], // 🟢 NEW: Green Box Points
    collectionList: ['', '', '', ''],
    usageList: ['', '', '', ''],
    contactEmail: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_privacy', 'content');
        
        if (data?.data) {
          const safeList = (arr, size) => {
            const newArr = arr && Array.isArray(arr) ? [...arr] : [];
            while (newArr.length < size) newArr.push('');
            return newArr.slice(0, size);
          };

          setPrivacyData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            privacyGlance: safeList(data.data.privacyGlance, 3), // 🟢 Load Green Box Data
            collectionList: safeList(data.data.collectionList, 4),
            usageList: safeList(data.data.usageList, 4),
            contactEmail: data.data.contactEmail || ''
          });
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to load privacy policy');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setPrivacyData(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (listName, index, value) => {
    setPrivacyData(prev => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pageName: 'legal_privacy',
        sectionKey: 'content',
        content: {
          ...privacyData,
          privacyGlance: privacyData.privacyGlance.filter(i => i.trim() !== ''),
          collectionList: privacyData.collectionList.filter(i => i.trim() !== ''),
          usageList: privacyData.usageList.filter(i => i.trim() !== '')
        }
      };
      await pageContent.update(payload);
      toast.success('Privacy Policy Updated!');
    } catch (error) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Privacy Editor...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-100">
        <strong>Privacy Policy Editor:</strong> Edit all sections including the "At a Glance" box.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={privacyData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={privacyData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      {/* 🟢 NEW SECTION: Privacy At a Glance */}
      <div className="bg-green-50 p-4 rounded border border-green-200">
        <h3 className="font-bold mb-2 text-green-800">Privacy at a Glance (Green Box)</h3>
        <div className="space-y-2">
          {privacyData.privacyGlance.map((item, i) => (
            <input 
              key={i} 
              type="text" 
              value={item} 
              onChange={(e) => handleListChange('privacyGlance', i, e.target.value)} 
              className="w-full border border-green-300 p-2 rounded focus:ring-2 focus:ring-green-500" 
              placeholder={`Key Point ${i+1}`} 
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction</label>
        <textarea rows={4} value={privacyData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold mb-2 text-gray-700">Information We Collect</h3>
          {privacyData.collectionList.map((item, i) => (
            <input key={i} type="text" value={item} onChange={(e) => handleListChange('collectionList', i, e.target.value)} className="w-full border border-gray-300 p-2 rounded mb-2" placeholder={`Point ${i+1}`} />
          ))}
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-bold mb-2 text-gray-700">How We Use Info</h3>
          {privacyData.usageList.map((item, i) => (
            <input key={i} type="text" value={item} onChange={(e) => handleListChange('usageList', i, e.target.value)} className="w-full border border-gray-300 p-2 rounded mb-2" placeholder={`Point ${i+1}`} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Email</label>
        <input type="email" value={privacyData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" />
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded hover:bg-blue-700 disabled:opacity-50 transition-all">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default PrivacyPolicyEditor;