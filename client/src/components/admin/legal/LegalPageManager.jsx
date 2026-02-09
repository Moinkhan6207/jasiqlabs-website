import React, { useState } from 'react';
import PrivacyPolicyEditor from './PrivacyPolicyEditor';
import TermsConditionsEditor from './TermsConditionsEditor';
import RefundPolicyEditor from './RefundPolicyEditor';
import DisclaimerEditor from './DisclaimerEditor';
import CookiePolicyEditor from './CookiePolicyEditor';

const LegalPageManager = () => {
  const [activeTab, setActiveTab] = useState('legal_privacy');

  const legalPages = [
    { key: 'legal_privacy', label: 'Privacy Policy', name: 'Privacy Policy', component: PrivacyPolicyEditor },
    { key: 'legal_terms', label: 'Terms & Conditions', name: 'Terms & Conditions', component: TermsConditionsEditor },
    { key: 'legal_refund', label: 'Refund Policy', name: 'Refund Policy', component: RefundPolicyEditor },
    { key: 'legal_disclaimer', label: 'Disclaimer', name: 'Disclaimer', component: DisclaimerEditor },
    { key: 'legal_cookie', label: 'Cookie Policy', name: 'Cookie Policy', component: CookiePolicyEditor }
  ];

  const currentPage = legalPages.find(page => page.key === activeTab);

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="border-b border-gray-200">
        {/* Mobile Dropdown */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {legalPages.map((page) => (
              <option key={page.key} value={page.key}>
                {page.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Desktop Tabs */}
        <nav className="hidden sm:block -mb-px">
          <div className="flex flex-wrap gap-2 sm:gap-8">
            {legalPages.map((page) => (
              <button
                key={page.key}
                type="button"
                onClick={() => setActiveTab(page.key)}
                className={`py-2 px-1 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === page.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Render Active Component */}
      <currentPage.component />
    </div>
  );
};

export default LegalPageManager;
