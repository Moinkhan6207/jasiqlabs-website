import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import content from "../../content/products.json";
import { pageContent } from "../../services/api";
import HeroSection from "../../components/realworkstudio/HeroSection";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Package, Wrench } from "lucide-react";

export default function ProductsHome() {
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
        const response = await pageContent.get('products', 'products_hero');

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
        console.log('Using fallback content for Products hero section');
      }
    };

    fetchHeroContent();
  }, []);

  return (
    <>
      <Helmet>
        <title>Products & AI Research — JASIQ Labs</title>
        <meta
          name="description"
          content="JASIQ Labs products and AI research. We engineer intelligent products that solve real-world problems."
        />
      </Helmet>

      <HeroSection
        title={heroContent.title}
        subtitle={heroContent.subtitle}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
      />

      {/* What We Build */}
      <section className="pt-12 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            What We Build
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {c.home.whatWeBuild.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products vs Services */}
      <section className="pt-12 pb-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            {c.home.difference.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-600">Products</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.home.difference.products}</p>
            </div>
            
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mr-4">
                  <Wrench className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-secondary-600">Services</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.home.difference.services}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Products */}
      <section className="pt-12 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Why Choose Our Products?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">Scalable Architecture</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">AI-Powered Features</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <span className="text-white font-bold text-lg">✓</span>
              </div>
              <p className="text-gray-900 font-medium text-lg">Enterprise Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-6 pb-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-center mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Explore our product suite and find the perfect solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products/list">
                <Button variant="accent" className="inline-flex items-center">
                  View All Products
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/products/ai-research">
                <Button variant="outline" className="inline-flex items-center text-white border-white hover:bg-white hover:text-primary-600">
                  AI Research
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

