import { Helmet } from "react-helmet-async";
import content from "../../content/techworksstudio.json";
import ServiceCard from "../../components/techworksstudio/ServiceCard";

export default function Services() {
  const c = content;

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
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {c.services.list.map((service) => (
              <ServiceCard key={service.id} data={service} />
            ))}
          </div>
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


