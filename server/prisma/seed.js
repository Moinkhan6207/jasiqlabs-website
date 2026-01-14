import { PrismaClient, PageType } from "@prisma/client";
import bcrypt from 'bcryptjs';

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

// Default admin user
const DEFAULT_ADMIN = {
  email: 'admin@jasiqlabs.com',
  password: 'admin123',
  
};

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1) Create default admin user if not exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: DEFAULT_ADMIN.email }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 12);
    await prisma.admin.create({
      data: {
        email: DEFAULT_ADMIN.email,
        password: hashedPassword,
        role: DEFAULT_ADMIN.role
      }
    });
    console.log('✅ Created default admin user');
  } else {
    console.log('ℹ️  Admin user already exists, skipping creation');
  }

  // 2) SEO defaults
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
    console.log('✅ Added default SEO settings');
  }

  // 3) Pages registry
  console.log('🔄 Syncing pages...');
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
  console.log(`✅ Synced ${PAGES.length} pages`);

  // 4) Create minimal sections for home page if not exists
  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    const existingSections = await prisma.pageSection.findFirst({ 
      where: { pageId: home.id } 
    });
    
    if (!existingSections) {
      await prisma.pageSection.createMany({
        data: [
          { 
            pageId: home.id, 
            sectionKey: "hero", 
            contentJson: { 
              title: "Welcome to JASIQ Labs",
              subtitle: "Building the future through innovation",
              ctaText: "Get Started",
              ctaLink: "/contact"
            }, 
            sortOrder: 1 
          },
          { 
            pageId: home.id, 
            sectionKey: "divisions", 
            contentJson: { 
              title: "Our Divisions",
              items: [
                {
                  title: "Real Work Studio",
                  description: "Hands-on training and real-world experience",
                  icon: "briefcase"
                },
                {
                  title: "Tech Works Studio",
                  description: "Custom software development and consulting",
                  icon: "code"
                },
                {
                  title: "Products & AI",
                  description: "Innovative products powered by AI",
                  icon: "cpu"
                }
              ]
            }, 
            sortOrder: 2 
          }
        ]
      });
      console.log('✅ Added default sections to home page');
    }
  }
}

main()
  .then(() => console.log("🌱 Database seeding completed successfully!"))
  .catch((error) => {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
