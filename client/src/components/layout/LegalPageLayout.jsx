import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LegalPageLayout = ({ children, title, lastUpdated }) => {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMounted(true);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [location]);

  // Animation classes
  const fadeInUp = 'transition-all duration-700 transform opacity-0 translate-y-4';
  const fadeInUpActive = 'opacity-100 translate-y-0';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-3xl md:text-4xl font-bold mb-2 ${isMounted ? fadeInUpActive : fadeInUp}`}>
              {title}
            </h1>
            {lastUpdated && (
              <p className={`text-primary-100 ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '100ms' }}>
                Last Updated: {lastUpdated}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="prose prose-lg max-w-none p-8 md:p-12">
              {children}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LegalPageLayout;
