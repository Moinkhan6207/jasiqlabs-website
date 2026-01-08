function upsertMeta(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertPropertyMeta(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (!href) return;
  let link = document.querySelector(`link[rel="canonical"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export function buildTitle(titleTemplate, pageTitle, siteName) {
  const t = (titleTemplate || "{{title}} | " + siteName).replace("{{title}}", pageTitle || siteName);
  return t;
}

/**
 * Apply SEO to the current document
 * @param {object} args
 * @param {object} args.defaults - global defaults
 * @param {object} args.pageSeo - page seo payload from API
 * @param {string} args.fallbackTitle - used if pageSeo.metaTitle missing
 */
export function applySeo({ defaults, pageSeo, fallbackTitle }) {
  const siteName = defaults?.siteName || "JASIQ Labs";
  const titleTemplate = defaults?.titleTemplate || "{{title}} | JASIQ Labs";

  const pageTitleRaw = pageSeo?.metaTitle || fallbackTitle || siteName;
  const title = buildTitle(titleTemplate, pageTitleRaw, siteName);

  document.title = title;

  const description =
    pageSeo?.metaDescription || defaults?.defaultMetaDescription || "JASIQ Labs official website.";

  upsertMeta("description", description);
  upsertMeta("robots", pageSeo?.robots || "index,follow");

  upsertCanonical(pageSeo?.canonicalUrl || "");

  // OpenGraph basics
  upsertPropertyMeta("og:title", pageSeo?.ogTitle || title);
  upsertPropertyMeta("og:description", pageSeo?.ogDescription || description);
  if (pageSeo?.ogImageUrl || defaults?.defaultOgImageUrl) {
    upsertPropertyMeta("og:image", pageSeo?.ogImageUrl || defaults?.defaultOgImageUrl);
  }
}
