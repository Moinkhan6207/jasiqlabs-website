import { Helmet } from "react-helmet-async";
import content from "../../content/techworksstudio.json";
import ContactForm from "../../components/techworksstudio/ContactForm";

export default function Contact() {
  const c = content;

  return (
    <>
      <Helmet>
        <title>Contact — TechWorksStudio | JASIQ Labs</title>
        <meta
          name="description"
          content="Start your project with TechWorksStudio. Fill the form and our technical team will reach out within 24 hours."
        />
      </Helmet>

      <section className="bg-gradient-to-br from-primary-700 to-secondary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.contact.title}
            </h1>
            <p className="text-xl text-primary-100">
              {c.contact.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <ContactForm successMessage={c.contact.successMessage} />
        </div>
      </section>
    </>
  );
}





