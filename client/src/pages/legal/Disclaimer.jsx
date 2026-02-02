import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, ShieldAlert, Briefcase, ExternalLink, FileWarning, Scale, Mail, Info, Loader2
} from 'lucide-react';
import Seo from "../../components/seo/Seo";
import { pageContent } from "../../services/api";

export default function Disclaimer() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Safe Fallback Content (Default Hardcoded)
  const defaultContent = {
    title: "Legal Disclaimer",
    lastUpdated: "January 7, 2025",
    intro: "Please read this information carefully regarding the use of our website and services.",
    importantNoticeText: "The information provided on the JASIQ Labs website is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty regarding the accuracy or completeness of any information on the site.",
    noWarrantyText: "The information is provided by JASIQ Labs and while we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website.",
    professionalDisclaimerText: "The information contained on this website is not intended as, and shall not be understood or construed as, professional advice. While the information provided relates to legal, financial, or other professional matters, the information is not intended as professional advice.",
    externalLinksText: "The website may contain links to external websites that are not provided or maintained by JASIQ Labs. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.",
    errorsText: "While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, JASIQ Labs is not responsible for any errors or omissions or for the results obtained from the use of this information.",
    fairUseText: "This website may contain copyrighted material not specifically authorized by the copyright owner. We make such material available to advance understanding of technology and business.",
    contactEmail: "legal@jasiqlabs.com"
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContent.get('legal_disclaimer', 'content');
        
        let validData = null;
        if (res?.data?.content) validData = res.data.content;
        else if (res?.content) validData = res.content;
        
        if (validData) {
          setDbData(validData);
        }
      } catch (error) {
        console.error('Error fetching disclaimer:', error);
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
    importantNoticeText: dbData?.importantNoticeText || defaultContent.importantNoticeText,
    noWarrantyText: dbData?.noWarrantyText || defaultContent.noWarrantyText,
    professionalDisclaimerText: dbData?.professionalDisclaimerText || defaultContent.professionalDisclaimerText,
    externalLinksText: dbData?.externalLinksText || defaultContent.externalLinksText,
    errorsText: dbData?.errorsText || defaultContent.errorsText,
    fairUseText: dbData?.fairUseText || defaultContent.fairUseText,
    contactEmail: dbData?.contactEmail || defaultContent.contactEmail
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            <span className="text-gray-600">Loading Disclaimer...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${content.title} - JASIQ Labs`} description="Legal Disclaimer" />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section --- */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
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

          {/* 1. Important Notice Box */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-amber-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">Important Notice</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {content.importantNoticeText}
            </p>
          </div>

          {/* 2. No Warranty Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-800">No Warranty</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {content.noWarrantyText}
            </p>
          </div>

          {/* 3. Professional Disclaimer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-800">Professional Disclaimer</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {content.professionalDisclaimerText}
            </p>
          </div>

          {/* 4. Grid Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
              <div className="flex items-center gap-3 mb-4">
                <ExternalLink className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">External Links</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                {content.externalLinksText}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
              <div className="flex items-center gap-3 mb-4">
                <FileWarning className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">Errors & Omissions</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                {content.errorsText}
              </p>
            </div>
          </div>

          {/* 5. Fair Use Disclaimer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-800">Fair Use Disclaimer</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {content.fairUseText}
            </p>
          </div>

          {/* 6. Contact Section */}
          <div className="bg-gray-100 rounded-xl p-8 text-center border border-gray-200">
            <Mail className="w-8 h-8 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Have Questions?</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Disclaimer, please contact us at:
            </p>
            <a 
              href={`mailto:${content.contactEmail}`}
              className="inline-block text-blue-600 font-semibold hover:text-blue-800 hover:underline transition-colors"
            >
              {content.contactEmail}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}