import { Helmet } from "react-helmet-async";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Mail } from "lucide-react";
import { publicApi } from "../../services/api";
import { toast } from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const features =
    product?.detail?.features ||
    product?.features ||
    product?.metadata?.features ||
    [];

  const fullDescription = product?.metadata?.fullDescription || '';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await publicApi.getProductById(id);
        setProduct(response.data?.data?.product);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const statusColors = {
    Research: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
    MVP: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
    Live: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
    default: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' }
  };

  const status = statusColors[product?.status] || statusColors.default;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-xl shadow-sm p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been moved.</p>
          <Link 
            to="/products/list" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Helmet>
        <title>{product.name} — JASIQ Labs</title>
        <meta name="description" content={product.description || product.seoDesc} />
      </Helmet>

      {/* Product Header with Gradient */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <Link 
              to="/products/list" 
              className="inline-flex items-center text-indigo-100 hover:text-white text-sm font-medium mb-6 group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Products
            </Link>
            
            <div className="flex flex-wrap items-center justify-between mb-4">
              <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text} ${status.border} border`}>
                {product.status}
              </span>
            </div>
            
            <p className="text-xl text-indigo-100 mb-8">{product.description}</p>
            
            {(product.metadata?.website || product.website) && (
              <a 
                href={product.metadata?.website || product.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 shadow-sm"
              >
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {product.coverImage && (
            <div className="w-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm mb-12">
              <img src={product.coverImage} alt={product.name} className="w-full h-64 md:h-96 object-cover" />
            </div>
          )}

          {fullDescription && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-12">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About {product.name}</h2>
              <p className="text-gray-700 leading-relaxed">{fullDescription}</p>
            </div>
          )}

          {/* Problem & Solution Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">The Problem</h2>
              </div>
              <p className="text-gray-700">{product.metadata?.problem || 'No problem statement available'}</p>
            </div>
            
            <div className="bg-green-50 border border-green-200 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">The Solution</h2>
              </div>
              <p className="text-gray-700">{product.metadata?.solution || 'No solution statement available'}</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Features</h2>
              <div className="w-16 h-1 bg-indigo-600 mx-auto"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(Array.isArray(features) ? features : []).map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Target Audience */}
          {product.metadata?.targetUsers && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl mb-12">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Built For: {product.metadata.targetUsers}</h3>
              </div>
              <p className="text-gray-600 text-sm">This product is specifically designed to meet the needs of {product.metadata.targetUsers.toLowerCase()}.</p>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Interested in {product.name}?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {product.status === 'Live' 
                ? `Ready to experience ${product.name}? Get started now or schedule a demo to see it in action.`
                : `Be the first to know when ${product.name} launches. Join our waitlist for exclusive updates and early access.`
              }
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {product.status === 'Live' ? (
                <>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 shadow-sm transition-colors"
                  >
                    Try Now
                  </a>
                  <a
                    href={`mailto:contact@jasiqlabs.com?subject=Demo request for ${product.name}`}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Schedule a Demo
                  </a>
                </>
              ) : (
                <>
                  <a
                    href={`mailto:contact@jasiqlabs.com?subject=Waitlist for ${product.name}`}
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 shadow-sm transition-colors"
                  >
                    <Mail className="-ml-1 mr-2 h-5 w-5" />
                    Join Waitlist
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    Learn More
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




