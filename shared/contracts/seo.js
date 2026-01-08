import { z } from "zod";

export const SeoDefaultsSchema = z.object({
  siteName: z.string(),
  titleTemplate: z.string(),
  defaultMetaDescription: z.string(),
  defaultOgImageUrl: z.string().nullable().optional(),
  defaultFaviconUrl: z.string().nullable().optional()
});

export const PageSeoSchema = z.object({
  slug: z.string(),
  routePath: z.string(),
  isIndexable: z.boolean(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  canonicalUrl: z.string(),
  ogTitle: z.string().nullable(),
  ogDescription: z.string().nullable(),
  ogImageUrl: z.string().nullable(),
  robots: z.string()
});
