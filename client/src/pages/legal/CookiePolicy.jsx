import React, { useState, useEffect } from 'react';
import { Cookie, Shield, Settings, Info, CheckCircle, Loader2 } from 'lucide-react';
import Seo from "../../components/seo/Seo";
import { pageContent } from "../../services/api";

export default function CookiePolicy() {
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Safe Fallback Content (Default Hardcoded)
  const defaultContent = {
    title: "Cookie Policy",
    lastUpdated: "January 7, 2025",
    intro: "We believe in transparency. This policy explains how we use cookies to improve your experience.",
    summaryPoints: [
      "We use cookies to analyze website traffic.",
      "Essential cookies are needed for the site to work.",
      "You have full control to block or delete them."
    ],
    overviewText: "This website uses cookies and similar technologies to distinguish you from other users of our site. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.",
    analyticsText: "When analytics is enabled, we may track usage patterns to understand which pages are most valuable to our users.",
    essentialCookiesText: "Necessary for the website to function properly. The site cannot work without these.",
    analyticsCookiesText: "Help us understand how visitors interact with our website by collecting anonymous information.",
    preferenceCookiesText: "Remember your settings and preferences (like language or login status) for future visits.",
    managingPrefsText: "You can manage cookies through your browser settings. Most web browsers allow you to control cookies through their settings preferences."
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await pageContent.get('legal_cookie', 'content');
        
        let validData = null;
        if (res?.data?.content) validData = res.data.content;
        else if (res?.content) validData = res.content;
        
        if (validData) {
          setDbData(validData);
        }
      } catch (error) {
        console.error('Error fetching cookie policy:', error);
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
    summaryPoints: (dbData?.summaryPoints?.length > 0) ? dbData.summaryPoints : defaultContent.summaryPoints,
    overviewText: dbData?.overviewText || defaultContent.overviewText,
    analyticsText: dbData?.analyticsText || defaultContent.analyticsText,
    essentialCookiesText: dbData?.essentialCookiesText || defaultContent.essentialCookiesText,
    analyticsCookiesText: dbData?.analyticsCookiesText || defaultContent.analyticsCookiesText,
    preferenceCookiesText: dbData?.preferenceCookiesText || defaultContent.preferenceCookiesText,
    managingPrefsText: dbData?.managingPrefsText || defaultContent.managingPrefsText
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
      <Seo title={`${content.title} - JASIQ Labs`} description="Cookie Policy" />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section --- */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <Cookie className="w-8 h-8 text-blue-600" />
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
          
          {/* 1. Quick Summary Card */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-blue-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">At a Glance</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.summaryPoints.map((point, index) => (
                point && (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 text-sm">{point}</p>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* 2. Overview Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.overviewText}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {content.analyticsText}
            </p>
          </div>

          {/* 3. Types of Cookies Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Cookie className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Types of Cookies We Use</h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-1">Essential Cookies</h4>
                <p className="text-sm text-gray-600">{content.essentialCookiesText}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-1">Analytics Cookies</h4>
                <p className="text-sm text-gray-600">{content.analyticsCookiesText}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-1">Preference Cookies</h4>
                <p className="text-sm text-gray-600">{content.preferenceCookiesText}</p>
              </div>
            </div>
          </div>

          {/* 4. Your Control Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Managing Preferences</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              {content.managingPrefsText}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}