import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import HeroSection from "../../components/realworkstudio/HeroSection";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Code2, Sparkles } from "lucide-react";

export default function RwsHome() {
  const c = content;
  // Top 3 programs ko filter karke nikal rahe hain
  const featuredPrograms = c.programs.list.slice(0, 3);

  return (
    <>
      <Helmet>
        <title>RealWorkStudio — Training & Internships | JASIQ Labs</title>
        <meta
          name="description"
          content="Learn real skills through guided training and internships. Industry-focused programs for students, freshers, and career switchers."
        />
      </Helmet>

      <HeroSection
        title={c.home.hero.title}
        subtitle={c.home.hero.subtitle}
        ctaText={c.home.hero.ctaText}
        ctaLink={c.home.hero.ctaLink}
      />

      {/* What Is RealWorkStudio */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            What is RealWorkStudio?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.home.whatIs.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Join */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Who Should Join?
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {c.home.whoShouldJoin.map((item, index) => (
              <div
                key={index}
                className="px-8 py-4 bg-white border border-gray-200 rounded-full text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-default"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose RealWorkStudio?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {c.home.differentiators.map((item, index) => (
              <div
                key={index}
                className="bg-primary-50 border border-primary-100 rounded-xl p-6 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-white font-bold text-lg">✓</span>
                </div>
                <p className="text-gray-900 font-medium text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Preview - MODERN GLOW VERSION */}
      <section className="py-28 bg-slate-50 relative overflow-hidden">
        {/* Background Decorative Blurs */}
        <div className="absolute top-20 left-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 mb-4 bg-primary-100 rounded-full text-primary-700">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="text-sm font-bold uppercase tracking-wider">Start Your Career</span>
            </div>
            <h2 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-primary-600">
              Featured Programs
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Master the skills that top companies are hiring for today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {featuredPrograms.map((track) => (
              <div
                key={track.id}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden"
              >
                {/* Top Colored Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-purple-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mb-6 text-primary-600 group-hover:scale-110 transition-transform duration-300">
                   <Code2 className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                  {track.title}
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed h-20 overflow-hidden">
                  {track.for}
                </p>

                <div className="pt-6 border-t border-gray-100">
                    <Link to={`/realworkstudio/programs`} className="inline-flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform">
                        Explore Curriculum <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/realworkstudio/programs">
              <Button 
                className="px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-primary-600 to-primary-800 rounded-full shadow-xl shadow-primary-600/30 hover:scale-105 hover:shadow-primary-600/50 transition-all duration-300"
              >
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Trust RealWorkStudio?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {c.home.trust.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✓</span>
                </div>
                <p className="text-xl font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}



