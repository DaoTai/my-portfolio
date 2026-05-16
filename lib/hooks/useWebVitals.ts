/**
 * Web Vitals monitoring hook
 * Tracks Core Web Vitals and sends metrics
 */

import { useEffect } from "react";

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
}

export function useWebVitals(onMetric?: (metric: WebVitalMetric) => void) {
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== "production") return;

    const handler = async () => {
      // Dynamically import web-vitals only when needed
      const { getCLS, getFID, getFCP, getLCP, getTTFB } =
        await import("web-vitals");

      getCLS(onMetric);
      getFID(onMetric);
      getFCP(onMetric);
      getLCP(onMetric);
      getTTFB(onMetric);
    };

    // Use requestIdleCallback if available
    if ("requestIdleCallback" in window) {
      requestIdleCallback(handler);
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(handler, 0);
    }
  }, [onMetric]);
}

/**
 * Send metrics to analytics service
 */
export function sendMetricsToAnalytics(metric: WebVitalMetric) {
  // Send to your analytics endpoint
  const endpoint = "/api/metrics";

  if (navigator.sendBeacon) {
    const body = JSON.stringify(metric);
    navigator.sendBeacon(endpoint, body);
  } else {
    // Fallback for older browsers
    fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(metric),
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    }).catch(() => {
      // Silently fail if metrics can't be sent
    });
  }
}
