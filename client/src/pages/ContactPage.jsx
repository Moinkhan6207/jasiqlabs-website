import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, Facebook, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Seo from "../components/seo/Seo";
import api, { pageContent, publicApi } from '../services/api';

const ContactPage = () => {
  // 1. Dynamic Content State
  const [heroContent, setHeroContent] = useState({
    title: "Get in Touch",
    description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
  });

  const [seoTitle, setSeoTitle] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestType: 'Student', 
    division: 'TechWorksStudio',
    message: '',
    website_url: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Database Fetch Logic
  useEffect(() => {
    // A. Page Content Fetching
    const fetchPageContent = async () => {
      try {
        console.log("🔍 Fetching Contact Page Content...");
        const response = await pageContent.get('contact', 'hero');
        
        // 🛠️ FIX IS HERE: Simple Extraction
        // Console log confirm karta hai ki 'response' ke andar hi 'data' hai.
        // Hamein bas wahi chahiye.
        const backendData = response.data; 

        console.log("📂 Correctly Extracted Data:", backendData);

        let newTitle = null;
        let newDesc = null;

        if (backendData) {
            // Check 1: Nested 'content' object (Standard structure)
            if (backendData.content) {
                newTitle = backendData.content.title;
                newDesc = backendData.content.description || backendData.content.subtitle;
            } 
            // Check 2: Flat structure (Fallback)
            else if (backendData.title) {
                newTitle = backendData.title;
                newDesc = backendData.description || backendData.subtitle;
            }
        }

        if (newTitle) {
            setHeroContent(prev => ({
                ...prev,
                title: newTitle,
                description: newDesc || prev.description
            }));
        }
      } catch (error) {
        console.error("🔥 Failed to fetch contact page content:", error);
      }
    };

    // B. SEO Data Fetching
    const fetchSeoData = async () => {
      try {
        const response = await publicApi.getPageSeo('contact');
        if (response.data && response.data.metaTitle) {
          setSeoTitle(response.data.metaTitle);
        }
      } catch (error) {
        console.error("SEO Fetch Error:", error);
      }
    };

    fetchPageContent();
    fetchSeoData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        interestType: formData.interestType.toUpperCase(),
        division: formData.division,
        source: 'Contact Page',
        message: formData.message ? formData.message.trim() : '',
      };
      
      const response = await fetch('http://localhost:8080/api/public/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit form.');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        interestType: 'Student',
        division: 'TechWorksStudio',
        message: '',
        website_url: ''
      });
      
      toast.success('Thank you for contacting us! We will get back to you soon.');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Seo 
        title={seoTitle || `${heroContent.title} | JASIQ Labs`}
        description={heroContent.description}
        path="/contact"
        pageName="contact"
      />
      
      <div className="min-h-screen bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {heroContent.title}
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              {heroContent.description}
            </p>
          </div>

          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Column - Contact Info */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500 p-2 rounded-lg">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Email Us</h3>
                      <p className="text-blue-100">support@jasiqlabs.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500 p-2 rounded-lg">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Call Us</h3>
                      <p className="text-blue-100">+91 91-7999109861</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-500 p-2 rounded-lg">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium">Visit Us</h3>
                      <p className="text-blue-100">Sr. No. 222/1, BLD No. 8, Lower, Upper, Podium, 1st to 5th Floor, Raheja Woods, Kalyani Nagar, Pune (M Corp), Pune City, Maharashtra – 411006, India 🔗 Verify on MCA.gov.in</p>
                      <p className="text-blue-100">Pune, India</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-lg font-medium mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.linkedin.com/company/107946520/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-colors"
                      aria-label="Facebook"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/realworkstudioofficial/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/107946520/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-700 hover:bg-blue-600 p-3 rounded-full transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'none' }} aria-hidden="true">
                <label htmlFor="website_url">Website</label>
                <input
                  type="text"
                  name="website_url"
                  id="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="interestType" className="block text-sm font-medium text-gray-700">
                        I am a... *
                      </label>
                      <select
                        id="interestType"
                        name="interestType"
                        required
                        value={formData.interestType}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="Student">Student</option>
                        <option value="Client">Client</option>
                        <option value="Partner">Partner</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                        Interested in *
                      </label>
                      <select
                        id="division"
                        name="division"
                        required
                        value={formData.division}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="RealWorkStudio">RealWork Studio</option>
                        <option value="TechWorksStudio">TechWorks Studio</option>
                        <option value="Products & AI">Products & AI</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Your Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                        placeholder="How can we help you?"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="-ml-1 mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;