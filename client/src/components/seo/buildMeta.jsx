import React from 'react';
import { Helmet } from 'react-helmet-async';

// Ye Component hai jo aap use karna chahte hain
const BuildMeta = ({ title, description, slug }) => {
  const siteName = "JASIQ Labs";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDesc = description || "Hands-on training tailored for real-world projects.";
  
  // URL banana
  const baseUrl = "https://jasiqlabs.com"; // Apna asli domain yahan dalein
  const canonicalUrl = slug ? `${baseUrl}${slug}` : baseUrl;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
    </Helmet>
  );
};

// 👇 YE LINE SABSE IMPORTANT HAI (Iske bina error aayega)
export default BuildMeta;