import { Helmet } from "react-helmet-async";
import content from "../../content/products.json";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function ProductsHome() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Products & AI Research — JASIQ Labs</title>
        <meta
          name="description"
          content="JASIQ Labs products and AI research. We engineer intelligent products that solve real-world problems."
        />
      </Helmet>

      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-to-br from-indigo-600 to-violet-600 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {c.home.hero.title}
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8">
            {c.home.hero.subtitle}
          </p>
          <a
            href={c.home.hero.ctaLink}
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            {c.home.hero.ctaText}
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* What We Build Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Build
            </h2>
            <div className="w-20 h-1 bg-indigo-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.home.whatWeBuild.map((item, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <CheckCircle className="h-8 w-8 text-indigo-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{item.title}</h3>
                <p className="text-gray-600 text-center">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {c.home.difference.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding how our products complement our services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg mr-4">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-indigo-700">Products</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.home.difference.products}</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-violet-100 rounded-lg mr-4">
                  <svg className="h-8 w-8 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M12 16h.01M8 16h.01M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-violet-700">Services</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.home.difference.services}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

