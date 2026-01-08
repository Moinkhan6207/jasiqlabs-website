export function trackEvent(eventName, params = {}) {
    // Phase 1: Analytics hook (works if GA/gtag added in Phase 0)
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
    // If not configured yet, silently no-op (no console logs)
  }
  





