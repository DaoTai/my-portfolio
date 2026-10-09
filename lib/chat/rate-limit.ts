type Window = { count: number; resetAt: number };

/** Above this many tracked keys, expired windows are swept so the map can't grow forever. */
const PRUNE_AT = 1000;

/**
 * Fixed-window request counter per key, kept in memory. On serverless each instance has its own
 * map, so this is a best-effort brake on abuse, not a guarantee.
 */
export const createRateLimiter = ({
  limit,
  windowMs,
  now = Date.now,
}: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) => {
  const windows = new Map<string, Window>();

  return (key: string): boolean => {
    const t = now();
    if (windows.size > PRUNE_AT) {
      windows.forEach((w, k) => {
        if (w.resetAt <= t) windows.delete(k);
      });
    }

    const current = windows.get(key);
    if (!current || current.resetAt <= t) {
      windows.set(key, { count: 1, resetAt: t + windowMs });
      return true;
    }
    if (current.count >= limit) return false;
    current.count += 1;
    return true;
  };
};
