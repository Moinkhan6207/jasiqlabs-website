import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const TermsConditionsEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Structured State for Terms Page
  const [termsData, setTermsData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    agreementSummary: '', // The summary box text
    acceptanceText: '',   // Section 1 Text
    ipRightsText: '',     // Section 2 Text
    userResponsibilities: ['', '', '', '', ''], // 5 Points List
    liabilityText: '',    // Section 4 Intro Text
    liabilityPoints: ['', '', ''], // 3 Points List
    contactEmail: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_terms', 'content');
        
        if (data?.data) {
          // Helper to ensure arrays exist and have correct length
          const safeList = (arr, size) => {
            const newArr = arr && Array.isArray(arr) ? [...arr] : [];
            while (newArr.length < size) newArr.push('');
            return newArr.slice(0, size);
          };

          setTermsData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            agreementSummary: data.data.agreementSummary || '',
            acceptanceText: data.data.acceptanceText || '',
            ipRightsText: data.data.ipRightsText || '',
            userResponsibilities: safeList(data.data.userResponsibilities, 5),
            liabilityText: data.data.liabilityText || '',
            liabilityPoints: safeList(data.data.liabilityPoints, 3),
            contactEmail: data.data.contactEmail || ''
          });
        }
      } catch (err) { 
        toast.error('Failed to load Terms'); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setTermsData(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (listName, index, value) => {
    setTermsData(prev => {
      const newList = [...prev[listName]];
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Filter out empty list items before saving
      const payload = {
        pageName: 'legal_terms',
        sectionKey: 'content',
        content: {
          ...termsData,
          userResponsibilities: termsData.userResponsibilities.filter(i => i.trim() !== ''),
          liabilityPoints: termsData.liabilityPoints.filter(i => i.trim() !== '')
        }
      };
      
      await pageContent.update(payload);
      toast.success('Terms & Conditions Updated!');
    } catch (err) { 
      toast.error('Save failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Terms Editor...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
      <div className="bg-purple-50 p-4 rounded-md text-sm text-purple-800 border border-purple-100">
        <strong>Terms & Conditions Editor:</strong> Structured Mode. Fill in the fields below to update the specific sections on the website.
      </div>

      {/* Header Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={termsData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-purple-500" placeholder="Terms of Service" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={termsData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-purple-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction (Hero Text)</label>
        <textarea rows={2} value={termsData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-purple-500" placeholder="Welcome to JASIQ Labs..." />
      </div>

      {/* Section 1: Agreement Summary */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">Agreement Summary Box</h3>
        <label className="block text-xs font-medium text-gray-500 mb-1">Summary Text</label>
        <textarea rows={2} value={termsData.agreementSummary} onChange={(e) => handleChange('agreementSummary', e.target.value)} className="w-full border p-2 rounded" placeholder="By accessing our website..." />
      </div>

      {/* Section 2 & 3: Acceptance & IP Rights */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">1. Acceptance of Terms Text</label>
          <textarea rows={4} value={termsData.acceptanceText} onChange={(e) => handleChange('acceptanceText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">2. IP Rights Text</label>
          <textarea rows={4} value={termsData.ipRightsText} onChange={(e) => handleChange('ipRightsText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded" />
        </div>
      </div>

      {/* Section 4: User Responsibilities List */}
      <div className="bg-gray-50 p-5 rounded border">
        <h3 className="font-bold text-gray-800 mb-3">3. User Responsibilities (List)</h3>
        <div className="space-y-3">
          {termsData.userResponsibilities.map((item, i) => (
            <input key={i} type="text" value={item} onChange={(e) => handleListChange('userResponsibilities', i, e.target.value)} className="w-full border border-gray-300 p-2 rounded" placeholder={`Responsibility ${i+1}`} />
          ))}
        </div>
      </div>

      {/* Section 5: Limitation of Liability */}
      <div className="bg-gray-50 p-5 rounded border">
        <h3 className="font-bold text-gray-800 mb-3">4. Limitation of Liability</h3>
        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 mb-1">Intro Text</label>
            <textarea rows={2} value={termsData.liabilityText} onChange={(e) => handleChange('liabilityText', e.target.value)} className="w-full border p-2 rounded" placeholder="We shall not be liable..." />
        </div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Liability Points (List)</label>
        <div className="space-y-3">
          {termsData.liabilityPoints.map((item, i) => (
            <input key={i} type="text" value={item} onChange={(e) => handleListChange('liabilityPoints', i, e.target.value)} className="w-full border border-gray-300 p-2 rounded" placeholder={`Liability Point ${i+1}`} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Email</label>
        <input type="email" value={termsData.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-purple-500" placeholder="legal@jasiqlabs.com" />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 shadow-md">
          {saving ? 'Saving...' : 'Save Terms Changes'}
        </button>
      </div>
    </form>
  );
};
export default TermsConditionsEditor;