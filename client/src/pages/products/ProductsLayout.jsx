import { Outlet, Link, useLocation } from "react-router-dom";

export default function ProductsLayout() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === "/products") {
      return location.pathname === "/products" || location.pathname === "/products/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navLinks = [
    { path: "/products", label: "Overview" },
    { path: "/products/list", label: "All Products" },
    { path: "/products/ai-research", label: "AI Research" },
  ];

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-3 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive(link.path)
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
