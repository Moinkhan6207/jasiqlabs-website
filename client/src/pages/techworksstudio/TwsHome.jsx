import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import content from "../../content/techworksstudio.json";
import { pageContent } from "../../services/api";
import HeroSection from "../../components/techworksstudio/HeroSection";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function TwsHome() {
  const c = content;

  const [heroContent, setHeroContent] = useState({
    title: c.home.hero.title,
    subtitle: c.home.hero.subtitle,
    ctaText: c.home.hero.ctaText,
    ctaLink: c.home.hero.ctaLink
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await pageContent.get('techworksstudio', 'tws_hero');

        const apiResponse = response.data || response;
        const backendData = apiResponse.data || apiResponse;

        if (backendData) {
          let newTitle = null;
          let newSubtitle = null;
          let newCta = null;

          if (backendData.content) {
            newTitle = backendData.content.title;
            newSubtitle = backendData.content.subtitle;
            newCta = backendData.content.description;
          } else if (backendData.title) {
            newTitle = backendData.title;
            newSubtitle = backendData.subtitle;
            newCta = backendData.description;
          }

          if (newTitle) {
            setHeroContent(prev => ({
              ...prev,
              title: newTitle,
              subtitle: newSubtitle || prev.subtitle,
              ctaText: newCta || prev.ctaText
            }));
          }
        }
      } catch (error) {
        console.log('Using fallback content for TechWork Studio hero section');
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>TechWorksStudio — Custom Software & AI Solutions | JASIQ Labs</title>
        <meta
          name="description"
          content="We build scalable software for startups & enterprises. Custom software development, AI automation, and MVP solutions for businesses."
        />
      </Helmet>

      <HeroSection
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
      />

      {/* What We Do */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            What We Do
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.home.whatWeDo.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Work With */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Who We Work With
          </h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {c.home.whoWeWorkWith.map((item, index) => (
              <div
                key={index}
                className="px-6 py-4 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose TechWorksStudio?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {c.home.whyUs.map((item, index) => (
              <div
                key={index}
                className="bg-primary-50 border border-primary-200 rounded-xl p-8"
              >
                <h3 className="text-xl font-bold text-primary-600 mb-4">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.home.servicesPreview.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-xl p-8 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-2xl font-bold text-primary-600 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-700 mb-6">{service.desc}</p>
                <Link to="/techworksstudio/services">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {c.home.leadCta.text}
            </h2>
            <Link to={c.home.leadCta.link}>
              <Button variant="accent" className="text-lg px-8 py-4">
                {c.home.leadCta.button}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}





