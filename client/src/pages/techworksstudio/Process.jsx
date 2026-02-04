import { Helmet } from "react-helmet-async";
import content from "../../content/techworksstudio.json";
import ProcessStep from "../../components/techworksstudio/ProcessStep";

export default function Process() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>How We Work — TechWorksStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Our proven 5-step process: Requirement Analysis, Planning & Architecture, Agile Development, Testing & QA, and Deployment & Support."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-700 to-secondary-600 text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.howWeWork.title}
            </h1>
            <p className="text-xl text-primary-100">
              A proven methodology to deliver quality software
            </p>
          </div>
        </div>
      </section>

      <section className="pt-20 pb-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto relative">
            {c.howWeWork.steps.map((stepData, index) => (
              <div key={index} className="relative">
                {index < c.howWeWork.steps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-16 bottom-0 w-0.5 bg-primary-200"></div>
                )}
                <ProcessStep
                  step={stepData.step}
                  title={stepData.title}
                  desc={stepData.desc}
                  isLast={index === c.howWeWork.steps.length - 1}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models */}
      <section className="pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {c.engagementModels.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.engagementModels.list.map((model, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">{model.title}</h3>
                <p className="text-gray-700 leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}





