import React, { useState, useEffect } from 'react';
import careersData from '../../content/careers.json';
// 👇 1. pageContent ko import karein (Zaroori)
import api, { pageContent } from '../../services/api'; 
import Seo from '../../components/seo/Seo';
import {
  Briefcase, Lightbulb, Users, MapPin, Clock, ArrowRight, CheckCircle2,
  Sparkles, Mail, BookOpen, Sprout, Loader2, X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Careers = () => {
  const { hero, stats, whyUs, perks, apply, whoCanApply } = careersData;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 👇 2. Hero Section ke liye State banayein (Default: JSON data)
  const [heroContent, setHeroContent] = useState(hero);
  
  // State for dynamic content sections
  const [whyUsContent, setWhyUsContent] = useState(whyUs);
  const [whoCanApplyContent, setWhoCanApplyContent] = useState(whoCanApply);
  const [applyContent, setApplyContent] = useState(apply);

  // State for Application Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    resumeLink: '',
    coverLetter: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.careers.getPublicAll();
        const fetchedJobs = response.data?.data?.jobs || [];
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // 👇 3. Database se Title aur Subtitle Layein
    const fetchPageContent = async () => {
      try {
        const response = await pageContent.get('careers', 'hero');
        if (response.data) {
          setHeroContent(prev => ({
            ...prev,
            title: response.data.title || prev.title,
            subtitle: response.data.subtitle || prev.subtitle,
            ctaText: prev.ctaText // CTA text wahi rakhein
          }));
          
          // Update other sections from content field
          if (response.data.content) {
            const content = response.data.content;
            
            // Update Why Us content
            if (content.whyUs && Array.isArray(content.whyUs)) {
              setWhyUsContent(content.whyUs);
            }
            
            // Update Who Can Apply content
            if (content.whoCanApply && Array.isArray(content.whoCanApply)) {
              setWhoCanApplyContent(content.whoCanApply);
            }
            
            // Update Apply content
            if (content.applyText || content.applyEmail) {
              setApplyContent(prev => ({
                ...prev,
                text: content.applyText || prev.text,
                email: content.applyEmail || prev.email
              }));
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch career page content:", error);
      }
    };

    fetchJobs();
    fetchPageContent(); // Call the function
  }, []);

  const getCardTheme = (type) => {
    switch (type) {
      case 'book': return { color: 'text-blue-600', bg: 'bg-blue-100', Icon: BookOpen };
      case 'sprout': return { color: 'text-green-600', bg: 'bg-green-100', Icon: Sprout };
      case 'briefcase': return { color: 'text-purple-600', bg: 'bg-purple-100', Icon: Briefcase };
      default: return { color: 'text-gray-600', bg: 'bg-gray-100', Icon: Users };
    }
  };

  const handleApplyClick = (job) => {
    if (!job.acceptingApplications) {
      toast.error('Applications for this position are currently closed.');
      return;
    }
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedJob(null);
    setApplicationForm({ name: '', email: '', phone: '', resumeLink: '', coverLetter: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setSubmitting(true);
    try {
      await api.public.submitApplication(selectedJob.id, applicationForm);
      toast.success('Application submitted successfully!');
      handleCloseModal();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit application';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Seo 
        title="Careers - Join JASIQ Labs"
        description="Join JASIQ Labs and work on cutting-edge projects."
        pageName="careers"
      />

      {/* 1. HERO SECTION */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">We are Hiring</span>
          </div>
          {/* 👇 4. Use heroContent instead of hero */}
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">{heroContent.title}</h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">{heroContent.subtitle}</p>
          <a href="#openings">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg flex items-center gap-2 mx-auto">
              {heroContent.ctaText} <ArrowRight size={20} />
            </button>
          </a>
        </div>
      </section>

      {/* 2. STATS & WHY US (Static) - Keep Existing Code Below */}
       <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-4 divide-x divide-gray-100">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
       <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Developers Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We build an environment where your code actually goes to production.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUsContent.map((item, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                  {index === 0 ? <Lightbulb size={28} /> : index === 1 ? <Briefcase size={28} /> : <Users size={28} />}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 3. WHO CAN APPLY */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Are We Looking For?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Whether you are just starting or have years of experience, there is a place for you.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {whoCanApplyContent?.map((item, index) => {
              // Use static iconType from careersData as fallback, or use index-based mapping
              const iconType = careersData.whoCanApply[index]?.iconType || ['book', 'sprout', 'briefcase'][index];
              const theme = getCardTheme(iconType);
              return (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300">
                  <div className={`w-12 h-12 ${theme.bg} rounded-lg flex items-center justify-center mb-4 ${theme.color}`}>
                    <theme.Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. PERKS */}
      <section className="py-20 bg-slate-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Perks & Benefits</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {perks.map((perk, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl text-center shadow-sm border border-gray-100 hover:border-indigo-200 transition-colors">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <span className="font-medium text-gray-700 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OPEN POSITIONS */}
      <section id="openings" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-16">
            <span className="h-px w-12 bg-gray-300 mr-4"></span>
            <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
            <span className="h-px w-12 bg-gray-300 ml-4"></span>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {loading && (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-indigo-600 w-8 h-8" />
              </div>
            )}

            {!loading && jobs.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No open positions at the moment. Please check back later.</p>
              </div>
            )}

            {!loading && jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg hover:border-indigo-300 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <Clock size={14} className="mr-2" /> {job.type}
                      </span>
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <MapPin size={14} className="mr-2" /> {job.location}
                      </span>
                      {job.experience && (
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <Briefcase size={14} className="mr-2" /> {job.experience}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {job.requirements && job.requirements.slice(0, 3).map((req, tIdx) => (
                        <span key={tIdx} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 truncate max-w-[150px]">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Apply Button - Logic Updated */}
                  <button 
                    onClick={() => handleApplyClick(job)}
                    disabled={!job.acceptingApplications}
                    className={`inline-block text-center w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-colors shadow-lg cursor-pointer ${
                      job.acceptingApplications 
                        ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {job.acceptingApplications ? 'Apply Now' : 'Closed'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW TO APPLY (Footer CTA) */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm p-10 rounded-3xl border border-white/20">
            <Mail className="w-12 h-12 mx-auto mb-6 text-indigo-300" />
            <h2 className="text-3xl font-bold mb-4">Don't see a role for you?</h2>
            <p className="text-lg text-indigo-100 mb-8">{applyContent.text}</p>
            <a 
              href={`mailto:${applyContent.email}`} 
              className="inline-block bg-white text-indigo-900 text-xl font-bold px-10 py-4 rounded-full hover:bg-indigo-50 transition-all shadow-xl hover:scale-105"
            >
              {applyContent.email}
            </a>
            <p className="mt-6 text-sm text-indigo-300">We usually respond within 48 hours.</p>
          </div>
        </div>
      </section>

      {/* APPLICATION MODAL */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                <p className="text-sm text-gray-500">{selectedJob.location} • {selectedJob.type}</p>
              </div>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={applicationForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={applicationForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={applicationForm.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume / Portfolio Link</label>
                <input 
                  type="url" 
                  name="resumeLink"
                  value={applicationForm.resumeLink}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="https://linkedin.com/in/johndoe or Google Drive Link"
                />
                <p className="text-xs text-gray-500 mt-1">Please provide a public link to your resume or LinkedIn profile.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                <textarea 
                  name="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Tell us why you're a great fit..."
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;