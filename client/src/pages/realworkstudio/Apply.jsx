import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import ApplyForm from "../../components/realworkstudio/ApplyForm";

export default function Apply() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Apply — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Apply to RealWorkStudio training programs. Submit your details and we will contact you soon."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Apply to RealWorkStudio
            </h1>
            <p className="text-xl text-primary-100">
              Start your journey towards practical skills and real-world experience
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ApplyForm programs={content.programs.list} />

          {c.apply.note && (
            <div className="max-w-2xl mx-auto mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800 text-center">{c.apply.note}</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}








