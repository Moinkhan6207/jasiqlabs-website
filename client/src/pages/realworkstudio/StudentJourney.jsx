import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import StepFlow from "../../components/realworkstudio/StepFlow";

export default function StudentJourney() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Student Journey — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Follow the journey from beginner to career-ready professional. Understand the path students take at RealWorkStudio."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Journey with RealWorkStudio
            </h1>
            <p className="text-xl text-primary-100">
              From beginner to career-ready professional
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <StepFlow steps={c.studentJourney} />
          </div>
        </div>
      </section>
    </>
  );
}







