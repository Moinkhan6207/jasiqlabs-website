import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import StepFlow from "../../components/realworkstudio/StepFlow";

export default function InternshipModel() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Internship Model — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Learn about our training and internship model. Understand the journey from learning to earning certificates."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Internship Model
            </h1>
            <p className="text-xl text-primary-100">
              A structured path from training to real-world experience
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <StepFlow steps={c.internshipModel.steps} />
          </div>
        </div>
      </section>

      {/* Training vs Internship */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Training vs Internship
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Training</th>
                    <th className="px-6 py-4 text-left font-semibold">Internship</th>
                  </tr>
                </thead>
                <tbody>
                  {c.internshipModel.trainingVsInternship.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-6 py-4 text-gray-700">{row.training}</td>
                      <td className="px-6 py-4 text-gray-700">{row.internship}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Criteria */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Certificate Criteria
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {c.internshipModel.certificateCriteria.map((criteria, index) => (
                <div
                  key={index}
                  className="bg-primary-50 border border-primary-200 rounded-lg p-6 text-center"
                >
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-900 font-medium">{criteria}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}







