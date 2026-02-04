import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import content from "../../content/products.json";
import ProductCard from "../../components/products/ProductCard";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Package, Star } from "lucide-react";
import apiService from "../../services/api";

export default function ProductListing() {
  const c = content;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiService.public.getProducts();
        setProducts(response.data.data.products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderProductCard = (product) => {
    // Map database fields to component expected format
    const mappedData = {
      id: product.id,
      name: product.name,
      shortDesc: product.description,
      status: product.status,
      target: product.metadata?.targetUsers,
      icon: product.icon
    };
    
    return <ProductCard key={product.id} product={mappedData} />;
  };

  return (
    <>
      <Helmet>
        <title>Our Products — JASIQ Labs</title>
        <meta
          name="description"
          content="Explore JASIQ Labs product suite: OmniShop, CertiMint, EDUSTACK, and Talent Platforms."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 mb-4 bg-primary-700 rounded-full text-primary-200">
              <Package className="w-4 h-4 mr-2" />
              <span className="text-sm font-bold uppercase tracking-wider">Product Suite</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {c.listing.title}
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              {c.listing.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pt-12 pb-6 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 mb-4 animate-spin">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Unable to load products</h3>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-100 mb-4">
                <Package className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h3>
              <p className="text-gray-500">Our products are being developed. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(renderProductCard)}
            </div>
          )}
        </div>
      </section>

      {/* Product Categories */}
      <section className="pt-12 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Product Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">E-Commerce</h3>
              <p className="text-sm text-gray-600">Modern retail solutions</p>
            </div>
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Education</h3>
              <p className="text-sm text-gray-600">Learning platforms</p>
            </div>
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Blockchain</h3>
              <p className="text-sm text-gray-600">Secure verification</p>
            </div>
            <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">AI Platforms</h3>
              <p className="text-sm text-gray-600">Smart automation</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pt-6 pb-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-center mb-6">
              Need a Custom Solution?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Our team can build tailored products to meet your specific business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button variant="accent" className="inline-flex items-center">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/techworksstudio">
                <Button variant="outline" className="inline-flex items-center text-white border-white hover:bg-white hover:text-primary-600">
                  Our Services
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

