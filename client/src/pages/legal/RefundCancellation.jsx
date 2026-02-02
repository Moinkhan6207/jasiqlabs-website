import React, { useState, useEffect } from 'react';
import { 
  RefreshCcw, Clock, CreditCard, Mail, CheckCircle, AlertCircle, FileText, Loader2
} from 'lucide-react';
import Seo from "../../components/seo/Seo";
import { pageContent } from "../../services/api";

export default function RefundCancellation() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Safe Fallback Content (Default Hardcoded)
  const defaultContent = {
    title: "Refund & Cancellation",
    lastUpdated: "January 7, 2025",
    intro: "We strive to provide the best service. Here is how we handle cancellations and refunds transparently.",
    policyHighlights: [
      "Cancel within 24 hours of payment.",
      "Refunds processed in 5-7 working days.",
      "Transparent communication is our priority."
    ],
    cancellationRules: [
      "You may cancel your enrollment or service request within 24 hours of placing the order.",
      "Cancellations requested after the service/batch has started may not be eligible for a full refund.",
      "Any exceptions to these rules will be communicated transparently by our support team."
    ],
    refundProcessText: "Once a cancellation is approved, we initiate the refund immediately. Here is what you can expect:",
    refundTimeline: "Refunds are typically processed within 5-7 working days.",
    refundMethod: "The amount will be credited back to the original payment source used.",
    contactText: "For any refund or cancellation requests, please contact us with your Order ID."
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContent.get('legal_refund', 'content');
        
        let validData = null;
        if (res?.data?.content) validData = res.data.content;
        else if (res?.content) validData = res.content;
        
        if (validData) {
          setDbData(validData);
        }
      } catch (error) {
        console.error('Error fetching refund policy:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // 2. Safe Merge Logic
  const content = {
    title: dbData?.title || defaultContent.title,
    lastUpdated: dbData?.lastUpdated || defaultContent.lastUpdated,
    intro: dbData?.intro || defaultContent.intro,
    policyHighlights: (dbData?.policyHighlights?.length > 0) ? dbData.policyHighlights : defaultContent.policyHighlights,
    cancellationRules: (dbData?.cancellationRules?.length > 0) ? dbData.cancellationRules : defaultContent.cancellationRules,
    refundProcessText: dbData?.refundProcessText || defaultContent.refundProcessText,
    refundTimeline: dbData?.refundTimeline || defaultContent.refundTimeline,
    refundMethod: dbData?.refundMethod || defaultContent.refundMethod,
    contactText: dbData?.contactText || defaultContent.contactText
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
            <span className="text-gray-600">Loading Policy...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${content.title} - JASIQ Labs`} description="Read our refund and cancellation policy." />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section --- */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-6">
              <RefreshCcw className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {content.intro}
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium italic">
              Last Updated: {content.lastUpdated}
            </p>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="container mx-auto px-4 max-w-4xl -mt-8">

          {/* 1. Policy Highlights */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-teal-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl font-bold text-gray-900">Policy Highlights</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               {/* Mapping first 3 highlights to icons manually for layout */}
               {content.policyHighlights[0] && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{content.policyHighlights[0]}</p>
                  </div>
               )}
               {content.policyHighlights[1] && (
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{content.policyHighlights[1]}</p>
                  </div>
               )}
               {content.policyHighlights[2] && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{content.policyHighlights[2]}</p>
                  </div>
               )}
            </div>
          </div>

          {/* 2. Cancellation Rules */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">1. Cancellation Rules</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-100">
              <ul className="space-y-4">
                {content.cancellationRules.map((rule, index) => (
                  rule && (
                    <li key={index} className="flex items-start gap-3 text-gray-700">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">{index + 1}</span>
                      <span>{rule}</span>
                    </li>
                  )
                ))}
              </ul>
            </div>
          </div>

          {/* 3. Refund Process */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">2. Refund Process</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.refundProcessText}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" /> Timeline
                </h4>
                <p className="text-sm text-gray-600">{content.refundTimeline}</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-teal-500" /> Method
                </h4>
                <p className="text-sm text-gray-600">{content.refundMethod}</p>
              </div>
            </div>
          </div>

          {/* 4. Contact Footer */}
          <div className="bg-teal-50 rounded-xl p-8 text-center border border-teal-100">
            <Mail className="w-8 h-8 text-teal-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Need to Cancel?</h2>
            <p className="text-gray-600 mb-4">
              {content.contactText}
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
            >
              Go to Contact Page
            </a>
          </div>

        </div>
      </div>
    </>
  );
}