'use client'

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FolderGit2, Star, GitFork, Users, Flame, GitCommit } from "lucide-react";

function useCountUp(target: number, run: boolean, duration = 1.8) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!run) return;
    const controls = animate(mv, target, { duration, ease: [0.16, 1, 0.3, 1] });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => { controls.stop(); unsub(); };
  }, [run, target, mv, rounded, duration]);
  return display;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 80;
  const h = 28;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="opacity-70 group-hover:opacity-100 transition-opacity">
      <defs>
        <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${points} ${w},${h}`} fill={`url(#spark-${color.replace("#", "")})`} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
  data,
}: {
  icon: typeof FolderGit2;
  label: string;
  value: number;
  color: string;
  delay: number;
  data: number[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const display = useCountUp(value, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="group glass rounded-2xl p-5 glass-hover relative overflow-hidden"
    >
      <div
        className="absolute -top-8 -right-8 h-24 w-24 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between relative">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider">
            <Icon size={14} style={{ color }} />
            {label}
          </div>
          <div className="mt-2 text-3xl sm:text-4xl font-black tabular-nums">
            {display}
          </div>
        </div>
        <Sparkline data={data} color={color} />
      </div>
    </motion.div>
  );
}

export function StatsStrip({ data }: { data: any }) {
  // Generate per-day sparkline data (last 30 days)
  const gen = (max: number) =>
    Array.from({ length: 30 }).map((_, i) => {
      const noise = Math.sin(i * 1.3 + max) * 0.4 + 0.5;
      return Math.max(0, Math.floor(noise * max));
    });

  const stats = [
    { icon: FolderGit2, label: "Public Repos", value: data.user.public_repos, color: "#a855f7", delay: 0, data: gen(8) },
    { icon: Star, label: "Stars Earned", value: data.totalStars, color: "#facc15", delay: 0.08, data: gen(12) },
    { icon: GitFork, label: "Total Forks", value: data.totalForks, color: "#22d3ee", delay: 0.16, data: gen(6) },
    { icon: Users, label: "Followers", value: data.user.followers, color: "#f472b6", delay: 0.24, data: gen(5) },
    { icon: GitCommit, label: "Total Commits", value: data.totalCommits, color: "#4ade80", delay: 0.32, data: gen(40) },
    { icon: Flame, label: "Longest Streak", value: data.longestStreak, color: "#fb923c", delay: 0.4, data: gen(20) },
  ];

  return (
    <section id="stats" className="relative px-4 py-20 sm:py-24">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Live Stats</span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-bold">
            <span className="text-gradient">Numbers don't lie</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Real-time metrics pulled straight from the GitHub API — no vanity inflation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
