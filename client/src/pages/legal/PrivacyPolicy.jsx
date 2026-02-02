import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Eye, Database, Share2, UserCheck, Mail, CheckCircle, Loader2 
} from 'lucide-react';
import Seo from "../../components/seo/Seo";
import { pageContent } from "../../services/api";

export default function PrivacyPolicy() {
  const [dbData, setDbData] = useState(null); 
  const [loading, setLoading] = useState(true);

  // 1. Default Content (Updated to include Green Box defaults)
  const defaultContent = {
    title: "Privacy Policy",
    lastUpdated: "January 7, 2025",
    intro: "This Privacy Policy explains how <strong>JASIQ Labs</strong> (\"we,\" \"our,\" or \"us\") collects, uses, discloses, and safeguards your information.",
    // 🟢 NEW: Default Green Box Points
    privacyGlance: [
      "We do not sell your personal data.",
      "We only collect info needed to provide services.",
      "Your data is secured with industry standards."
    ],
    collectionList: [
      "Contact info (name, email, phone)",
      "Professional info (job title, company)",
      "Communication preferences",
      "Any other info you choose to provide"
    ],
    usageList: [
      "Provide, operate, and maintain our services",
      "Process and respond to your inquiries",
      "Send you technical notices and updates",
      "Improve our website and services",
      "Monitor and analyze usage and trends"
    ],
    contactEmail: "privacy@jasiqlabs.com"
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContent.get('legal_privacy', 'content');
        let validData = null;
        if (res?.data?.content) validData = res.data.content;
        else if (res?.content) validData = res.content;
        else if (res?.title) validData = res;
        
        if (validData) {
          setDbData(validData);
        }
      } catch (error) {
        console.error('Error fetching privacy policy:', error);
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
    // 🟢 NEW: Merge Green Box Points
    privacyGlance: (dbData?.privacyGlance?.length > 0) ? dbData.privacyGlance : defaultContent.privacyGlance,
    collectionList: (dbData?.collectionList?.length > 0) ? dbData.collectionList : defaultContent.collectionList,
    usageList: (dbData?.usageList?.length > 0) ? dbData.usageList : defaultContent.usageList,
    contactEmail: dbData?.contactEmail || defaultContent.contactEmail
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
           <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
           <span className="text-gray-600">Loading Policy...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={content.title} description="Learn how JASIQ Labs collects and protects your data." />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section --- */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We value your trust. This policy explains how we collect, safeguard, and use your information.
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium italic">
              Last Updated: {content.lastUpdated}
            </p>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="container mx-auto px-4 max-w-4xl -mt-8">

          {/* 1. Key Takeaways (Now Dynamic!) */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Privacy at a Glance</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.privacyGlance.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div 
              className="text-gray-600 leading-relaxed prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: content.intro }}
            />
          </div>

          {/* 3. Information We Collect */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {content.collectionList.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. How We Use Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Info</h2>
            </div>
            <ul className="space-y-3">
              {content.usageList.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Sharing & Security (Static) */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Sharing & Disclosure</h2>
              </div>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                We do <strong>not</strong> sell, trade, or rent your personal information. We may share with:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                <li>Service providers (hosting, analytics)</li>
                <li>Business partners (collaborations)</li>
                <li>Legal authorities (if required by law)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">Data Security</h2>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information.
              </p>
              <p className="text-gray-500 text-xs mt-4 italic">
                Note: No method of transmission over the Internet is 100% secure.
              </p>
            </div>
          </div>

          {/* 6. Your Rights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information, 
              including the right to access, correct, or delete your data. We may update this policy periodically 
              and will notify you of any changes here.
            </p>
          </div>

          {/* 7. Contact Footer */}
          <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
            <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Privacy Concerns?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <a 
              href={`mailto:${content.contactEmail}`} 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {content.contactEmail}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}