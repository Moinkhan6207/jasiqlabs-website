import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { trackEvent } from "../../utils/analytics";

export default function Header() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDivisionsOpen, setIsDivisionsOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleDivisionClick = (division) => {
    trackEvent("nav_division_click", { division });
    setIsMobileMenuOpen(false);
    setIsDivisionsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            onClick={() => trackEvent("nav_home_click")}
          >
            <img 
              src="/favicon.webp" 
              alt="JASIQ Labs" 
              className="h-8 w-auto"
            />
            <span className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              JASIQ Labs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
              onClick={() => trackEvent("nav_home_click")}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/about")
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
              onClick={() => trackEvent("nav_about_click")}
            >
              About
            </Link>

            {/* Divisions Dropdown */}
            <div className="relative">
              <button
                type="button"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isDivisionsOpen
                    ? "text-primary-600"
                    : "text-gray-700 hover:text-primary-600"
                }`}
                onClick={() => setIsDivisionsOpen(!isDivisionsOpen)}
              >
                Divisions
                <span className="ml-1">{isDivisionsOpen ? "▲" : "▼"}</span>
              </button>

              {isDivisionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <a
                    href="/realworkstudio"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("realworkstudio")}
                  >
                    RealWorkStudio
                  </a>
                  <a
                    href="/techworksstudio"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("techworksstudio")}
                  >
                    TechWorksStudio
                  </a>
                  <a
                    href="/products"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("products")}
                  >
                    Products & AI
                  </a>
                </div>
              )}
            </div>

            {/* Blog */}
            <Link
              to="/blog"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname.startsWith("/blog")
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
              onClick={() => trackEvent("nav_blog_click")}
            >
              Blog
            </Link>

            {/* Careers */}
            <Link
              to="/careers"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/careers")
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-gray-700 hover:text-primary-600"
              }`}
              onClick={() => trackEvent("nav_careers_click")}
            >
              Careers
            </Link>

            {/* Contact Button */}
            <Link
              to="/contact"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isActive("/contact")
                  ? "bg-primary-600 text-white shadow-lg"
                  : "bg-accent-500 text-white hover:bg-accent-600 hover:shadow-lg hover:scale-105"
              }`}
              onClick={() => trackEvent("nav_contact_click")}
            >
              Contact
            </Link>

            {/* Admin Login */}
            <Link
              to="/admin/dashboard"
              className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
              title="Admin Access"
              onClick={() => trackEvent("nav_admin_click")}
            >
              <Lock className="w-5 h-5" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-primary-50 text-primary-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                trackEvent("nav_home_click");
                setIsMobileMenuOpen(false);
              }}
            >
              Home
            </Link>

              {/* 👇 2. ABOUT LINK ADD KAREIN (Yahan) */}
            <Link
              to="/about"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive("/about")
                  ? "bg-primary-50 text-primary-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                trackEvent("nav_about_click");
                setIsMobileMenuOpen(false);
              }}
            >
              About
            </Link>

            {/* Mobile Divisions */}
            <div className="px-4 py-2">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-gray-700 font-medium"
                onClick={() => setIsDivisionsOpen(!isDivisionsOpen)}
              >
                Divisions {isDivisionsOpen ? "▲" : "▼"}
              </button>
              {isDivisionsOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  <a
                    href="/#realworkstudio"
                    className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("realworkstudio")}
                  >
                    RealWorkStudio
                  </a>
                  <a
                    href="/#techworksstudio"
                    className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("techworksstudio")}
                  >
                    TechWorksStudio
                  </a>
                  <a
                    href="/#products"
                    className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                    onClick={() => handleDivisionClick("products")}
                  >
                    Products & AI
                  </a>
                </div>
              )}
            </div>

            {/* Blog Link - Mobile */}
            <Link
              to="/blog"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                location.pathname.startsWith("/blog")
                  ? "bg-primary-50 text-primary-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                trackEvent("nav_blog_click");
                setIsMobileMenuOpen(false);
              }}
            >
              Blog
            </Link>

            {/* Careers Link - Mobile */}
            <Link
              to="/careers"
              className={`block px-4 py-2 rounded-lg transition-colors ${
                isActive("/careers")
                  ? "bg-primary-50 text-primary-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => {
                trackEvent("nav_careers_click");
                setIsMobileMenuOpen(false);
              }}
            >
              Careers
            </Link>
            
            <Link
              to="/contact"
              className={`block px-4 py-2 rounded-lg text-center font-medium transition-colors ${
                isActive("/contact")
                  ? "bg-primary-600 text-white"
                  : "bg-accent-500 text-white hover:bg-accent-600"
              }`}
              onClick={() => {
                trackEvent("nav_contact_click");
                setIsMobileMenuOpen(false);
              }}
            >
              Contact
            </Link>

            {/* Admin Login - Mobile */}
            <Link
              to="/admin/dashboard"
              className="flex items-center justify-center px-4 py-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
              onClick={() => {
                trackEvent("nav_admin_click");
                setIsMobileMenuOpen(false);
              }}
            >
              <Lock className="w-5 h-5 mr-2" />
              Admin Access
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
