'use client'

import { useEffect, useRef } from "react";
import { useEffects } from "./effects-provider";

/**
 * Custom cursor: a small dot + larger ring that lags behind.
 * Ring scales up when hovering interactive elements.
 */
export function CursorTrail() {
  const { cursorTrail } = useEffects();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cursorTrail) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide native cursor on desktop only (mobile keeps native)
    if (window.matchMedia("(pointer: fine)").matches) {
      document.body.style.cursor = "none";
    }

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let rafId = 0;
    let hovering = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate3d(${mx - 4}px, ${my - 4}px, 0)`;

      const t = e.target as HTMLElement;
      const interactive = !!t.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      if (interactive !== hovering) {
        hovering = interactive;
        ring.style.width = hovering ? "56px" : "36px";
        ring.style.height = hovering ? "56px" : "36px";
        ring.style.borderColor = hovering
          ? "var(--aurora-3)"
          : "var(--aurora-2)";
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      const w = parseFloat(ring.style.width || "36");
      ring.style.transform = `translate3d(${rx - w / 2}px, ${ry - w / 2}px, 0)`;
      rafId = requestAnimationFrame(loop);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    loop();

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
      document.body.style.cursor = "";
    };
  }, [cursorTrail]);

  if (!cursorTrail) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
