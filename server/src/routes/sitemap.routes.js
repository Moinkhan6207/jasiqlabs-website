import { Router } from "express";
import { prisma } from "../db/prisma.js";
import { env } from "../utils/env.js";

export const sitemapRouter = Router();

function escapeXml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

sitemapRouter.get("/sitemap.xml", async (_req, res) => {
  const pages = await prisma.page.findMany({
    where: { pageType: "PUBLIC", isIndexable: true },
    select: { routePath: true, updatedAt: true },
    orderBy: { routePath: "asc" }
  });

  const base = env.SITE_URL.replace(/\/$/, "");

  const urls = pages
    .map((p) => {
      const loc = `${base}${p.routePath === "/" ? "" : p.routePath}`;
      const lastmod = new Date(p.updatedAt).toISOString();
      return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.status(200).send(xml);
});
