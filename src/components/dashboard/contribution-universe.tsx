'use client'

import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Calendar, Trophy, Activity } from "lucide-react";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const LEVEL_COLORS = [
  "var(--glass-border)",
  "oklch(0.78 0.18 200)",
  "oklch(0.65 0.22 200)",
  "oklch(0.55 0.27 220)",
  "oklch(0.48 0.30 280)",
];

const CELL = 18;
const GAP = 4;

function HexCell({ day, index }: { day: Day; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative"
      style={{ width: CELL, height: CELL }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "20px" }}
        transition={{ duration: 0.25, delay: Math.min(index * 0.002, 0.4) }}
        className="absolute inset-[1px] cursor-pointer transition-transform hover:scale-125"
        style={{
          background: LEVEL_COLORS[day.level],
          clipPath:
            "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
          boxShadow:
            day.level >= 3 ? `0 0 6px ${LEVEL_COLORS[day.level]}` : "none",
        }}
      />
      {hover && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-9 z-30 glass-strong rounded-lg px-2 py-1 text-[10px] whitespace-nowrap pointer-events-none">
          <span className="font-semibold">{day.count}</span> commits ·{" "}
          <span className="text-muted-foreground">{day.date}</span>
        </div>
      )}
    </div>
  );
}

export function ContributionUniverse({ data }: { data: any }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [snakeIdx, setSnakeIdx] = useState(0);

  const weeks = useMemo(() => {
    const w: Day[][] = [];
    for (let i = 0; i < data.contributions.length; i += 7) {
      w.push(data.contributions.slice(i, i + 7));
    }
    return w;
  }, [data.contributions]);

  const highDays = useMemo(
    () => data.contributions.filter((d: Day) => d.level >= 2).slice(0, 30),
    [data.contributions]
  );

  useEffect(() => {
    if (!inView || highDays.length === 0) return;
    const id = setInterval(() => {
      setSnakeIdx((i) => (i + 1) % highDays.length);
    }, 600);
    return () => clearInterval(id);
  }, [inView, highDays.length]);

  const totalCommits = data.contributions.reduce((a: number, d: Day) => a + d.count, 0);
  const activeDays = data.contributions.filter((d: Day) => d.count > 0).length;
  const activePct = Math.round((activeDays / data.contributions.length) * 100);

  return (
    <section id="contributions" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Contribution Universe</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">53 weeks of chaos</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            A custom hex-grid contribution graph. Hover any cell for details.
          </p>
        </motion.div>

        <div ref={ref} className="glass rounded-3xl p-4 sm:p-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { icon: Calendar, label: "Active days", value: activeDays, color: "var(--aurora-2)" },
              { icon: Flame, label: "Total commits", value: totalCommits, color: "var(--aurora-4)" },
              { icon: Trophy, label: "Best day", value: `${data.bestDay.count} commits`, color: "var(--aurora-3)" },
              { icon: Activity, label: "Active rate", value: `${activePct}%`, color: "var(--aurora-1)" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-3 flex items-center gap-2"
              >
                <s.icon size={16} style={{ color: s.color }} />
                <div>
                  <div className="text-[10px] uppercase text-muted-foreground tracking-wider">{s.label}</div>
                  <div className="font-bold tabular-nums">{s.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Hex grid */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-y-0 min-w-max" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map((day, di) => {
                    const flatIdx = wi * 7 + di;
                    const isSnake =
                      highDays[snakeIdx] &&
                      highDays[snakeIdx].date === day.date &&
                      day.level >= 2;
                    return (
                      <div
                        key={di}
                        className="relative"
                        style={{
                          width: CELL,
                          height: CELL,
                          transform: isSnake ? "scale(1.4)" : "scale(1)",
                          transition: "transform 0.4s ease",
                          zIndex: isSnake ? 5 : 1,
                        }}
                      >
                        <HexCell day={day} index={flatIdx} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
            <span>Less</span>
            {LEVEL_COLORS.map((c, i) => (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  background: c,
                  clipPath: "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%)",
                }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
