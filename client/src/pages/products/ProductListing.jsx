import { Helmet } from "react-helmet-async";
import content from "../../content/products.json";
import ProductCard from "../../components/products/ProductCard";

export default function ProductListing() {
  const c = content;

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
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{c.listing.title}</h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            {c.listing.subtitle}
          </p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {/* Empty State */}
          {c.productList.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No products available</h3>
              <p className="text-gray-500">Check back later for updates on our product offerings.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

