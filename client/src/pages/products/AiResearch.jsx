import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import content from "../../content/products.json";
import { pageContent } from "../../services/api";
import HeroSection from "../../components/realworkstudio/HeroSection";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, Lightbulb, Target, Zap, CheckCircle2 } from "lucide-react";

export default function AiResearch() {
  const c = content;

  const [heroContent, setHeroContent] = useState({
    title: c.aiResearch.title,
    subtitle: "Pioneering the next generation of AI solutions through cutting-edge research and innovation.",
    ctaText: "Explore Our Products",
    ctaLink: "/products/list"
  });

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        const response = await pageContent.get('products', 'ai_research_hero');
        
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
        console.log('Using fallback content for AI Research hero section');
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>AI Research — JASIQ Labs</title>
        <meta
          name="description"
          content="JASIQ AI Research: Generative AI, Computer Vision, and Predictive Analytics. Our philosophy and vision for AI democratization."
        />
      </Helmet>

      <HeroSection
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
      />

      {/* Our Philosophy */}
      <section className="pt-12 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Philosophy
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary-600 mb-3">Human-Centric AI</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {c.aiResearch.philosophy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="pt-12 pb-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Research Areas
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.aiResearch.areas.map((area, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{area.title}</h3>
                <p className="text-gray-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="pt-12 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Our Vision
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200 rounded-xl p-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-600 mb-3">Democratizing AI</h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {c.aiResearch.vision}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/contact">
                      <Button variant="primary" className="inline-flex items-center">
                        Partner With Us
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link to="/products/list">
                      <Button variant="outline" className="inline-flex items-center">
                        View Our Products
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Research */}
      <section className="pt-12 pb-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Research?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">Cutting-Edge Innovation</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">Real-World Applications</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">Ethical AI Development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="pt-6 pb-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 mb-4 bg-primary-700 rounded-full text-primary-200">
              <Zap className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold uppercase tracking-wider">Stay Updated</span>
            </div>
            <h2 className="text-4xl font-bold text-center mb-6">
              Get Latest AI Research Insights
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest breakthroughs and insights in AI research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-4 py-3 rounded-lg border border-primary-500 text-white placeholder-primary-300 bg-primary-700 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              />
              <Button variant="accent" className="whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

