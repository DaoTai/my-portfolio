"use client";

import { lazyScene } from "@/components/common/LazyMount";

/** The radar/globe scene loads in its own chunk once the contact section is near. */
export const LazyContactBackground = lazyScene(() =>
  import("./ContactBackground").then((m) => ({ default: m.ContactBackground })),
);
