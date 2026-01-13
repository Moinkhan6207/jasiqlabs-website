import React from 'react';
import { Helmet } from 'react-helmet-async';
import careersData from '../../content/careers.json';
import { 
  Briefcase, 
  Lightbulb, 
  Users, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Mail
} from 'lucide-react';

const Careers = () => {
  const { hero, stats, whyUs, perks, openings, apply } = careersData;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Helmet>
        <title>Careers - Join JASIQ Labs</title>
        <meta name="description" content="Join JASIQ Labs and work on cutting-edge projects. We're looking for passionate developers and designers to join our team." />
      </Helmet>

      {/* 1. HERO SECTION (Dark & Modern) */}
      <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">We are Hiring</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {hero.title}
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            {hero.subtitle}
          </p>
          <a href="#openings">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/50 flex items-center gap-2 mx-auto">
              {hero.ctaText} <ArrowRight size={20} />
            </button>
          </a>
        </div>
      </section>

      {/* 2. STATS BAR (Credibility) */}
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

      {/* 3. WHY JOIN US (Cards) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Developers Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We build an environment where your code actually goes to production.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {whyUs.map((item, index) => (
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

      {/* 4. PERKS & BENEFITS (New Section) */}
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

      {/* 5. OPEN POSITIONS (Job Tickets) */}
      <section id="openings" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-16">
            <span className="h-px w-12 bg-gray-300 mr-4"></span>
            <h2 className="text-3xl font-bold text-gray-900">Current Openings</h2>
            <span className="h-px w-12 bg-gray-300 ml-4"></span>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {openings.map((position, index) => (
              <div key={index} className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-lg hover:border-indigo-300 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {position.role}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <Clock size={14} className="mr-2" /> {position.type}
                      </span>
                      <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                        <MapPin size={14} className="mr-2" /> {position.location}
                      </span>
                    </div>
                    {/* Tags */}
                    <div className="flex gap-2">
                      {position.tags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* ✅ FIXED CODE: Button hata kar seedha Anchor tag banaya hai */}
                  <a 
                    href={`mailto:${apply.email}?subject=Application for ${position.role}`}
                    className="inline-block text-center w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg cursor-pointer"
                  >
                    Apply Now
                  </a>

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
            <p className="text-lg text-indigo-100 mb-8">
              {apply.text}
            </p>
            {/* ✅ FOOTER MAIL LOGIC */}
            <a 
              href={`mailto:${apply.email}`} 
              className="inline-block bg-white text-indigo-900 text-xl font-bold px-10 py-4 rounded-full hover:bg-indigo-50 transition-all shadow-xl hover:scale-105"
            >
              {apply.email}
            </a>
            <p className="mt-6 text-sm text-indigo-300">
              We usually respond within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;