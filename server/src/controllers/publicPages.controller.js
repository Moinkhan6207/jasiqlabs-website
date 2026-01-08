import { prisma } from "../db/prisma.js";
import { env } from "../utils/env.js";

function buildCanonical(routePath, canonicalOverride) {
  if (canonicalOverride) return canonicalOverride;
  const base = env.SITE_URL.replace(/\/$/, "");
  return `${base}${routePath === "/" ? "" : routePath}`;
}

export async function getPageSeo(req, res) {
  const { slug } = req.params;

  const page = await prisma.page.findUnique({
    where: { slug },
    include: { seo: true }
  });

  if (!page) return res.status(404).json({ error: "Page not found" });

  const isAdmin = page.pageType === "ADMIN";
  const robots =
    isAdmin || page.isIndexable === false
      ? "noindex,nofollow"
      : (page.seo?.robots || "index,follow");

  return res.json({
    slug: page.slug,
    routePath: page.routePath,
    isIndexable: page.isIndexable && !isAdmin,
    metaTitle: page.seo?.metaTitle || null,
    metaDescription: page.seo?.metaDescription || null,
    canonicalUrl: buildCanonical(page.routePath, page.seo?.canonicalUrl),
    ogTitle: page.seo?.ogTitle || null,
    ogDescription: page.seo?.ogDescription || null,
    ogImageUrl: page.seo?.ogImageUrl || null,
    robots
  });
}

export async function getPageSections(req, res) {
  const { slug } = req.params;

  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return res.status(404).json({ error: "Page not found" });

  const sections = await prisma.pageSection.findMany({
    where: { pageId: page.id },
    orderBy: [{ sortOrder: "asc" }]
  });

  return res.json({
    slug,
    sections: sections.map((s) => ({
      sectionKey: s.sectionKey,
      sortOrder: s.sortOrder,
      content: s.contentJson
    }))
  });
}
