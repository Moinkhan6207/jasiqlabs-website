import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./app/App";
import { injectGA } from "./analytics/ga";
import "./index.css"; 

// Google Analytics Initialize
injectGA(import.meta.env.VITE_GA_MEASUREMENT_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Yahan se BrowserRouter hata diya gaya hai */}
      <App />
    </HelmetProvider>
  </React.StrictMode>
);