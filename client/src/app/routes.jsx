import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import About from "../pages/About";
import ContactPage from "../pages/Contact";
import PrivacyPolicy from "../pages/legal/PrivacyPolicy";
import Terms from "../pages/legal/Terms";
import RefundCancellation from "../pages/legal/RefundCancellation";
import Disclaimer from "../pages/legal/Disclaimer";
import CookiePolicy from "../pages/legal/CookiePolicy";
import RealWorkStudioPage from "../pages/realworkstudio/RwsHome";
import TechWorksStudioPage from "../pages/techworksstudio/TwsHome";
import ProductsPage from "../pages/ProductsPage";
import RwsLayout from "../pages/realworkstudio/RwsLayout";
import RwsHome from "../pages/realworkstudio/RwsHome";
import Programs from "../pages/realworkstudio/Programs";
import InternshipModel from "../pages/realworkstudio/InternshipModel";
import StudentJourney from "../pages/realworkstudio/StudentJourney";
import Faqs from "../pages/realworkstudio/Faqs";
import Apply from "../pages/realworkstudio/Apply";
import TwsLayout from "../pages/techworksstudio/TwsLayout";
import TwsHome from "../pages/techworksstudio/TwsHome";
import TwsServices from "../pages/techworksstudio/Services";
import TwsProcess from "../pages/techworksstudio/Process";
import TwsContact from "../pages/techworksstudio/Contact";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <ContactPage /> },
      { path: "legal/privacy-policy", element: <PrivacyPolicy /> },
      { path: "legal/terms", element: <Terms /> },
      // Note: URL path 'refund-policy' or 'refund-cancellation' check kar lein
      { path: "legal/refund-cancellation", element: <RefundCancellation /> }, 
      { path: "legal/disclaimer", element: <Disclaimer /> },
      { path: "legal/cookie-policy", element: <CookiePolicy /> },
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
        ]
      },
      {
        path: "techworksstudio",
        element: <TwsLayout />,
        children: [
          { index: true, element: <TwsHome /> },
          { path: "services", element: <TwsServices /> },
          { path: "process", element: <TwsProcess /> },
          { path: "contact", element: <TwsContact /> },
        ]
      },
      { path: "techWorksstudiopage", element: <TechWorksStudioPage /> },
      { path: "productspage", element: <ProductsPage /> },
    ]
  }
];