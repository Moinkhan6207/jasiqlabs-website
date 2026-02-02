import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { pageContent } from '../../../services/api';

const RefundPolicyEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Structured State for Refund Policy
  const [refundData, setRefundData] = useState({
    title: '',
    lastUpdated: '',
    intro: '',
    policyHighlights: ['', '', ''], // 3 Summary Points
    cancellationRules: ['', '', ''], // 3 Rules List
    refundProcessText: '',
    refundTimeline: '', // "5-7 days" text
    refundMethod: '',   // "Source payment" text
    contactText: ''     // Footer text
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { data } = await pageContent.get('legal_refund', 'content');
        
        if (data?.data) {
          const safeList = (arr, size) => {
            const newArr = arr && Array.isArray(arr) ? [...arr] : [];
            while (newArr.length < size) newArr.push('');
            return newArr.slice(0, size);
          };

          setRefundData({
            title: data.data.title || '',
            lastUpdated: data.data.lastUpdated || '',
            intro: data.data.intro || '',
            policyHighlights: safeList(data.data.policyHighlights, 3),
            cancellationRules: safeList(data.data.cancellationRules, 3),
            refundProcessText: data.data.refundProcessText || '',
            refundTimeline: data.data.refundTimeline || '',
            refundMethod: data.data.refundMethod || '',
            contactText: data.data.contactText || ''
          });
        }
      } catch (err) { 
        toast.error('Failed to load Refund Policy'); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  const handleChange = (field, value) => {
    setRefundData(prev => ({ ...prev, [field]: value }));
  };

  const handleListChange = (listName, index, value) => {
    setRefundData(prev => {
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
        pageName: 'legal_refund',
        sectionKey: 'content',
        content: {
          ...refundData,
          policyHighlights: refundData.policyHighlights.filter(i => i.trim() !== ''),
          cancellationRules: refundData.cancellationRules.filter(i => i.trim() !== '')
        }
      };
      
      await pageContent.update(payload);
      toast.success('Refund Policy Updated!');
    } catch (err) { 
      toast.error('Save failed'); 
    } finally { 
      setSaving(false); 
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading Refund Editor...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6 animate-fadeIn">
      <div className="bg-teal-50 p-4 rounded-md text-sm text-teal-800 border border-teal-100">
        <strong>Refund Policy Editor:</strong> Structured Mode.
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Page Title</label>
          <input type="text" value={refundData.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-teal-500" placeholder="Refund & Cancellation" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Last Updated</label>
          <input type="text" value={refundData.lastUpdated} onChange={(e) => handleChange('lastUpdated', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-teal-500" placeholder="e.g. January 2026" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Introduction</label>
        <textarea rows={2} value={refundData.intro} onChange={(e) => handleChange('intro', e.target.value)} className="w-full border border-gray-300 p-3 rounded focus:ring-2 focus:ring-teal-500" placeholder="We strive to provide..." />
      </div>

      {/* Highlights */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">Policy Highlights (Top Box)</h3>
        {refundData.policyHighlights.map((item, i) => (
          <input key={i} type="text" value={item} onChange={(e) => handleListChange('policyHighlights', i, e.target.value)} className="w-full border p-2 rounded mb-2" placeholder={`Highlight ${i+1}`} />
        ))}
      </div>

      {/* Cancellation Rules */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">1. Cancellation Rules (List)</h3>
        {refundData.cancellationRules.map((item, i) => (
          <input key={i} type="text" value={item} onChange={(e) => handleListChange('cancellationRules', i, e.target.value)} className="w-full border p-2 rounded mb-2" placeholder={`Rule ${i+1}`} />
        ))}
      </div>

      {/* Refund Process */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-bold text-gray-800 mb-2">2. Refund Process</h3>
        <div className="mb-3">
           <label className="block text-xs font-medium text-gray-500 mb-1">Intro Text</label>
           <textarea rows={2} value={refundData.refundProcessText} onChange={(e) => handleChange('refundProcessText', e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Timeline Text</label>
              <input type="text" value={refundData.refundTimeline} onChange={(e) => handleChange('refundTimeline', e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. 5-7 days" />
           </div>
           <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Method Text</label>
              <input type="text" value={refundData.refundMethod} onChange={(e) => handleChange('refundMethod', e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. Original Source" />
           </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1 text-gray-700">Contact Footer Text</label>
        <textarea rows={2} value={refundData.contactText} onChange={(e) => handleChange('contactText', e.target.value)} className="w-full border border-gray-300 p-2.5 rounded focus:ring-2 focus:ring-teal-500" placeholder="For any requests contact..." />
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button type="submit" disabled={saving} className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 shadow-md">
          {saving ? 'Saving...' : 'Save Refund Policy'}
        </button>
      </div>
    </form>
  );
};
export default RefundPolicyEditor;