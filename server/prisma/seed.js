import { PrismaClient, PageType } from "@prisma/client";

const prisma = new PrismaClient();

const PAGES = [
  // Phase 1 public pages
  { slug: "home", routePath: "/", pageType: "PUBLIC", isIndexable: true },
  { slug: "about", routePath: "/about", pageType: "PUBLIC", isIndexable: true },
  { slug: "contact", routePath: "/contact", pageType: "PUBLIC", isIndexable: true },

  // Legal
  { slug: "legal-privacy-policy", routePath: "/legal/privacy-policy", pageType: "PUBLIC", isIndexable: true },
  { slug: "legal-terms", routePath: "/legal/terms", pageType: "PUBLIC", isIndexable: true },
  { slug: "legal-refund-policy", routePath: "/legal/refund-policy", pageType: "PUBLIC", isIndexable: true },
  { slug: "legal-disclaimer", routePath: "/legal/disclaimer", pageType: "PUBLIC", isIndexable: true },
  { slug: "legal-cookie-policy", routePath: "/legal/cookie-policy", pageType: "PUBLIC", isIndexable: true },

  // Future placeholders (still public routes)
  { slug: "realworkstudio", routePath: "/realworkstudio", pageType: "PUBLIC", isIndexable: true },
  { slug: "techworksstudio", routePath: "/techworksstudio", pageType: "PUBLIC", isIndexable: true },
  { slug: "products", routePath: "/products", pageType: "PUBLIC", isIndexable: true },
  { slug: "blog", routePath: "/blog", pageType: "PUBLIC", isIndexable: true },
  { slug: "careers", routePath: "/careers", pageType: "PUBLIC", isIndexable: true },

  // Admin placeholder (no-index)
  { slug: "admin", routePath: "/admin", pageType: "ADMIN", isIndexable: false }
];

async function main() {
  // 1) SEO defaults
  const existingSeo = await prisma.seoSettings.findFirst();
  if (!existingSeo) {
    await prisma.seoSettings.create({
      data: {
        siteName: "JASIQ Labs",
        titleTemplate: "{{title}} | JASIQ Labs",
        defaultMetaDescription:
          "JASIQ Labs builds careers, software, and AI-first products through training, services, and product innovation.",
        defaultOgImageUrl: null,
        defaultFaviconUrl: null
      }
    });
  }

  // 2) Pages registry
  for (const p of PAGES) {
    await prisma.page.upsert({
      where: { slug: p.slug },
      update: {
        routePath: p.routePath,
        pageType: p.pageType,
        isIndexable: p.isIndexable
      },
      create: {
        slug: p.slug,
        routePath: p.routePath,
        pageType: p.pageType,
        isIndexable: p.isIndexable
      }
    });
  }

  // 3) Create minimal sections for key pages (empty structured blocks)
  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    const existingSections = await prisma.pageSection.findFirst({ where: { pageId: home.id } });
    if (!existingSections) {
      await prisma.pageSection.createMany({
        data: [
          { pageId: home.id, sectionKey: "hero", contentJson: { title: "JASIQ Labs" }, sortOrder: 1 },
          { pageId: home.id, sectionKey: "divisions", contentJson: { items: [] }, sortOrder: 2 }
        ]
      });
    }
  }
}

main()
  .then(() => console.log("✅ Seed completed"))
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
