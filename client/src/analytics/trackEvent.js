// client/src/analytics/trackEvent.js

// 1. Basic generic tracker
export function trackEvent(eventName, params = {}) {
  // Phase 1: Agar Google Analytics (gtag) window object pe hai, to event bhejo
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else {
    // Development ke liye console log (taaki pata chale event fire hua)
    console.log(`📡 TRACKING: ${eventName}`, params);
  }
}

// 2. Page View Tracker
export function trackPageView(pagePath) {
  trackEvent('page_view', { page_path: pagePath });
}

// 3. CTA Click Tracker (Buttons)
export function trackCTAClick(buttonName) {
  trackEvent('cta_click', { button_name: buttonName });
}

// 4. Division Click Tracker (RealWork, TechWorks etc.)
export function trackDivisionClick(divisionName) {
  trackEvent('division_click', { division: divisionName });
}

// 5. Form Submit Tracker
export function trackFormSubmit(formName) {
  trackEvent('form_submit', { form_name: formName });
}