import { Outlet, Link, useLocation } from "react-router-dom";

export default function RwsLayout() {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === "/realworkstudio") {
      return location.pathname === "/realworkstudio" || location.pathname === "/realworkstudio/";
    }
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const navLinks = [
    { path: "/realworkstudio", label: "Home" },
    { path: "/realworkstudio/programs", label: "Programs" },
    { path: "/realworkstudio/internship-model", label: "Internship Model" },
    { path: "/realworkstudio/student-journey", label: "Student Journey" },
    { path: "/realworkstudio/faqs", label: "FAQs" },
    { path: "/realworkstudio/apply", label: "Apply" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Menu */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 py-3 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive(link.path)
                    ? "bg-primary-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}
