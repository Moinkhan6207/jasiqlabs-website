import { prisma } from "../db/prisma.js";

export async function getSeoDefaults(_req, res) {
  const defaults = await prisma.seoSettings.findFirst();
  if (!defaults) {
    return res.status(404).json({ error: "SEO defaults not found" });
  }
  return res.json({
    siteName: defaults.siteName,
    titleTemplate: defaults.titleTemplate,
    defaultMetaDescription: defaults.defaultMetaDescription,
    defaultOgImageUrl: defaults.defaultOgImageUrl,
    defaultFaviconUrl: defaults.defaultFaviconUrl
  });
}
