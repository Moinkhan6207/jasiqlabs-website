import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import content from "../../content/techworksstudio.json";
import ServiceCard from "../../components/techworksstudio/ServiceCard";
import apiService from "../../services/api";

export default function Services() {
  const c = content;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await apiService.public.getServices();
        setServices(response.data.data.services);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const renderServiceCard = (service) => {
    // Map database fields to component expected format
    const mappedData = {
      id: service.id,
      title: service.name,
      for: service.metadata?.type || 'Businesses and Startups',
      problemSolved: service.metadata?.problem || service.description || 'Custom solutions for your needs',
      approach: service.metadata?.approach || 'Agile methodology with modern tech stack',
      outcome: service.metadata?.outcome || 'Scalable, maintainable, and performant solutions',
      hasProblem: !!service.metadata?.problem,
      hasApproach: !!service.metadata?.approach,
      hasOutcome: !!service.metadata?.outcome
    };
    
    return <ServiceCard key={service.id} data={mappedData} />;
  };

  return (
    <>
      <Helmet>
        <title>Services — TechWorksStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="End-to-end technology services: Custom software development, AI automation, MVP for startups, and web & mobile applications."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-700 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.services.title}
            </h1>
            <p className="text-xl text-primary-100">
              {c.services.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4 animate-spin">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load services</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
              <p className="text-gray-500">Our services are being updated. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {services.map(renderServiceCard)}
            </div>
          )}
        </div>
      </section>

      {/* Engagement Models */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {c.engagementModels.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.engagementModels.list.map((model, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">{model.title}</h3>
                <p className="text-gray-700 leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {c.caseStudies.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {c.caseStudies.list.map((study, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">{study.title}</h3>
                <div className="space-y-3">
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <strong className="text-red-700">Problem:</strong> {study.problem}
                    </p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <strong className="text-blue-700">Solution:</strong> {study.solution}
                    </p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                    <p className="text-sm text-gray-700">
                      <strong className="text-green-700">Outcome:</strong> {study.outcome}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}





