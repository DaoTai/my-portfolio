"use client";

import { lazyScene } from "@/components/common/LazyMount";

/** The constellation/stack/globe scene loads in its own chunk once the section is near. */
export const LazyExpertiseBackground = lazyScene(() =>
  import("./ExpertiseBackground").then((m) => ({ default: m.ExpertiseBackground })),
);
