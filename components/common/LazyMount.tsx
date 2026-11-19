"use client";

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

type LazyMountProps = {
  children: ReactNode;
  /** How far outside the viewport the placeholder starts the mount. */
  rootMargin?: string;
  /** Classes for the empty placeholder; match the real element's box so nothing shifts. */
  placeholderClassName?: string;
};

/**
 * Renders an empty placeholder until it comes near the viewport, then swaps in `children`.
 * Keeps heavy off-screen decoration out of the server HTML, hydration and the first style pass.
 */
export const LazyMount = ({
  children,
  rootMargin = "400px 0px",
  placeholderClassName = "pointer-events-none absolute inset-0",
}: LazyMountProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (show || !el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShow(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  if (show) return <>{children}</>;
  return <div ref={ref} aria-hidden="true" className={placeholderClassName} />;
};

/**
 * A decorative scene split into its own chunk and mounted only near the viewport.
 * `load` must resolve to a module whose `default` is the scene (map a named export onto it).
 */
export const lazyScene = (
  load: () => Promise<{ default: ComponentType }>,
  rootMargin?: string,
) => {
  const Scene = lazy(load);
  const LazyScene = () => (
    <LazyMount rootMargin={rootMargin}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </LazyMount>
  );
  return LazyScene;
};
