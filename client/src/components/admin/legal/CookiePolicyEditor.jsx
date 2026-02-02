import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const CookiePolicyEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Structured State for Cookie Policy
  const [cookieData, setCookieData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    summaryPoints: ['', '', ''], // At a Glance (3 Points)
    overviewText: '',            // Main Overview Paragraph
    analyticsText: '',           // Analytics specific text
    essentialCookiesText: '',    // Type 1 Description
    analyticsCookiesText: '',    // Type 2 Description
    preferenceCookiesText: '',   // Type 3 Description
    managingPrefsText: ''        // Footer/Management Text
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_cookie', 'content');
        
        if (data?.data) {
          const safeList = (arr, size) => {
            const newArr = arr && Array.isArray(arr) ? [...arr] : [];
            while (newArr.length < size) newArr.push('');
            return newArr.slice(0, size);
          };

          setCookieData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            summaryPoints: safeList(data.data.summaryPoints, 3),
            overviewText: data.data.overviewText || '',
            analyticsText: data.data.analyticsText || '',
            essentialCookiesText: data.data.essentialCookiesText || '',
            analyticsCookiesText: data.data.analyticsCookiesText || '',
            preferenceCookiesText: data.data.preferenceCookiesText || '',
            managingPrefsText: data.data.managingPrefsText || ''
          });
        }
      } catch (err) { 
        toast.error('Failed to load Cookie Policy'); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setCookieData(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (listName, index, value) => {
    setCookieData(prev => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pageName: 'legal_cookie',
        sectionKey: 'content',
        content: {
          ...cookieData,
          summaryPoints: cookieData.summaryPoints.filter(i => i.trim() !== '')
        }
      };
      
      await pageContent.update(payload);
      toast.success('Cookie Policy Updated!');
    } catch (err) { 
      toast.error('Save failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Cookie Editor...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-100">
        <strong>Cookie Policy Editor:</strong> Structured Mode.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={cookieData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" placeholder="Cookie Policy" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={cookieData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction</label>
        <textarea rows={2} value={cookieData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-500" placeholder="We use cookies to improve..." />
      </div>

      {/* Summary Points */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">At a Glance (Summary Box)</h3>
        {cookieData.summaryPoints.map((item, i) => (
          <input key={i} type="text" value={item} onChange={(e) => handleListChange('summaryPoints', i, e.target.value)} className="w-full border p-2 rounded mb-2" placeholder={`Key Point ${i+1}`} />
        ))}
      </div>

      {/* Overview */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">Overview Section</h3>
        <div className="space-y-3">
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Main Description</label>
             <textarea rows={3} value={cookieData.overviewText} onChange={(e) => handleChange('overviewText', e.target.value)} className="w-full border p-2 rounded" />
           </div>
           <div>
             <label className="block text-xs font-medium text-gray-500 mb-1">Analytics Note</label>
             <textarea rows={2} value={cookieData.analyticsText} onChange={(e) => handleChange('analyticsText', e.target.value)} className="w-full border p-2 rounded" />
           </div>
        </div>
      </div>

      {/* Cookie Types */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">Types of Cookies</h3>
        <div className="grid gap-4">
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Essential Cookies Description</label>
              <input type="text" value={cookieData.essentialCookiesText} onChange={(e) => handleChange('essentialCookiesText', e.target.value)} className="w-full border p-2 rounded" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Analytics Cookies Description</label>
              <input type="text" value={cookieData.analyticsCookiesText} onChange={(e) => handleChange('analyticsCookiesText', e.target.value)} className="w-full border p-2 rounded" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Preference Cookies Description</label>
              <input type="text" value={cookieData.preferenceCookiesText} onChange={(e) => handleChange('preferenceCookiesText', e.target.value)} className="w-full border p-2 rounded" />
           </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Managing Preferences (Footer Text)</label>
        <textarea rows={3} value={cookieData.managingPrefsText} onChange={(e) => handleChange('managingPrefsText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-blue-500" placeholder="You can manage cookies..." />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 shadow-md">
          {saving ? 'Saving...' : 'Save Cookie Policy'}
        </button>
      </div>
    </form>
  );
};
export default CookiePolicyEditor;