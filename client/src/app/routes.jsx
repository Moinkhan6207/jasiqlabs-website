import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import MaintenanceLayout from './App';

// Lazy load components for better performance
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AdminLayout = lazy(() => import('../components/layouts/AdminLayout'));
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const LeadsPage = lazy(() => import('../pages/admin/LeadsPage'));
const BlogPage = lazy(() => import('../pages/admin/BlogPage'));
const CareersPage = lazy(() => import('../pages/admin/CareersPage'));
const JobApplicationsPage = lazy(() => import('../pages/admin/JobApplicationsPage'));
const PageContentEditor = lazy(() => import('../pages/admin/PageContentEditor'));
const ContentPage = lazy(() => import('../pages/admin/ContentPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const SeoSettingsPage = lazy(() => import('../pages/admin/SeoSettingsPage'));
const ProgramsPage = lazy(() => import('../pages/admin/ProgramsPage'));
const ServicesPage = lazy(() => import('../pages/admin/ServicesPage'));
const ProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const SystemPage = lazy(() => import('../pages/admin/SystemPage'));
const NotFound = lazy(() => import('../pages/NotFound'));
const ThankYou = lazy(() => import('../pages/ThankYou'));

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

// App Layout component that wraps the entire app with AuthProvider
const AppLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

// Admin Layout Wrapper
const AdminLayoutWrapper = ({ children }) => (
  <Suspense fallback={<Loading />}>
    <AdminLayout>
      {children}
    </AdminLayout>
  </Suspense>
);

// Create the router configuration
export const router = createBrowserRouter([
  {
    element: <MaintenanceLayout />,
    children: [
      {
        element: <AuthProvider><Outlet /></AuthProvider>,
        children: [
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
          { path: "thank-you", element: <ThankYou /> },

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
              { index: true, element: <ProductsHome /> },
              { path: "list", element: <ProductListing /> },
              { path: "ai-research", element: <AiResearch /> },
              { path: ":id", element: <ProductDetail /> },
            ],
          },
        ],
      },

      // --- Admin Routes ---
      {
        path: "/admin",
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
            element: (
              <ProtectedRoute>
                <AdminLayoutWrapper>
                  <Outlet />
                </AdminLayoutWrapper>
              </ProtectedRoute>
            ),
            children: [
              { path: "dashboard", element: <AdminDashboard /> },
              { path: "leads", element: <LeadsPage /> },
              { path: "blog", element: <BlogPage /> },
              { path: "careers", element: <CareersPage /> },
              { path: "careers/:id/applications", element: <JobApplicationsPage /> },
              { path: "page-content/:pageName", element: <PageContentEditor /> },
              { path: "content/*", element: <ContentPage /> },
              { path: "settings", element: <SettingsPage /> },
              { path: "seo-settings", element: <SeoSettingsPage /> },
              { path: "programs", element: <ProgramsPage /> },
              { path: "services", element: <ServicesPage /> },
              { path: "products", element: <ProductsPage /> },
              { path: "system", element: <SystemPage /> },
              { index: true, element: <Navigate to="dashboard" replace /> },
            ]
          },
          { 
            index: true, 
            element: <Navigate to="/admin/dashboard" replace /> 
          },
        ],
      },

      // 404 - Not Found
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        )
      }
        ],
      }
    ],
  },
], {
  future: {
    v7_startTransition: true,
  },
});