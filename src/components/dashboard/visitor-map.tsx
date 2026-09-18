'use client'

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Eye, Globe2 } from "lucide-react";

function useCountUp(target: number, run: boolean) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / 2000, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, target]);
  return v.toLocaleString();
}

// Simple inline world map with dots (using SVG paths)
const VISITOR_DOTS = [
  { x: 20, y: 30, count: 124, label: "San Francisco, US" },
  { x: 28, y: 42, count: 88, label: "New York, US" },
  { x: 47, y: 36, count: 412, label: "London, UK" },
  { x: 51, y: 38, count: 156, label: "Berlin, DE" },
  { x: 56, y: 47, count: 98, label: "Dubai, AE" },
  { x: 67, y: 50, count: 287, label: "Bengaluru, IN" },
  { x: 70, y: 48, count: 198, label: "Hyderabad, IN" },
  { x: 73, y: 42, count: 76, label: "Beijing, CN" },
  { x: 80, y: 44, count: 134, label: "Tokyo, JP" },
  { x: 85, y: 68, count: 65, label: "Sydney, AU" },
  { x: 35, y: 65, count: 42, label: "São Paulo, BR" },
  { x: 50, y: 70, count: 31, label: "Cape Town, ZA" },
];

export function VisitorMap({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(data.visitorCount, inView);
  const [hovered, setHovered] = useState<number | null>(null);
  const [userCity, setUserCity] = useState<string>("—");

  // Try to detect visitor's location (best-effort via timezone)
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const city = tz.split("/").pop()?.replace(/_/g, " ") || "Earth";
      setUserCity(city);
    } catch {}
  }, []);

  return (
    <section id="visitors" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Visitor Map</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Welcome, traveler</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            See where the world is checking in from. You're visitor #{count}.
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* World map */}
          <div className="glass rounded-3xl p-4 sm:p-6 relative overflow-hidden">
            <div className="aspect-[2/1] relative">
              {/* World silhouette (rough SVG) */}
              <svg viewBox="0 0 100 50" className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
                {/* Americas */}
                <path d="M 15 12 Q 20 10 22 14 L 24 22 Q 22 30 18 36 L 14 42 Q 12 38 14 28 Q 14 18 15 12 Z" fill="var(--foreground)" />
                <path d="M 22 36 Q 26 40 28 46 L 26 50 L 24 48 Z" fill="var(--foreground)" />
                {/* Europe + Africa */}
                <path d="M 45 12 Q 52 10 55 14 L 56 22 Q 54 28 50 32 L 48 30 L 46 22 Q 45 16 45 12 Z" fill="var(--foreground)" />
                <path d="M 48 30 Q 52 32 56 36 L 58 44 L 54 48 L 50 44 Q 47 36 48 30 Z" fill="var(--foreground)" />
                {/* Asia */}
                <path d="M 58 12 Q 75 8 85 14 L 84 24 Q 80 30 72 30 L 64 26 Q 60 20 58 12 Z" fill="var(--foreground)" />
                {/* Australia */}
                <path d="M 80 40 Q 88 38 92 42 L 90 46 L 82 46 Z" fill="var(--foreground)" />
              </svg>

              {/* Visitor dots */}
              {VISITOR_DOTS.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={inView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Pulsing ring */}
                  <div
                    className="absolute -inset-3 rounded-full pulse-ring"
                    style={{ background: `var(--aurora-${(i % 4) + 1})`, opacity: 0.5 }}
                  />
                  {/* Dot */}
                  <div
                    className="relative h-3 w-3 rounded-full"
                    style={{
                      background: `var(--aurora-${(i % 4) + 1})`,
                      boxShadow: `0 0 16px var(--aurora-${(i % 4) + 1}), 0 0 6px var(--aurora-${(i % 4) + 1})`,
                    }}
                  />
                  {hovered === i && (
                    <div className="absolute left-1/2 -translate-x-1/2 -top-10 glass-strong rounded-lg px-2 py-1 text-[10px] whitespace-nowrap z-10">
                      <span className="font-semibold">{d.count}</span>{" "}
                      <span className="text-muted-foreground">visits from</span>
                      <div className="font-bold" style={{ color: `var(--aurora-${(i % 4) + 1})` }}>{d.label}</div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Visitor counter card */}
          <div className="glass rounded-3xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <Eye size={14} /> All-time visits
            </div>
            <div className="text-5xl font-black tabular-nums text-gradient">{count}</div>
            <div className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 8) + 1} in the last hour
            </div>

            <div className="glass rounded-xl p-3 mt-2">
              <div className="flex items-center gap-2 text-xs">
                <Globe2 size={14} style={{ color: "var(--aurora-2)" }} />
                <span className="text-muted-foreground">You're visiting from</span>
              </div>
              <div className="font-bold mt-1 text-sm">{userCity}</div>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Top countries</div>
              {[
                { country: "India", flag: "🇮🇳", count: 485 },
                { country: "USA", flag: "🇺🇸", count: 212 },
                { country: "Germany", flag: "🇩🇪", count: 156 },
                { country: "UK", flag: "🇬🇧", count: 412 },
              ].map((c) => (
                <div key={c.country} className="flex items-center gap-2 text-xs">
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1">{c.country}</span>
                  <span className="tabular-nums text-muted-foreground">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
