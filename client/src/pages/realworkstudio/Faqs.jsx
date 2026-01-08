import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import FaqItem from "../../components/realworkstudio/FaqItem";

export default function Faqs() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>FAQs — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Frequently asked questions about RealWorkStudio training programs, internships, and application process."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-primary-100">
              Everything you need to know about RealWorkStudio
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {c.faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}


