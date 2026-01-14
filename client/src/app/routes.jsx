import { Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";

// Lazy load components for better performance
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AdminLayout = lazy(() => import('../components/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));

// Legal Pages
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import Terms from "../pages/legal/Terms";
import RefundCancellation from "../pages/legal/RefundCancellation";
import Disclaimer from "../pages/legal/Disclaimer";
import CookiePolicy from "../pages/legal/CookiePolicy";

// Phase 2: RealWorkStudio Imports
import RwsLayout from "../pages/realworkstudio/RwsLayout";
import RwsHome from "../pages/realworkstudio/RwsHome";
import Programs from "../pages/realworkstudio/Programs";
import InternshipModel from "../pages/realworkstudio/InternshipModel";
import StudentJourney from "../pages/realworkstudio/StudentJourney";
import Faqs from "../pages/realworkstudio/Faqs";
import Apply from "../pages/realworkstudio/Apply";

// Phase 3: TechWorksStudio Imports
import TwsLayout from "../pages/techworksstudio/TwsLayout";
import TwsHome from "../pages/techworksstudio/TwsHome";
import TwsServices from "../pages/techworksstudio/Services";
import TwsProcess from "../pages/techworksstudio/Process";
import TwsContact from "../pages/techworksstudio/Contact";

// Phase 4: Products Imports
import ProductsLayout from "../pages/products/ProductsLayout";
import ProductsHome from "../pages/products/ProductsHome";
import ProductListing from "../pages/products/ProductListing";
import ProductDetail from "../pages/products/ProductDetail";
import AiResearch from "../pages/products/AiResearch";

// Phase 5: Careers & Blog Imports
import Careers from "../pages/careers/Careers";
import BlogList from "../pages/blog/BlogList";
import BlogPost from "../pages/blog/BlogPost";

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    window.location.href = '/admin/login';
    return null;
  }
  
  return children;
};

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      // --- Main Website Pages ---
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { 
        path: "contact", 
        element: (
          <Suspense fallback={<Loading />}>
            <ContactPage />
          </Suspense>
        ) 
      },

      // --- Careers & Blog ---
      { path: "careers", element: <Careers /> },
      { path: "blog", element: <BlogList /> },
      { path: "blog/:id", element: <BlogPost /> },

      // --- Legal Pages ---
      { path: "legal/privacy-policy", element: <PrivacyPolicy /> },
      { path: "legal/terms", element: <Terms /> },
      { path: "legal/refund-cancellation", element: <RefundCancellation /> },
      { path: "legal/disclaimer", element: <Disclaimer /> },
      { path: "legal/cookie-policy", element: <CookiePolicy /> },

      // --- Phase 2: RealWorkStudio (Nested Routes) ---
      {
        path: "realworkstudio",
        element: <RwsLayout />,
        children: [
          { index: true, element: <RwsHome /> },
          { path: "programs", element: <Programs /> },
          { path: "internship-model", element: <InternshipModel /> },
          { path: "student-journey", element: <StudentJourney /> },
          { path: "faqs", element: <Faqs /> },
          { path: "apply", element: <Apply /> },
        ],
      },

      // --- Phase 3: TechWorksStudio (Nested Routes) ---
      {
        path: "techworksstudio",
        element: <TwsLayout />,
        children: [
          { index: true, element: <TwsHome /> },
          { path: "services", element: <TwsServices /> },
          { path: "process", element: <TwsProcess /> },
          { path: "contact", element: <TwsContact /> },
        ],
      },

      // --- Phase 4: Products & AI (Nested Routes) ---
      {
        path: "products",
        element: <ProductsLayout />,
        children: [
          { index: true, element: <ProductsHome /> },      // URL: /products
          { path: "list", element: <ProductListing /> },   // URL: /products/list
          { path: "ai-research", element: <AiResearch /> },// URL: /products/ai-research
          { path: ":id", element: <ProductDetail /> },     // URL: /products/omnishop (Dynamic)
        ],
      },

      // --- Phase 6: Admin Panel (Nested Routes) ---
      {
        path: "admin",
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<Loading />}>
                <AdminLogin />
              </Suspense>
            )
          },
          {
            path: "dashboard",
            element: (
              <Suspense fallback={<Loading />}>
                <ProtectedRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              </Suspense>
            )
          },
          // Redirect root admin path to dashboard
          { path: "", element: <Navigate to="/admin/dashboard" replace /> },
        ],
      },
    ],
  },
];