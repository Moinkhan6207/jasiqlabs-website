import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const DisclaimerEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Structured State for Disclaimer
  const [disclaimerData, setDisclaimerData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    importantNoticeText: '',      // Section 1
    noWarrantyText: '',           // Section 2
    professionalDisclaimerText: '', // Section 3
    externalLinksText: '',        // Section 4 (Left)
    errorsText: '',               // Section 4 (Right)
    fairUseText: '',              // Section 5
    contactEmail: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_disclaimer', 'content');
        
        if (data?.data) {
          setDisclaimerData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            importantNoticeText: data.data.importantNoticeText || '',
            noWarrantyText: data.data.noWarrantyText || '',
            professionalDisclaimerText: data.data.professionalDisclaimerText || '',
            externalLinksText: data.data.externalLinksText || '',
            errorsText: data.data.errorsText || '',
            fairUseText: data.data.fairUseText || '',
            contactEmail: data.data.contactEmail || ''
          });
        }
      } catch (err) { 
        toast.error('Failed to load Disclaimer'); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setDisclaimerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        pageName: 'legal_disclaimer',
        sectionKey: 'content',
        content: disclaimerData
      };
      
      await pageContent.update(payload);
      toast.success('Disclaimer Updated!');
    } catch (err) { 
      toast.error('Save failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Disclaimer Editor...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
      <div className="bg-amber-50 p-4 rounded-md text-sm text-amber-800 border border-amber-100">
        <strong>Disclaimer Editor:</strong> Structured Mode.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={disclaimerData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-amber-500" placeholder="Legal Disclaimer" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={disclaimerData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-amber-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction</label>
        <textarea rows={2} value={disclaimerData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-amber-500" />
      </div>

      {/* Main Sections */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-4">Main Content Sections</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">1. Important Notice (Summary Box)</label>
            <textarea rows={3} value={disclaimerData.importantNoticeText} onChange={(e) => handleChange('importantNoticeText', e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">2. No Warranty Text</label>
            <textarea rows={3} value={disclaimerData.noWarrantyText} onChange={(e) => handleChange('noWarrantyText', e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">3. Professional Disclaimer Text</label>
            <textarea rows={3} value={disclaimerData.professionalDisclaimerText} onChange={(e) => handleChange('professionalDisclaimerText', e.target.value)} className="w-full border border-gray-300 p-2 rounded" />
          </div>
        </div>
      </div>

      {/* Grid Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">4. External Links Disclaimer</label>
          <textarea rows={4} value={disclaimerData.externalLinksText} onChange={(e) => handleChange('externalLinksText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Errors & Omissions Disclaimer</label>
          <textarea rows={4} value={disclaimerData.errorsText} onChange={(e) => handleChange('errorsText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">5. Fair Use Disclaimer</label>
        <textarea rows={3} value={disclaimerData.fairUseText} onChange={(e) => handleChange('fairUseText', e.target.value)} className="w-full border border-gray-300 p-3 rounded" />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Email</label>
        <input type="email" value={disclaimerData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-amber-500" />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 shadow-md">
          {saving ? 'Saving...' : 'Save Disclaimer'}
        </button>
      </div>
    </form>
  );
};
export default DisclaimerEditor;