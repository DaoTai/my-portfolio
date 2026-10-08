import { useRef } from "react";
import type { TouchEvent } from "react";

type SwipeHandlers = {
  onLeft?: () => void;
  onRight?: () => void;
  onDown?: () => void;
};

const THRESHOLD = 50;

/**
 * Touch swipe detection. Returns props to spread onto the swipeable element.
 * A swipe fires on the dominant axis only, so vertical scrolling stays untouched.
 */
export const useSwipe = ({ onLeft, onRight, onDown }: SwipeHandlers) => {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    // Ignore pinch gestures.
    if (e.touches.length !== 1) {
      start.current = null;
      return;
    }
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (!start.current) return;
    const dx = e.changedTouches[0].clientX - start.current.x;
    const dy = e.changedTouches[0].clientY - start.current.y;
    start.current = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -THRESHOLD) onLeft?.();
      else if (dx > THRESHOLD) onRight?.();
    } else if (dy > THRESHOLD * 2) {
      onDown?.();
    }
  };

  return { onTouchStart, onTouchEnd };
};
