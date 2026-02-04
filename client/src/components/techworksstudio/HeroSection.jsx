import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function HeroSection({ title, subtitle, ctaText, ctaLink }) {
  return (
    <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-600 text-white pt-24 pb-16 md:pt-32 md:pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          {ctaText && ctaLink && (
            <Link to={ctaLink}>
              <Button variant="accent" className="text-lg px-8 py-4">
                {ctaText}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}





