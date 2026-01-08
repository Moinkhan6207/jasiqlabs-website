import React from 'react';
import { 
  RefreshCcw, 
  Clock, 
  CreditCard, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import content from "../../content/siteContent.json";
import Seo from "../../components/seo/Seo";

export default function RefundCancellation() {
  const c = content;
  // Fallback SEO
  const seoTitle = c?.seo?.refund?.title || "Refund & Cancellation Policy - JASIQ Labs";
  const seoDesc = c?.seo?.refund?.description || "Read our refund and cancellation policy details.";

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} />
      
      <div className="min-h-screen bg-gray-50 font-sans pb-20">
        
        {/* --- Header Section (Teal Gradient for Finance/Trust) --- */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-teal-100">
          <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
            <div className="inline-flex items-center justify-center p-3 bg-teal-100 rounded-full mb-6">
              <RefreshCcw className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Refund & Cancellation
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We strive to provide the best service. Here is how we handle cancellations and refunds transparently.
            </p>
            <p className="text-sm text-gray-500 mt-6 font-medium italic">
              Last Updated: January 7, 2025
            </p>
          </div>
        </div>

        {/* --- Main Content Area --- */}
        <div className="container mx-auto px-4 max-w-4xl -mt-8">

          {/* 1. Policy Highlights (Summary Box) */}
          <div className="bg-white rounded-xl shadow-lg border-l-4 border-teal-500 p-8 mb-8 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-teal-600" />
              <h3 className="text-xl font-bold text-gray-900">Policy Highlights</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">Cancel within <strong>24 hours</strong> of payment.</p>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">Refunds processed in <strong>5-7 working days</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm">Transparent communication is our priority.</p>
              </div>
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
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">1</span>
                  <span>You may cancel your enrollment or service request within <strong>24 hours</strong> of placing the order.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Cancellations requested after the service/batch has started may not be eligible for a full refund.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Any exceptions to these rules will be communicated transparently by our support team.</span>
                </li>
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
              Once a cancellation is approved, we initiate the refund immediately. Here is what you can expect:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-500" /> Timeline
                </h4>
                <p className="text-sm text-gray-600">Refunds are typically processed within 5-7 working days.</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-teal-500" /> Method
                </h4>
                <p className="text-sm text-gray-600">The amount will be credited back to the original payment source used.</p>
              </div>
            </div>
          </div>

          {/* 4. Contact Footer */}
          <div className="bg-teal-50 rounded-xl p-8 text-center border border-teal-100">
            <Mail className="w-8 h-8 text-teal-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Need to Cancel?</h2>
            <p className="text-gray-600 mb-4">
              For any refund or cancellation requests, please contact us with your <strong>Order ID</strong>.
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