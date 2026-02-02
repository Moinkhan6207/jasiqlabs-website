import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import content from "../content/siteContent.json";
import Seo from "../components/seo/Seo";
import { submitLead } from "../utils/api";
import { trackEvent } from "../utils/analytics";
import { pageContent } from "../services/api";

export default function Contact() {
  const c = content;
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    interestType: "STUDENT"
  });
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [isMounted, setIsMounted] = useState(false);

  // 🟢 Dynamic Hero State (Default: JSON Data)
  const [heroData, setHeroData] = useState({
    title: "Contact Us",
    subtitle: "Have questions or want to learn more? We're here to help.",
    description: "We are here to help you with your queries. Reach out to us through any of the following channels."
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 🟢 Fetch Data from Database on Load
  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const response = await pageContent.get('contact', 'hero');
        
        // Debug: Log the full response structure
        console.log('🔍 DEBUG: Contact page API Response:', response);
        
        // Robust Data Extraction
        const apiResponse = response || {};
        const backendData = apiResponse.data;

        console.log('🔍 DEBUG: Contact page API Response structure:', apiResponse);
        console.log('🔍 DEBUG: Contact page backend data:', backendData);

        let title = null;
        let subtitle = null;
        let description = null;

        if (backendData) {
            // Priority 1: Nested in content
            if (backendData.content) {
                title = backendData.content.title;
                subtitle = backendData.content.subtitle;
                description = backendData.content.description;
                console.log('🔍 DEBUG: Found data in nested content structure');
            } 
            // Priority 2: Flat structure
            else {
                title = backendData.title;
                subtitle = backendData.subtitle;
                description = backendData.description;
                console.log('🔍 DEBUG: Found data in flat structure');
            }
        }

        if (title || subtitle || description) {
          console.log('🔍 DEBUG: Updating Contact page heroData with:', { title, subtitle, description });
          setHeroData({
            title: title || "Contact Us",
            subtitle: subtitle || "Have questions or want to learn more? We're here to help.",
            description: description || "We are here to help you with your queries. Reach out to us through any of the following channels."
          });
        }
      } catch (error) {
        console.error("Failed to load Contact page content", error);
      }
    };

    fetchDynamicContent();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "loading", message: "" });

    try {
      trackEvent("lead_submit_attempt", { page: "contact", interestType: form.interestType });
      await submitLead({ ...form, sourcePage: "contact" });
      setStatus({ 
        state: "success", 
        message: "Thank you for your message! We'll get back to you soon." 
      });
      setForm({ 
        name: "", 
        email: "", 
        phone: "", 
        message: "",
        interestType: "STUDENT" 
      });
      trackEvent("lead_submit_success", { page: "contact" });
    } catch (err) {
      setStatus({ 
        state: "error", 
        message: err?.message || "Something went wrong. Please try again later." 
      });
      trackEvent("lead_submit_error", { page: "contact" });
    }
  }

  // Animation classes
  const fadeInUp = 'transition-all duration-700 transform opacity-0 translate-y-4';
  const fadeInUpActive = 'opacity-100 translate-y-0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title={c.seo.contact.title} description={c.seo.contact.description} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isMounted ? fadeInUpActive : fadeInUp}`}>
              {/* 🟢 Dynamic Hero Title */}
              {heroData.title}
            </h1>
            <p className={`text-xl text-primary-100 max-w-2xl mx-auto ${isMounted ? fadeInUpActive : fadeInUp}`} style={{ transitionDelay: '100ms' }}>
              {/* 🟢 Dynamic Hero Subtitle */}
              {heroData.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2">
              {/* Left Column - Contact Info */}
              <div className="bg-primary-700 text-white p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-primary-100 mb-8">
                  {/* 🟢 Dynamic Description */}
                  {heroData.description}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-600 p-3 rounded-full mr-4 flex-shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <a href="mailto:info@jasiqlabs.com" className="text-primary-100 hover:text-white transition-colors">
                        support@jasiqlabs.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-600 p-3 rounded-full mr-4 flex-shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <a href="tel:+15551234567" className="text-primary-100 hover:text-white transition-colors">
                        +91-7999109861
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary-600 p-3 rounded-full mr-4 flex-shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Visit Us</h3>
                      <p className="text-primary-100">
                        Sr. No. 222/1, BLD No. 8, Lower, Upper, Podium, 1st to 5th Floor, Raheja Woods,<br />
                         Kalyani Nagar, Pune (M Corp), Pune City, Maharashtra – 411006, India
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-primary-600">
                  <h3 className="font-semibold mb-4">Business Hours</h3>
                  <ul className="space-y-2 text-primary-100">
                    <li className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Right Column - Contact Form */}
              <div className="bg-white p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Fill out the form below and our team will get back to you as soon as possible.
                </p>
                
                <form onSubmit={onSubmit} className="space-y-6">
                  {status.message && (
                    <div 
                      className={`p-4 rounded-lg ${
                        status.state === "error" 
                          ? "bg-red-50 text-red-700 border border-red-200" 
                          : "bg-green-50 text-green-700 border border-green-200"
                      }`}
                    >
                      {status.message}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interestType" className="block text-sm font-medium text-gray-700 mb-1">
                      I am a <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="interestType"
                      value={form.interestType}
                      onChange={(e) => setForm({ ...form, interestType: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
                      required
                    >
                      <option value="STUDENT">Student</option>
                      <option value="PARENT">Parent</option>
                      <option value="EDUCATOR">Educator</option>
                      <option value="BUSINESS">Business</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                      placeholder="How can we help you?"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status.state === "loading"}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                  >
                    {status.state === "loading" ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
          
      {/* Map Section */}
<div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
  <div className="h-96 w-full relative">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d14243.923060622428!2d73.897886!3d18.546131!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1767772121292!5m2!1sen!2sin" 
      width="100%" 
      height="100%" 
      style={{ border: 0 }} 
      allowFullScreen="" 
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
      className="absolute inset-0 w-full h-full"
      title="Jasiq Labs Location"
    ></iframe>
  </div>

          </div>
        </div>
      </section>
    </div>
  );
}












