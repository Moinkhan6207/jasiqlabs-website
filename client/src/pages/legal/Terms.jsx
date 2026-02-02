import React, { useState, useEffect } from 'react';
import { 
  FileText, Check, Shield, AlertCircle, Scale, Mail, Users, Cpu, Loader2 
} from 'lucide-react';
import Seo from "../../components/seo/Seo";
import { pageContent } from "../../services/api";

export default function Terms() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Default Hardcoded Content (Safe Fallback)
  const defaultContent = {
    title: "Terms of Service",
    lastUpdated: "January 7, 2025",
    intro: "Welcome to JASIQ Labs. These terms outline the rules and regulations for the use of our website and services.",
    agreementSummary: "By accessing our website, you agree to these terms. If you do not agree, please discontinue use of our services immediately.",
    acceptanceText: "By accessing or using any part of the website, you agree to become bound by these terms and conditions. These Terms apply to all visitors, users, and others who access or use the Service.",
    ipRightsText: "The content on our website, including text, graphics, images, logos, and software, is the property of JASIQ Labs and is protected by intellectual property laws.",
    userResponsibilities: [
      "Provide accurate and complete information",
      "Maintain the confidentiality of your account credentials",
      "Not use the website for any illegal or unauthorized purpose",
      "Not interfere with or disrupt the website or servers",
      "Comply with all applicable local and international laws"
    ],
    liabilityText: "JASIQ Labs shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from:",
    liabilityPoints: [
      "Your access to or use of or inability to access or use the service.",
      "Any conduct or content of any third party on the service.",
      "Unauthorized access, use, or alteration of your transmissions or content."
    ],
    contactEmail: "legal@jasiqlabs.com"
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContent.get('legal_terms', 'content');
        
        // Smart Check for Data Structure
        let validData = null;
        if (res?.data?.content) validData = res.data.content; // Nested case
        else if (res?.content) validData = res.content;       // Direct case
        
        if (validData) {
          setDbData(validData);
        }
      } catch (error) {
        console.error('Error fetching terms:', error);
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
    agreementSummary: dbData?.agreementSummary || defaultContent.agreementSummary,
    acceptanceText: dbData?.acceptanceText || defaultContent.acceptanceText,
    ipRightsText: dbData?.ipRightsText || defaultContent.ipRightsText,
    // Arrays: Check length > 0
    userResponsibilities: (dbData?.userResponsibilities?.length > 0) ? dbData.userResponsibilities : defaultContent.userResponsibilities,
    liabilityText: dbData?.liabilityText || defaultContent.liabilityText,
    liabilityPoints: (dbData?.liabilityPoints?.length > 0) ? dbData.liabilityPoints : defaultContent.liabilityPoints,
    contactEmail: dbData?.contactEmail || defaultContent.contactEmail
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <span className="text-gray-600">Loading Terms...</span>
         </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${content.title} - JASIQ Labs`} description="Read our terms of service." />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section --- */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-6">
              <Scale className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
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

          {/* 1. Agreement Summary */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-purple-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">Agreement Summary</h3>
            </div>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {content.agreementSummary}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100">Legal Contract</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100">Intellectual Property</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-100">User Rules</span>
            </div>
          </div>

          {/* 2. Acceptance of Terms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Check className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {content.acceptanceText}
            </p>
          </div>

          {/* 3. Intellectual Property Rights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">2. Intellectual Property Rights</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.ipRightsText}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300 text-sm text-gray-600">
              <strong>Note:</strong> You may not reproduce, distribute, or create derivative works without our express written permission.
            </div>
          </div>

          {/* 4. User Responsibilities (Dynamic List) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">3. User Responsibilities</h2>
            </div>
            <p className="text-gray-600 mb-4">When using our website, you explicitly agree to:</p>
            <ul className="grid md:grid-cols-1 gap-3">
              {content.userResponsibilities.map((item, index) => (
                item && (
                  <li key={index} className="flex items-start gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                )
              ))}
            </ul>
          </div>

          {/* 5. Limitation of Liability */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">4. Limitation of Liability</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.liabilityText}
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-purple-500">
              {content.liabilityPoints.map((item, index) => (
                item && <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* 6. Contact Footer */}
          <div className="bg-purple-50 rounded-xl p-8 text-center border border-purple-100">
            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Questions about Terms?</h2>
            <p className="text-gray-600 mb-4">
              Contact us at:
            </p>
            <a 
              href={`mailto:${content.contactEmail}`}
              className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
            >
              {content.contactEmail}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}