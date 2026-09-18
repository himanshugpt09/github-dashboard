'use client'

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type TechItem = {
  name: string;
  short: string;
  color: string;
  pct: number;
  years: number;
  lastProject: string;
  angle: number;
  distance: number;
};

function buildTech(langs: { name: string; pct: number; color: string }[]): TechItem[] {
  const defaults = [
    { name: "TypeScript", short: "TS", color: "#3178c6", pct: 28, years: 2, lastProject: "GitHub Dashboard" },
    { name: "JavaScript", short: "JS", color: "#f1e05a", pct: 35, years: 3, lastProject: "Course-Grading-System" },
    { name: "Python", short: "Py", color: "#3572A5", pct: 18, years: 2, lastProject: "flask-task-api" },
    { name: "HTML", short: "H5", color: "#e34c26", pct: 12, years: 3, lastProject: "Study-Notes-Hub" },
    { name: "CSS", short: "CS", color: "#563d7c", pct: 5, years: 3, lastProject: "Shipping-Estimator" },
    { name: "React", short: "Re", color: "#61dafb", pct: 22, years: 2, lastProject: "Dashboard UI" },
    { name: "Next.js", short: "Nx", color: "#ffffff", pct: 20, years: 1, lastProject: "Profile Dashboard" },
    { name: "Node.js", short: "Nd", color: "#83cd29", pct: 15, years: 2, lastProject: "Bank-reconciler" },
    { name: "Tailwind", short: "Tw", color: "#38bdf8", pct: 18, years: 1, lastProject: "Glass UI" },
    { name: "Prisma", short: "Pr", color: "#5a67d8", pct: 8, years: 1, lastProject: "DB layer" },
    { name: "Git", short: "Gt", color: "#f05033", pct: 30, years: 3, lastProject: "every repo" },
    { name: "Bun", short: "Bn", color: "#fbf0df", pct: 10, years: 1, lastProject: "build pipeline" },
  ];

  const merged: TechItem[] = defaults.map((d, i) => {
    const langMatch = langs.find((l) => l.name === d.name);
    const pct = langMatch ? Math.round(langMatch.pct) : d.pct;
    return {
      ...d,
      pct,
      angle: (i / defaults.length) * Math.PI * 2,
      distance: 200 + (i % 3) * 30,
    };
  });
  return merged;
}

export function TechStackGalaxy({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const techs = useMemo(() => buildTech(data.languages), [data.languages]);

  return (
    <section id="tech" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Tech Stack Galaxy</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Tools of the trade</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Hover an icon to see years of use and last project. Click to filter featured projects below.
          </p>
        </motion.div>

        <div ref={ref} className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Galaxy view */}
          <div className="relative h-[420px] sm:h-[460px] glass rounded-3xl overflow-hidden">
            {/* Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative h-20 w-20">
                <div
                  className="absolute -inset-6 rounded-full blur-2xl opacity-70"
                  style={{ background: "conic-gradient(from 0deg, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-4), var(--aurora-1))" }}
                />
                <div className="relative h-full w-full rounded-full glass-strong flex items-center justify-center">
                  <span className="text-2xl font-black text-gradient">HG</span>
                </div>
              </div>
            </div>

            {/* Orbit rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border" style={{ width: 280, height: 280, borderColor: "var(--glass-border)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-60" style={{ width: 380, height: 380, borderColor: "var(--glass-border)" }} />

            {/* Tech icons */}
            {techs.map((t, i) => {
              const x = Math.cos(t.angle) * t.distance;
              const y = Math.sin(t.angle) * t.distance;
              const isActive = hovered === t.name || selected === t.name;
              return (
                <motion.button
                  key={t.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: i * 0.05, duration: 0.4, type: "spring", stiffness: 200 }}
                  whileHover={{ scale: 1.25, zIndex: 10 }}
                  onClick={() => setSelected(selected === t.name ? null : t.name)}
                  onMouseEnter={() => setHovered(t.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute top-1/2 left-1/2 h-12 w-12 rounded-xl glass-strong flex items-center justify-center font-bold text-xs"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    color: t.color,
                    borderColor: isActive ? t.color : undefined,
                    boxShadow: isActive ? `0 0 20px ${t.color}` : undefined,
                  }}
                  aria-label={`${t.name}: ${t.pct}% of codebase, ${t.years} years`}
                >
                  {t.short}
                </motion.button>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="glass rounded-3xl p-6 min-h-[420px]">
            {hovered || selected ? (
              <motion.div
                key={hovered || selected || "none"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {(() => {
                  const t = techs.find((x) => x.name === (hovered || selected));
                  if (!t) return null;
                  return (
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center font-bold"
                          style={{ color: t.color, borderColor: t.color }}
                        >
                          {t.short}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{t.name}</h3>
                          <p className="text-sm text-muted-foreground">{t.years} {t.years === 1 ? "year" : "years"} of experience</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Codebase share</span>
                            <span className="font-semibold" style={{ color: t.color }}>{t.pct}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-border)" }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${t.pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full"
                              style={{ background: t.color }}
                            />
                          </div>
                        </div>
                        <div className="glass rounded-xl p-3">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Last seen in</div>
                          <div className="font-mono text-sm mt-1">{t.lastProject}</div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-3">🛰️</div>
                <h3 className="text-xl font-bold">Hover any icon</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Each orbit represents a technology in my toolkit. Hover to inspect, click to filter projects below.
                </p>
              </div>
            )}

            {/* Top languages list */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">Top by bytes</div>
              <div className="space-y-2">
                {data.languages.slice(0, 5).map((lang: any) => (
                  <div key={lang.name} className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full" style={{ background: lang.color }} />
                    <span className="text-sm flex-1">{lang.name}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{lang.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
