import { useState, useEffect } from 'react';
import { publicApi } from '../../services/api';
import toast from 'react-hot-toast';
import { Quote, Star, Users } from 'lucide-react';

// 👇 FIX 1: Backend URL Logic (Image ke liye full path banane ke liye)
const BACKEND_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:8080' 
  : 'https://jasiqlabs-website.onrender.com';

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`w-5 h-5 transition-all duration-200 ${
            index < rating 
              ? 'text-amber-400 fill-current drop-shadow-sm' 
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Skeleton Loader Component
const TestimonialSkeleton = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 animate-pulse">
    <div className="flex items-start space-x-4 mb-6">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl"></div>
      <div className="flex-1">
        <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4 mb-3"></div>
        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mr-2"></div>
      ))}
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-4/5"></div>
    </div>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => {
  
  // 👇 FIX 2: Image URL Construction
  // Agar image hai, to uske aage Backend URL lagao.
  const imageUrl = testimonial.image 
    ? `${BACKEND_URL}${testimonial.image}` 
    : '/default-avatar.svg';

  return (
    <div 
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 ease-out"
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Decorative Quote Icon */}
      <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
        <Quote className="w-6 h-6 text-white" />
      </div>
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-start space-x-4 mb-6">
          <div className="relative">
            <img
              src={imageUrl} // 👈 Updated variable
              alt={testimonial.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src = '/default-avatar.svg';
              }}
            />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {testimonial.name}
            </h3>
            <p className="text-gray-600 font-medium">
              {testimonial.role} {testimonial.company && `at ${testimonial.company}`}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
        
        <blockquote className="text-gray-700 leading-relaxed text-lg font-medium italic">
          "{testimonial.message}"
        </blockquote>
      </div>
    </div>
  );
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👇 FIX 3: Function Definition moved INSIDE useEffect or BEFORE usage
  useEffect(() => {
    const fetchTestimonialsData = async () => {
        try {
          setLoading(true);
          setError(null);
    
          console.log('Fetching testimonials data...');
          
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

    fetchTestimonialsData();
  }, []); // Empty dependency array means run once on mount

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl w-3/4 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Quote className="w-10 h-10 text-red-500" />
          </div>
          <div className="text-red-600 text-xl font-semibold mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()} // Simple reload for retry
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Users className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              {pageSettings?.title || 'What Our Clients Say'}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              {pageSettings?.subtitle || 'Testimonials from our valued clients and partners'}
            </p>
            
            <div className="flex justify-center space-x-12 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{testimonials.length}+</div>
                <div className="text-gray-600 font-medium">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">4.9</div>
                <div className="text-gray-600 font-medium">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">100%</div>
                <div className="text-gray-600 font-medium">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-16">
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Quote className="w-12 h-12 text-gray-400" />
            </div>
            <div className="text-gray-500 text-xl font-medium">
              No testimonials available at the moment.
            </div>
            <p className="text-gray-400 mt-2">Check back soon for updates from our clients!</p>
          </div>
        )}
      </div>
      
      <style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>
    </div>
  );
}