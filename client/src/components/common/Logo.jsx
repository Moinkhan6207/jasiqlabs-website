import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ collapsed = false, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Link to="/">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
            J
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              JasiqLabs
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Logo;
