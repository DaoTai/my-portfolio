"use client";

import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. Needed where a breakpoint has to be known in JS
 * rather than CSS — e.g. enabling a drag gesture on mobile only.
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
};
