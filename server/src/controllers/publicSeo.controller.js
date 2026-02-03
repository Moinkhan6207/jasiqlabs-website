import { prisma } from "../db/prisma.js";

export async function getSeoDefaults(_req, res) {
  try {
    const defaults = await prisma.seoSettings.findFirst();
    if (!defaults) {
      return res.json({
        siteName: "",
        titleTemplate: "%s",
        defaultMetaDescription: "",
        defaultOgImageUrl: "",
        defaultFaviconUrl: "",
      });
    }

    return res.json({
      siteName: defaults.siteName,
      titleTemplate: defaults.titleTemplate,
      defaultMetaDescription: defaults.defaultMetaDescription,
      defaultOgImageUrl: defaults.defaultOgImageUrl,
      defaultFaviconUrl: defaults.defaultFaviconUrl,
    });
  } catch (error) {
    console.error("Error fetching SEO defaults:", error);
    return res.json({
      siteName: "",
      titleTemplate: "%s",
      defaultMetaDescription: "",
      defaultOgImageUrl: "",
      defaultFaviconUrl: "",
    });
  }
}

export async function getPageSeo(req, res) {
  const { pageName } = req.params;
  
  if (!pageName) {
    return res.status(400).json({ error: "Page name is required" });
  }

  try {
    // Find the page by slug
    const page = await prisma.page.findUnique({
      where: { slug: pageName },
      include: {
        seo: true
      }
    });

    if (!page) {
      return res.json({
        pageName,
        metaTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        ogTitle: null,
        ogDescription: null,
        ogImageUrl: null,
        robots: null,
      });
    }

    // If page has SEO data, return it
    if (page.seo) {
      return res.json({
        pageName: page.slug,
        metaTitle: page.seo.metaTitle,
        metaDescription: page.seo.metaDescription,
        canonicalUrl: page.seo.canonicalUrl,
        ogTitle: page.seo.ogTitle,
        ogDescription: page.seo.ogDescription,
        ogImageUrl: page.seo.ogImageUrl,
        robots: page.seo.robots
      });
    }

    // If no SEO data exists, return empty object with pageName
    return res.json({
      pageName: page.slug,
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogTitle: null,
      ogDescription: null,
      ogImageUrl: null,
      robots: null
    });

  } catch (error) {
    console.error("Error fetching page SEO:", error);
    return res.json({
      pageName,
      metaTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogTitle: null,
      ogDescription: null,
      ogImageUrl: null,
      robots: null,
    });
  }
}
