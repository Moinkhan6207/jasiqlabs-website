import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function ProductHero({ title, subtitle, ctaText, ctaLink }) {
  return (
    <section className="bg-white pt-20 pb-12 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>
        {ctaText && ctaLink && (
          <Link to={ctaLink}>
            <Button variant="primary" className="text-lg px-8 py-4">
              {ctaText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}




