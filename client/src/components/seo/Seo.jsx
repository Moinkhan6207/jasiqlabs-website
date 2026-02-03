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
  canonicalUrl = "",
  pageName = ""
}) {
  const [seoSettings, setSeoSettings] = useState(defaultSeoSettings);
  const [pageSeoData, setPageSeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch SEO settings from the backend on component mount
  useEffect(() => {
    const isAdminRoute = typeof window !== 'undefined' && window.location?.pathname?.startsWith('/admin');
    if (isAdminRoute) {
      setSeoSettings(defaultSeoSettings);
      setPageSeoData(null);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch general SEO settings
        const seoResponse = await api.seo.getSettings();
        if (seoResponse.data) {
          setSeoSettings(prev => ({
            ...defaultSeoSettings,
            ...seoResponse.data
          }));
        }

        // Fetch page-specific SEO data if pageName is provided
        if (pageName) {
          try {
            const pageSeoResponse = await api.public.getPageSeo(pageName);
            if (pageSeoResponse.data) {
              setPageSeoData(pageSeoResponse.data);
            }
          } catch (pageError) {
            // This is not an error - page might not have SEO data yet
          }
        }
      } catch (error) {
        // Use default settings if there's an error
        setSeoSettings(defaultSeoSettings);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pageName]);

  // Generate the page title based on the template
  const getPageTitle = () => {
    // Strictly prioritize database SEO data over prop title when pageName is provided
    let pageTitle = "";
    
    if (pageName && pageSeoData?.metaTitle) {
      pageTitle = pageSeoData.metaTitle;
    } else if (title) {
      pageTitle = title;
    }
    
    if (!pageTitle) return seoSettings.siteName;
    
    const finalTitle = seoSettings.titleTemplate
      .replace('{page}', pageTitle)
      .replace('{siteName}', seoSettings.siteName);
    
    return finalTitle;
  };

  // Use dynamic description if available, then prop description, then default
  const metaDescription = pageSeoData?.metaDescription || description || seoSettings.defaultMetaDescription;
  
  // Use dynamic OG image if available, then prop ogImage, then default
  const ogImageUrl = pageSeoData?.ogImageUrl || ogImage || seoSettings.defaultOgImageUrl;
  
  // Use dynamic canonical URL if available, then prop canonicalUrl
  const finalCanonicalUrl = pageSeoData?.canonicalUrl || canonicalUrl;
  
  // Use dynamic robots if available, then calculate from noIndex prop
  const robotsContent = pageSeoData?.robots || (noIndex ? "noindex, nofollow" : "index, follow");

  // Don't render anything while loading to prevent showing fallback titles
  if (isLoading) return null;

  return (
    <Helmet>
      <title>{getPageTitle()}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robotsContent} />
      
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
      {finalCanonicalUrl && <link rel="canonical" href={finalCanonicalUrl} />}
      
      {/* Additional meta tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
    </Helmet>
  );
}












