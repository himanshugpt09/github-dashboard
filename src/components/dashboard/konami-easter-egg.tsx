'use client'

import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export function KonamiEasterEgg() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[idx]) {
        idx++;
        if (idx === KONAMI.length) {
          setActive(true);
          idx = 0;
          setTimeout(() => setActive(false), 6000);
        }
      } else {
        idx = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!active) return null;
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center">
      <div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-4), var(--aurora-1))",
          opacity: 0.35,
          animation: "spin 3s linear infinite",
        }}
      />
      <div className="relative glass-strong px-10 py-8 rounded-2xl text-center">
        <p className="text-3xl font-bold text-gradient">🎉 KONAMI UNLOCKED</p>
        <p className="text-sm text-muted-foreground mt-2">
          You found the secret. Welcome, fellow gamer.
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
