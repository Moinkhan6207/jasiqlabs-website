import express from "express";
import cors from "cors";
import helmet from "helmet";

import { env } from "./utils/env.js";
import { robotsRouter } from "./routes/robots.routes.js";
import { sitemapRouter } from "./routes/sitemap.routes.js";
import { publicSeoRouter } from "./routes/publicSeo.routes.js";
import publicPagesRouter from "./routes/publicPages.routes.js";
import leadsRouter from "./routes/leads.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: false
  })
);

app.use(express.json({ limit: "200kb" }));

// --- YAHAN CHANGE HAI (Explicit Routes) ---

// 1. Agar SEO ki baat ho (/api/public/seo/...)
app.use("/api/public/seo", publicSeoRouter);

// 2. Agar Pages ki baat ho (/api/public/pages/...)
app.use("/api/public/pages", publicPagesRouter);

// 3. Leads route with rate limiting
app.use("/api/public/leads", leadsRouter); 

// Health Check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Robots & Sitemap (Root level)
app.use("/", robotsRouter);
app.use("/", sitemapRouter);

// 404 Handler
app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(env.PORT, () => {
  console.log(`✅ API running on http://localhost:${env.PORT}`);
});