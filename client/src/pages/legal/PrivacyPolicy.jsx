import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Share2, 
  UserCheck, 
  Mail, 
  CheckCircle 
} from 'lucide-react';
import content from "../../content/siteContent.json";
import Seo from "../../components/seo/Seo";

export default function PrivacyPolicy() {
  const c = content;
  // Fallback for SEO data
  const seoTitle = c?.seo?.privacy?.title || "Privacy Policy - JASIQ Labs";
  const seoDesc = c?.seo?.privacy?.description || "Learn how JASIQ Labs collects and protects your data.";

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section (Blue Gradient for Trust) --- */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-6">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We value your trust. This policy explains how we collect, safeguard, and use your information.
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium italic">
              Last Updated: January 7, 2025
            </p>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="container mx-auto px-4 max-w-4xl -mt-8">

          {/* 1. Key Takeaways (Summary Box) */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-green-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">Privacy at a Glance</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">We do <strong>not</strong> sell your personal data.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">We only collect info needed to provide services.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">Your data is secured with industry standards.</p>
              </div>
            </div>
          </div>

          {/* 2. Introduction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
            <p className="text-gray-600 leading-relaxed">
              This Privacy Policy explains how <strong>JASIQ Labs</strong> ("we," "our," or "us") collects, uses, 
              discloses, and safeguards your information when you visit our website or use our services. 
              If you have questions about this policy, please contact us via our Contact page.
            </p>
          </div>

          {/* 3. Information We Collect */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {["Contact info (name, email, phone)", "Professional info (job title, company)", "Communication preferences", "Any other info you choose to provide"].map((item, index) => (
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
              {[
                "Provide, operate, and maintain our services",
                "Process and respond to your inquiries and requests",
                "Send you technical notices, updates, and support messages",
                "Improve our website and services",
                "Monitor and analyze usage and trends"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Sharing & Security Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Sharing */}
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

            {/* Security */}
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
              href="mailto:privacy@jasiqlabs.com" 
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              privacy@jasiqlabs.com
            </a>
          </div>

        </div>
      </div>
    </>
  );
}


