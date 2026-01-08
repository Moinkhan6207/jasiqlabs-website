import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import Terms from "../pages/legal/Terms";
import RefundCancellation from "../pages/legal/RefundCancellation";
import Disclaimer from "../pages/legal/Disclaimer";
import CookiePolicy from "../pages/legal/CookiePolicy";
import RealWorkStudioPage from "../pages/RealWorkStudioPage";
import TechWorksStudioPage from "../pages/TechWorksStudioPage";
import ProductsPage from "../pages/ProductsPage";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "legal/privacy-policy", element: <PrivacyPolicy /> },
      { path: "legal/terms", element: <Terms /> },
      // Note: URL path 'refund-policy' or 'refund-cancellation' check kar lein
      { path: "legal/refund-cancellation", element: <RefundCancellation /> }, 
      { path: "legal/disclaimer", element: <Disclaimer /> },
      { path: "legal/cookie-policy", element: <CookiePolicy /> },
      { path: "realworkstudio", element: <RealWorkStudioPage /> },
      { path: "techWorksstudiopage", element: <TechWorksStudioPage /> },
      { path: "productspage", element: <ProductsPage /> },

    ]
  }
];