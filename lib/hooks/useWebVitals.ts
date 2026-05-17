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
