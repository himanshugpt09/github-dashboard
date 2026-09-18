'use client'

import { motion, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { BrainCircuit } from "lucide-react";
import {
  SiOpenjdk,
  SiJavascript,
  SiPython,
  SiHtml5,
  SiGnubash,
  SiUbuntu,
  SiPostgresql,
  SiNumpy,
  SiPandas,
} from "@icons-pack/react-simple-icons";

type TechItem = {
  name: string;
  color: string;
  pct: number;
  years: number;
  lastProject: string;
  angle: number;
  distance: number;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
};

function buildTech(_langs: { name: string; pct: number; color: string }[]): TechItem[] {
  // 10 technologies — Mpl + Sns removed per request.
  // Java (OpenJDK), JavaScript, Python, HTML5, Bash, Ubuntu, SQL (PostgreSQL),
  // NumPy, Pandas, Machine Learning.
  const defaults = [
    { name: "Java",              color: "#ED8B00", pct: 22, years: 2, lastProject: "Course-Grading-System",            Icon: SiOpenjdk },
    { name: "JavaScript",        color: "#F7DF1E", pct: 30, years: 3, lastProject: "LLM-Agent-Browser-Based",        Icon: SiJavascript },
    { name: "Python",            color: "#3776AB", pct: 38, years: 3, lastProject: "Data_analyst_agent-2.0",          Icon: SiPython },
    { name: "HTML5",             color: "#E34F26", pct: 12, years: 3, lastProject: "Study-Notes-Hub",                 Icon: SiHtml5 },
    { name: "Bash",              color: "#4EAA25", pct: 8,  years: 2, lastProject: "deploy scripts",                  Icon: SiGnubash },
    { name: "Ubuntu",            color: "#E95420", pct: 10, years: 3, lastProject: "dev environment",                Icon: SiUbuntu },
    { name: "SQL",               color: "#4169E1", pct: 15, years: 2, lastProject: "Stores-Sales-Commission-Calculator", Icon: SiPostgresql },
    { name: "NumPy",             color: "#013243", pct: 25, years: 2, lastProject: "sensor-parser",                   Icon: SiNumpy },
    { name: "Pandas",            color: "#150458", pct: 28, years: 2, lastProject: "Data_analyst_agent-2.0",          Icon: SiPandas },
    { name: "Machine Learning", color: "#a855f7", pct: 20, years: 1, lastProject: "Data_analyst_agent-2.0",          Icon: BrainCircuit },
  ];

  return defaults.map((d, i) => ({
    ...d,
    angle: (i / defaults.length) * Math.PI * 2,
    distance: 200 + (i % 3) * 30,
  }));
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
            Hover any icon to see years of use and last project.
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
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  onClick={() => setSelected(selected === t.name ? null : t.name)}
                  onMouseEnter={() => setHovered(t.name)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute top-1/2 left-1/2 h-12 w-12 rounded-xl glass-strong flex items-center justify-center group/galaxy"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    color: t.color,
                    borderColor: isActive ? t.color : undefined,
                    boxShadow: isActive ? `0 0 20px ${t.color}` : `0 0 10px ${t.color}33`,
                  }}
                  aria-label={`${t.name}: ${t.pct}% of codebase, ${t.years} years`}
                >
                  <t.Icon size={22} color={t.color} />
                  {/* Tooltip on hover */}
                  <span
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded glass-strong opacity-0 group-hover/galaxy:opacity-100 transition-opacity pointer-events-none"
                    style={{ color: t.color }}
                  >
                    {t.name}
                  </span>
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
                          className="h-14 w-14 rounded-2xl glass-strong flex items-center justify-center"
                          style={{ color: t.color, borderColor: t.color + "55" }}
                        >
                          <t.Icon size={28} color={t.color} />
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
                  Each orbit represents a technology in my toolkit. Hover to inspect years of use and last project.
                </p>
              </div>
            )}

            {/* Tech mastery list — show the 10 specified techs by experience */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: "var(--glass-border)" }}>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                Toolkit · {techs.length} skills
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {techs.map((t) => (
                  <div key={t.name} className="flex items-center gap-2">
                    <t.Icon size={14} color={t.color} />
                    <span className="text-xs flex-1 truncate">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{t.years}y</span>
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
