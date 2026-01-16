import { useState, useEffect } from 'react';
import content from "../content/siteContent.json";
import Seo from "../components/seo/Seo";

// Icons (You can replace these with your actual icons)
const CultureIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MissionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const VisionIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export default function About() {
  const c = content;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Animation classes that will be applied when component mounts
  const fadeInUp = 'transition-all duration-700 transform opacity-0 translate-y-4';
  const fadeInUpActive = 'opacity-100 translate-y-0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title={c.seo.about.title} description={c.seo.about.description} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20 md:py-28">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${isMounted ? fadeInUpActive : fadeInUp}`}>
              {c.about.h1}
            </h1>
            <p className={`text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '100ms' }}>
              Empowering innovation through technology, training, and transformative solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Mission */}
            <div className={`bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <MissionIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-4">{c.about.missionTitle}</h2>
              <p className="text-gray-600 text-center">{c.about.missionText}</p>
            </div>

            {/* Vision */}
            <div className={`bg-white rounded-xl shadow-lg p-8 transform hover:scale-[1.02] transition-all duration-300 ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '300ms' }}>
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <VisionIcon className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-4">Our Vision</h2>
              <p className="text-gray-600 text-center">
                To be the leading force in technological innovation, transforming ideas into impactful solutions that drive progress and create sustainable value for our clients and communities worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.about.storyTitle}</h2>
            <div className="w-24 h-1 bg-primary-500 mx-auto"></div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="prose max-w-none text-gray-600">
              <p className="text-lg mb-6">
                {c.about.storyText}
              </p>
              <p className="text-lg">
                Our journey has been marked by continuous learning, innovation, and a relentless pursuit of excellence. 
                From our humble beginnings to becoming a trusted technology partner, we've remained committed to delivering 
                exceptional value to our clients while fostering a culture of integrity and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.about.differentTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We stand out from the crowd with our unique approach and unwavering commitment to excellence.
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.about.differentItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-primary-100 p-2 rounded-full mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item}</h3>
                </div>
                <p className="text-gray-600 pl-10">
                  {c.about.differentDescriptions && c.about.differentDescriptions[index] 
                    ? c.about.differentDescriptions[index] 
                    : 'We deliver exceptional value through innovative solutions and dedicated service.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Culture & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{c.about.cultureTitle}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our culture is built on a foundation of shared values that guide our decisions and actions every day.
            </p>
            <div className="w-24 h-1 bg-primary-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.about.cultureItems.map((item, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CultureIcon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.split(':')[0]}</h3>
                <p className="text-gray-600">
                  {item.split(':')[1] || 'We believe in the power of collaboration and innovation.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Compliance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">{c.about.leadershipTitle}</h2>
              <div className="prose max-w-none text-gray-600 space-y-4">
                <p>{c.about.leadershipText}</p>
                <p>
                  Our leadership team brings together decades of combined experience in technology, business strategy, 
                  and innovation to guide our company's vision and growth.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{c.about.complianceTitle}</h3>
              <div className="prose max-w-none text-gray-600 space-y-4">
                <p>{c.about.complianceText}</p>
                <p>
                  We are committed to maintaining the highest standards of ethical business practices, 
                  data protection, and regulatory compliance across all our operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your next project?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Get in touch with our team to discuss how we can help bring your ideas to life.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300"
          >
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}












