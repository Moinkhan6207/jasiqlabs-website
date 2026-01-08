import { ENV } from "../config/env";

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// Helper to build API URL - handles base URL with or without /api
function buildApiUrl(endpoint) {
  const base = ENV.API_BASE_URL || "http://localhost:8080";
  // Remove trailing slash if present
  const cleanBase = base.replace(/\/$/, '');
  
  // If base URL already ends with /api, use /public/... endpoints
  // Otherwise, use /api/public/... endpoints
  if (cleanBase.endsWith('/api')) {
    return `${cleanBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  }
  return `${cleanBase}/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
}

export const api = {
  async getSeoDefaults() {
    const res = await fetch(buildApiUrl('/public/seo/defaults'));
    if (!res.ok) throw new Error(`SEO defaults failed: ${res.status}`);
    return safeJson(res);
  },

  async getPageSeo(slug) {
    const res = await fetch(buildApiUrl(`/public/pages/${encodeURIComponent(slug)}/seo`));
    if (!res.ok) throw new Error(`Page SEO failed: ${res.status}`);
    return safeJson(res);
  },

  async getPageSections(slug) {
    const res = await fetch(buildApiUrl(`/public/pages/${encodeURIComponent(slug)}/sections`));
    if (!res.ok) throw new Error(`Page sections failed: ${res.status}`);
    return safeJson(res);
  },

  async submitLead(leadData) {
    const res = await fetch(buildApiUrl('/public/leads'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });
    if (!res.ok) {
      const error = await safeJson(res);
      throw { response: { data: error } };
    }
    return safeJson(res);
  }
};
