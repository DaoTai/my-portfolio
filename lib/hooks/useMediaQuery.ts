"use client";

import { useCallback, useSyncExternalStore } from "react";

const getServerSnapshot = () => false;

/**
 * Subscribes to a CSS media query. Needed where a breakpoint has to be known in JS
 * rather than CSS — e.g. enabling a drag gesture on mobile only.
 *
 * Always `false` on the server and during hydration, then the real value right after: reading
 * `matchMedia` in the first client render made the markup differ from the server's on phones,
 * which threw away the server HTML and re-rendered the whole page (React error #418).
 */
export const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
