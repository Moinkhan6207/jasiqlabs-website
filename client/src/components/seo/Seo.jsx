import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import api from "../../services/api";

// Default SEO settings if none are found in the backend
const defaultSeoSettings = {
  siteName: "JASIQ Labs",
  titleTemplate: "{page} | {siteName}",
  defaultMetaDescription: "JASIQ Labs - Innovative technology solutions for your business",
  defaultOgImageUrl: "/images/og-default.jpg",
  defaultFaviconUrl: "/favicon.ico"
};

export default function Seo({ 
  title = "", 
  description = "",
  noIndex = false,
  ogImage = "",
  canonicalUrl = ""
}) {
  const [seoSettings, setSeoSettings] = useState(defaultSeoSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch SEO settings from the backend on component mount
  useEffect(() => {
    const fetchSeoSettings = async () => {
      try {
        const response = await api.seo.getSettings();
        if (response.data) {
          setSeoSettings(prev => ({
            ...defaultSeoSettings,
            ...response.data
          }));
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error);
        // Use default settings if there's an error
        setSeoSettings(defaultSeoSettings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeoSettings();
  }, []);

  // Generate the page title based on the template
  const getPageTitle = () => {
    if (!title) return seoSettings.siteName;
    return seoSettings.titleTemplate
      .replace('{page}', title)
      .replace('{siteName}', seoSettings.siteName);
  };

  // Use the provided description or fall back to the default
  const metaDescription = description || seoSettings.defaultMetaDescription;
  const ogImageUrl = ogImage || seoSettings.defaultOgImageUrl;

  if (isLoading) return null;

  return (
    <Helmet>
      <title>{getPageTitle()}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getPageTitle()} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
      
      {/* Favicon */}
      <link rel="icon" href={seoSettings.defaultFaviconUrl} />
      <link rel="apple-touch-icon" href={seoSettings.defaultFaviconUrl} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Helmet>
  );
}












