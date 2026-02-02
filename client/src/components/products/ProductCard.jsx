import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function ProductCard({ product }) {
  const statusColors = {
    Live: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    MVP: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    Research: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    Active: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    Beta: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    ComingSoon: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
  };

  const status = statusColors[product.status] || statusColors.default;

  return (
    <div className="group relative h-full flex flex-col overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span 
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.border} border`}
        >
          {product.status}
        </span>
      </div>
      
      {/* Product Image/Icon */}
      <div className="h-48 bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center p-6">
        {product.icon ? (
          <img 
            src={product.icon} 
            alt={product.name}
            className="h-20 w-20 object-contain"
          />
        ) : (
          <div className="h-20 w-20 rounded-full bg-white shadow-inner flex items-center justify-center">
            <svg className="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        )}
      </div>
      
      {/* Product Content */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {product.shortDesc}
          </p>
          
          {product.target && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 font-medium">Target Audience</p>
              <p className="text-sm text-gray-700">{product.target}</p>
            </div>
          )}
        </div>
        
        {/* CTA Button */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link 
            to={`/products/${product.id}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium group-hover:translate-x-1 transition-transform"
          >
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}




