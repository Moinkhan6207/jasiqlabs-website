import { Helmet } from "react-helmet-async";
import content from "../../content/realworkstudio.json";
import ProgramCard from "../../components/realworkstudio/ProgramCard";

export default function Programs() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Programs — RealWorkStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Choose a learning path based on your interest and career goals. MERN Stack and Python programs available."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.programs.title}
            </h1>
            <p className="text-xl text-primary-100">
              {c.programs.description}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {c.programs.list.map((program) => (
              <ProgramCard key={program.id} data={program} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}








