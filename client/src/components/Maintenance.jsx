import React from 'react';
import { Wrench, Clock } from 'lucide-react';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-6">
            <Wrench className="w-12 h-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Site Under Maintenance
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're currently performing some scheduled maintenance to improve your experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">What's happening?</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Our team is working hard to bring you exciting new features and improvements. 
            This temporary downtime is necessary to ensure everything runs smoothly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-semibold">🚀</span>
              </div>
              <p className="text-sm text-gray-600">New Features</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-semibold">⚡</span>
              </div>
              <p className="text-sm text-gray-600">Performance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-semibold">🔒</span>
              </div>
              <p className="text-sm text-gray-600">Security</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-sm text-orange-800">
            <strong>Admin Access:</strong> If you're an administrator, you can still access the admin panel 
            to manage the site during this maintenance period.
          </p>
        </div>

        <div className="mt-8">
          <p className="text-sm text-gray-500">
            We expect to be back online shortly. Thank you for your patience!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
