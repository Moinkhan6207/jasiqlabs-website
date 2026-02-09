import { useState, useEffect } from 'react';
import { publicApi } from '../../services/api';
import toast from 'react-hot-toast';

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Skeleton Loader Component
const TestimonialSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="flex mb-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 bg-gray-200 rounded mr-1"></div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={testimonial.image || '/default-avatar.svg'}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          onError={(e) => {
            e.target.src = '/default-avatar.svg';
          }}
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
          <p className="text-sm text-gray-600">
            {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
          </p>
        </div>
      </div>
      
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>
      
      <blockquote className="text-gray-700 italic leading-relaxed">
        "{testimonial.message}"
      </blockquote>
    </div>
  );
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTestimonialsData();
  }, []);

  const fetchTestimonialsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both testimonials and page settings in parallel
      const [testimonialsResponse, settingsResponse] = await Promise.all([
        publicApi.getTestimonials(),
        publicApi.getTestimonialSettings()
      ]);

      setTestimonials(testimonialsResponse.data?.data || []);
      setPageSettings(settingsResponse.data?.data || {
        title: 'What Our Clients Say',
        subtitle: 'Testimonials from our valued clients and partners'
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials. Please try again later.');
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Page Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>

          {/* Testimonials Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <TestimonialSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">{error}</div>
            <button
              onClick={fetchTestimonialsData}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {pageSettings?.title || 'What Our Clients Say'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {pageSettings?.subtitle || 'Testimonials from our valued clients and partners'}
          </p>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No testimonials available at the moment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
