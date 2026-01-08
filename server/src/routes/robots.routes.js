import { Router } from "express";
import { env } from "../utils/env.js";

export const robotsRouter = Router();

robotsRouter.get("/robots.txt", (_req, res) => {
  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    "Disallow: /admin",
    `Sitemap: ${env.SITE_URL.replace(/\/$/, "")}/sitemap.xml`
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.status(200).send(content);
});
