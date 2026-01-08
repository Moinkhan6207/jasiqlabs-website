import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../services/api";
import { applySeo } from "../seo/buildMeta";
import { trackEvent } from "../analytics/trackEvent";

function matchRoute(pathname, routes) {
  return routes.find((r) => r.path === pathname) || routes.find((r) => r.path === "/");
}

export function SeoRouteWrapper({ routes, children }) {
  const location = useLocation();
  const [defaults, setDefaults] = useState(null);

  const active = useMemo(() => matchRoute(location.pathname, routes), [location.pathname, routes]);

  useEffect(() => {
    let mounted = true;
    api.getSeoDefaults()
      .then((d) => mounted && setDefaults(d))
      .catch(() => mounted && setDefaults({ siteName: "JASIQ Labs", titleTemplate: "{{title}} | JASIQ Labs" }));
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!defaults || !active?.slug) return;

    let mounted = true;
    api.getPageSeo(active.slug)
      .then((pageSeo) => {
        if (!mounted) return;
        applySeo({ defaults, pageSeo, fallbackTitle: active.title });
        trackEvent("page_view", { page: location.pathname });
      })
      .catch(() => {
        if (!mounted) return;
        // Apply minimal SEO even on failure
        applySeo({
          defaults,
          pageSeo: { robots: "index,follow", canonicalUrl: window.location.href },
          fallbackTitle: active.title
        });
      });

    return () => { mounted = false; };
  }, [defaults, active, location.pathname]);

  return children;
}
